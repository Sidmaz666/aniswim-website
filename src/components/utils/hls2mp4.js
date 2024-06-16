import { FFmpeg } from '@ffmpeg/ffmpeg'
import aesjs from 'aes-js'

export const TaskType = {
    loadFFmeg: 0,
    parseM3u8: 1,
    downloadTs: 2,
    mergeTs: 3
};

function fetchFile(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => new Uint8Array(arrayBuffer));
}

function toBlobURL(url, type) {
    return fetchFile(url)
        .then(data => URL.createObjectURL(new Blob([data.buffer], { type })));
}

function createFileUrlRegExp(ext, flags) {
    return new RegExp('(https?://)?[\\w:\\.\\-\\/]+?\\.' + ext, flags);
}

function parseUrl(url, path) {
    if (path.startsWith('http')) {
        return path;
    }
    return new URL(path, url).href;
}

const ffmpegDefaultBaseUrl = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';

class Hls2Mp4 {
    constructor({
        maxRetry = 3,
        tsDownloadConcurrency = 10,
        ffmpegBaseUrl = ffmpegDefaultBaseUrl,
        onProgress,
        onError
    }) {
        this.ffmpeg = new FFmpeg();
        this.maxRetry = maxRetry;
        this.tsDownloadConcurrency = tsDownloadConcurrency;
        this.ffmpegBaseUrl = ffmpegBaseUrl;
        this.onProgress = onProgress ?? _onProgress;
        this.onError = onError ?? _onError;
        this.cancelled = false; // Add a flag for cancellation
    }

