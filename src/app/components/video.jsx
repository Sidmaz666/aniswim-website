import React, { useRef, useState, useEffect } from "react";
import { AiOutlineFolderOpen } from "react-icons/ai";
import videojs from "video.js";
import _ from "videojs-contrib-quality-levels";
import qualitySelector from "videojs-hls-quality-selector";
import "video.js/dist/video-js.css";

export default function Video({ title, ep, link }) {
  const videoRef = useRef();
  const [player, setPlayer] = useState(undefined);
  const liveURL = link;
  useEffect(() => {
    if (player) {
      player.src({
        src: liveURL,
        type: "application/x-mpegURL",
        withCredentials: false,
      });
    }
  }, [liveURL]);

  useEffect(() => {
    const videoJsOptions = {
      autoplay: false,
      preload: "auto",
      controls: true,
      poster: "",
      sources: [
        {
          src: liveURL,
          type: "application/x-mpegURL",
          withCredentials: false,
        },
      ],
      html5: {
        nativeAudioTracks: true,
        nativeVideoTracks: true,
        nativeTextTracks: true,
      },
    };

    const p = videojs(
      videoRef.current,
      videoJsOptions,
    );

    setPlayer(p);

  return () => {
      if (player) player.dispose();
    };
  }, []);

  useEffect(() => {
    if (player) {
      player.hlsQualitySelector({ displayCurrentQuality: true });
    }
  }, [player]);

  return (
    <>
    <span className="anime-details">
      <h1 className="anime-title" style={{ paddingLeft:`2rem` }}>
        <AiOutlineFolderOpen /> {title} | EP {ep}
      </h1>
    </span>
      <div
	className="video-container"
	>
      <div 
	data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-fluid vjs-theme-default vjs-big-play-centered vjs-paused vjs-controls-enabled vjs-workinghover vjs-user-active vjs-hls-quality-selector "
        ></video>
      </div>
      </div>
    </>
  );
}
