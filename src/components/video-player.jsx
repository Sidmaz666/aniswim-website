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


useEffect(() => {
  setTimeout(() => {
    const videoElm = document.querySelector(".plyr-react");
    if (videoElm) {

      const handleTimeUpdate = () => {
        const currentTime = Math.round(videoElm.currentTime);
        
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const queryParams = new URLSearchParams(url.search);

        const animeId = url.pathname.replace("/watch/","")
        const ep = queryParams.get("ep") || 1

        let localStorageData = localStorage.getItem("watched") || "{}"
        let isEPExist = false;

        if(localStorageData !== null && typeof JSON.parse(localStorageData) == "object" ){
          localStorageData = JSON.parse(localStorageData)
          if(localStorageData[animeId] && localStorageData[animeId].includes(ep)){
            isEPExist = true;
          } else {
            isEPExist = false;
          }
        }


        if(!isEPExist && currentTime >= 60){
            if(!localStorageData[animeId] || localStorageData[animeId]?.length <= 0){
              localStorageData[animeId] = [ep]
            } else {
              localStorageData[animeId].push(ep)
              localStorageData[animeId].sort()
            }
            localStorage.setItem("watched", JSON.stringify(localStorageData))
          }
    }


      const attachTimeUpdateListener = () => {
        if (!videoElm) return;
        videoElm.addEventListener("timeupdate", handleTimeUpdate);
      };

      attachTimeUpdateListener();

      const intervalId = setInterval(() => {
        if (!videoElm.hasAttribute("timeupdate-attached")) {
          attachTimeUpdateListener();
          videoElm.setAttribute("timeupdate-attached", "true");
        }
      }, 1000);

      return () => {
        clearInterval(intervalId);
        videoElm.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  },1000)

}, [plyrOptions, src]);


useEffect(() => {
  setTimeout(() => {
    const videoElm = document.querySelector(".plyr-react");
    if (videoElm) {

      const handleEnded = () => {
        let localStorageData = localStorage.getItem("autoplay")
        if(localStorageData === "true"){
          const nextBtn = document.querySelector("#next-btn")
          if(!nextBtn) return
          nextBtn.click()
        }

    }


      const attachEndedListener = () => {
        if (!videoElm) return;
        videoElm.addEventListener("ended", handleEnded);
      };

      attachEndedListener();

      const intervalId_ = setInterval(() => {
        if (!videoElm.hasAttribute("ended-attached")) {
          attachEndedListener();
          videoElm.setAttribute("ended-attached", "true");
        }
      }, 1000);

      return () => {
        clearInterval(intervalId_);
        videoElm.removeEventListener("ended", handleEnded);
      };
    }
  },1000)

}, [plyrOptions, src]);


useEffect(() => {
  setTimeout(() => {
    const videoElm = document.querySelector(".plyr-react");
    if (videoElm) {
        let localStorageData = localStorage.getItem("autoplay")
        if(localStorageData === "true"){
            videoElm.play()
        }
    }
  },1000)

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
	      "--plyr-menu-back-border-shadow-color" : "oklch(var(--p))"
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
    autopause: false,
    controls:  ['play-large', 'play', 'current-time' ,'progress', 'duration','mute', 'volume', 'settings', 'fullscreen',],
    keyboard: { focused: false, global: true }
  }


  useEffect(() => {
    if(supported && document.querySelector('[data-plyr=volume]')){
      document.querySelector('[data-plyr=volume]').classList.add("hidden")
      document.querySelector('[data-plyr=volume]').classList.add("md:block")
    }
  },[])

  return (
    <div className="md:h-[500px]">
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