    transformBuffer(buffer) {
        if (buffer[0] === 0x47) {
            return buffer;
        }
        let bufferOffset = 0;
        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] === 0x47 && buffer[i + 1] === 0x40) {
                bufferOffset = i;
                break;
            }
        }
        return buffer.slice(bufferOffset);
    }

    hexToUint8Array(hex) {
        const matchedChars = hex.replace(/^0x/, '').match(/[\da-f]{2}/gi);
        if (matchedChars) {
            return new Uint8Array(matchedChars.map(hx => parseInt(hx, 16)));
        }
        return new Uint8Array(0);
    }

    aesDecrypt(buffer, keyBuffer, iv) {
        let ivData;
        if (iv) {
            ivData = iv.startsWith('0x') ? this.hexToUint8Array(iv) : aesjs.utils.utf8.toBytes(iv);
        }
        const aesCbc = new aesjs.ModeOfOperation.cbc(keyBuffer, ivData);
        return aesCbc.decrypt(buffer);
    }

    static async parseM3u8File(url, customFetch) {
        let playList = '';
        if (customFetch) {
            playList = await customFetch(url);
        }
        else {
            playList = await fetchFile(url).then(data => aesjs.utils.utf8.fromBytes(data));
        }
        const streamInfoMatcher = /#EXT-X-STREAM-INF/i;
        const streamInfos = playList.match(streamInfoMatcher);
        if (streamInfos) {
            const lines = playList.split(/\n/);
            const bandwidthMatcher = /BANDWIDTH=\d+/i;
            let bandwidth = 0, maxBandwidthUrl = null;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.match(streamInfoMatcher)) {
                    const currentBandwidth = Number(line.match(bandwidthMatcher)?.[0]?.match(/\d+/)?.[0]);
                    if (currentBandwidth > bandwidth) {
                        maxBandwidthUrl = lines[i + 1];
                        bandwidth = currentBandwidth;
                    }
                }
            }
            if (maxBandwidthUrl) {
                return this.parseM3u8File(parseUrl(url, maxBandwidthUrl), customFetch);
            }
        }
        else {
            const matcher = createFileUrlRegExp('m3u8', 'i');
            const matched = playList.match(matcher);
            if (matched) {
                const parsedUrl = parseUrl(url, matched[0]);
                return this.parseM3u8File(parsedUrl, customFetch);
            }
        }
        return {
            url,
            content: playList
        };
    }

    async parseM3u8(url) {
        this.onProgress?.(TaskType.parseM3u8, 0);
        const { done, data } = await this.loopLoadFile(() => Hls2Mp4.parseM3u8File(url));
        if (done) {
            if (this.cancelled) return;
            this.onProgress?.(TaskType.parseM3u8, 1);
            return data;
        }
        throw new Error('m3u8 load failed');
    }

    async downloadFile(url) {
        if (this.cancelled) return;
        const { done, data } = await this.loopLoadFile(() => fetchFile(url));
        if (done) {
            if (this.cancelled) return;
            return data;
        }
        const fileName = url.match(/\w+\.\w{2,3}$/i)?.[0];
        throw new Error(`Download stopped while loading file ${fileName}`);
    }

    async downloadSegments(segs, key, iv) {
        return Promise.all(segs.map(async ({ name, url, source }) => {
            if (this.cancelled) return;
            const tsData = await this.downloadFile(url);
            const buffer = key ? this.aesDecrypt(tsData, key, iv) : this.transformBuffer(tsData);
            this.ffmpeg.writeFile(name, buffer);
            this.savedSegments += 1;
            this.onProgress?.(TaskType.downloadTs, this.savedSegments / this.totalSegments);
            return {
                source,
                url,
                name
            };
        }));
    }

    async downloadM3u8(url) {
        const m3u8Parsed = await this.parseM3u8(url);
        let { content, url: parsedUrl } = m3u8Parsed;
        const keyTagMatchRegExp = new RegExp('#EXT-X-KEY:METHOD=(AES-128|NONE)(,URI="[^"]+"(,IV=\\w+)?)?', 'gi');
        const extMatchRegExp = new RegExp('#EXTINF:\\d+(\\.\\d+)?,\\n');
        const matchReg = new RegExp(keyTagMatchRegExp.source + '|' + extMatchRegExp.source + '.+', 'gim');
        const matches = content.match(matchReg);
        if (!matches) {
            throw new Error('Invalid m3u8 file, no ts file found');
        }
        const segments = [];
        for (let i = 0; i < matches.length; i++) {
            if (this.cancelled) return;
            const matched = matches[i];
            if (matched.match(/#EXT-X-KEY/)) {
                const matchedKey = matched.match(/(?<=URI=").+(?=")/)?.[0];
                const matchedIV = matched.match(/IV=\w+$/)?.[0]?.replace(/^IV=/, '');
                segments.push({
                    key: matchedKey,
                    iv: matchedIV,
                    segments: []
                });
            }
            else {
                const segment = matched.replace(extMatchRegExp, '');
                if (i === 0) {
                    segments.push({
                        segments: [segment]
                    });
                }
                else {
                    segments[segments.length - 1].segments.push(segment);
                }
            }
        }
        this.totalSegments = segments.reduce((prev, current) => prev + current.segments.length, 0);
        this.savedSegments = 0;
        const batch = this.tsDownloadConcurrency;
        let treatedSegments = 0;
        for (const group of segments) {
            if (this.cancelled) return;
            const total = group.segments.length;
            let keyBuffer;
            if (group.key) {
                const keyUrl = parseUrl(parsedUrl, group.key);
                keyBuffer = await this.downloadFile(keyUrl);
            }
            for (let i = 0; i <= Math.floor(total / batch); i++) {
                if (this.cancelled) return;
                const downloadSegs = await this.downloadSegments(group.segments.slice(i * batch, Math.min(total, (i + 1) * batch)).map((seg, j) => {
                    const url = parseUrl(parsedUrl, seg);
                    const name = `seg-${treatedSegments + i * batch + j}.ts`;
                    return {
                        source: seg,
                        url,
                        name
                    };
                }), keyBuffer, group.iv);
                for (const { source, name } of downloadSegs) {
                    content = content.replace(source, name);
                }
            }
            treatedSegments += total;
        }
        content = content.replace(keyTagMatchRegExp, '');
        const m3u8 = 'temp.m3u8';
        this.ffmpeg.writeFile(m3u8, content);
        return m3u8;
    }

    async loopLoadFile(startLoad) {
        try {
            const result = await startLoad();
            if (this.cancelled) return { done: false, data: undefined };
            this.loadRetryTime = 0;
            return {
                done: true,
                data: result
            };
        }
        catch (err) {
            if (this.cancelled) return { done: false, data: undefined };
            this.loadRetryTime += 1;
            if (this.loadRetryTime < this.maxRetry) {
                return this.loopLoadFile(startLoad);
            }
            return {
                done: false,
                data: undefined
            };
        }
    }

    async loadFFmpeg() {
        this.onProgress?.(TaskType.loadFFmeg, 0);
        const baseUrl = this.ffmpegBaseUrl;
        const coreURL = await toBlobURL(`${baseUrl}/ffmpeg-core.js`, 'text/javascript');
        const wasmURL = await toBlobURL(`${baseUrl}/ffmpeg-core.wasm`, 'application/wasm');
        const loaded = await this.ffmpeg.load({
            coreURL,
            wasmURL
        });
        if (loaded) {
            if (this.cancelled) return;
            this.onProgress?.(TaskType.loadFFmeg, 1);
        }
        else {
            return this.loadFFmpeg();
        }
    }

    async download(url) {
        try {
            await this.loadFFmpeg();
            if (this.cancelled) return;
            const m3u8 = await this.downloadM3u8(url);
            if (this.cancelled) return;
            this.onProgress?.(TaskType.mergeTs, 0);
            await this.ffmpeg.exec(['-i', m3u8, '-c', 'copy', 'temp.mp4', '-loglevel', 'debug']);
            if (this.cancelled) return;
            const data = await this.ffmpeg.readFile('temp.mp4');
            this.ffmpeg.terminate();
            this.onProgress?.(TaskType.mergeTs, 1);
            return data;
        }
        catch (err) {
            this.ffmpeg.terminate();
            this.onError?.(err);
            return null;
        }
    }

    saveToFile(buffer, filename) {
        const objectUrl = URL.createObjectURL(new Blob([buffer], { type: 'video/mp4' }));
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = filename;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
    }

    cancelDownload() {
        this.cancelled = true;
        this.destroy();
    }

    destroy() {
        this.ffmpeg.terminate();
    }
}

export default Hls2Mp4;
