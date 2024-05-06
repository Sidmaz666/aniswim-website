"use client"

import React, { useRef, useState, useEffect } from "react";
import { usePlyr } from "plyr-react";
import "plyr-react/plyr.css";
import Hls from "hls.js";

const useHls = (src, options) => {
  const hls = useRef(new Hls());
  const hasQuality = useRef(false);
  const [plyrOptions, setPlyrOptions] = useState(options);

  useEffect(() => {
    hasQuality.current = false;
  }, [options]);

  useEffect(() => {
    hls.current.loadSource(src);
    hls.current.attachMedia(document?.querySelector(".plyr-react"));
    hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
      if (hasQuality.current) return;

      const levels = hls.current.levels;
      const quality = {
        default: levels[levels.length - 1].height,
        options: levels.map((level) => level.height),
        forced: true,
        onChange: (newQuality) => {
          console.log("changes", newQuality);
          levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
              hls.current.currentLevel = levelIndex;
            }
          });
        },
      };
      setPlyrOptions({ ...plyrOptions, quality });
      hasQuality.current = true;
    });
  }, [plyrOptions, src]);

  return { options: plyrOptions };
};

const PlyrInstance = React.forwardRef(
  (props, ref) => {
    const { source, options, hlsSource, poster } = props;
    const raptorRef = usePlyr(ref, {
      ...useHls(hlsSource, options),
      source,
    });

    return <video ref={raptorRef} 
    	    style={{
	      "--plyr-color-main" : "oklch(var(--p))",
	      "--plyr-audio-controls-background" : "oklch(var(--b1))",
	      "--plyr-menu-background" : "oklch(var(--b1))",
	      "--plyr-menu-color" : "oklch(var(--bc))",
	      "--plyr-menu-radius" : "var(--rounded-box)",
	      "--plyr-menu-back-border-color" : "oklch(var(--p))",
	      "--plyr-menu-back-border-shadow-color" : "oklch(var(--p))",
	    }}
    	    className="plyr-react plyr" 
    	    data-poster={poster} 
    	    playsInline
    	    volume="1"
      />;
  }
);

export default function VideoPlayer({url,videoSource,poster}){
  const ref = useRef(null);
  const supported = Hls.isSupported();
  const options = {
    controls:  ['play-large', 'play', 'current-time' ,'progress', 'duration','mute', 'volume', 'settings', 'fullscreen',],
    keyboard: { focused: false, global: true },
    ratio: "4:2"
  }
  useEffect(() => {
    if(supported && document.querySelector('[data-plyr=volume]')){
      document.querySelector('[data-plyr=volume]').classList.add("hidden")
      document.querySelector('[data-plyr=volume]').classList.add("md:block")
    }
  },[])
  return (
    <div className="wrapper">
      {supported ? (
        <PlyrInstance
          ref={ref}
	  poster={poster}
          source={videoSource || null}
          options={options}
          hlsSource={url}
        />
      ) : (
        "HLS is not supported in your browser"
      )}
    </div>
  );
};
