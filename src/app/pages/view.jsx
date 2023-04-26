import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import Details from "../components/details.jsx";
import Video from "../components/video.jsx";
import {
  IoIosArrowDroprightCircle,
  IoIosArrowDropleftCircle,
} from "react-icons/io";
import { FaDownload } from "react-icons/fa";

export default function View() {
  const [isJson, setJson] = useState({});
  const [isEp, setEp] = useState(1);
  const [goEp, setGoep] = useState();
  const [isLoad, setLoad] = useState(true);
  const { animeId } = useParams();

  useEffect(() => {
    setLoad(true);
    const fetch = async () => {
      const req = await axios(
        `https://aniswim-api.vercel.app/anime?id=${animeId}&ep=${isEp}`
      );
      const data = await req.data;
      setJson(data);
      document.title = `Aniswim ~ ${data.title} Episode ${data.requested_episode}`;
      setEp(data.requested_episode);
      setLoad(false);
    };
    fetch();
  }, [isEp]);

  const ep_list = [];

  const renderEpBtn = () => {
    for (let i = 1; i <= isJson.total_ep; i++) {
      ep_list.push(i);
    }
  };

  return (
    <>
      {isLoad ? (
        <>
          <br />
          <div
            style={{
              display: `flex`,
              padding: `0.5rem`,
              justifyContent: `center`,
              alignItems: `center`,
              height: `80vh`,
              overflow: `hidden`,
            }}
          >
            <TailSpin
              ariaLabel="loading-indicator"
              height={100}
              width={1000}
              color="#B2EBF2"
            />
          </div>
          <br />
        </>
      ) : (
        <>
          {isJson && isJson.message !== undefined ? (
            <span className="anime-details" 
		style={{ alignItems:`center` }}
	      >
	      <br/>	
              <h1 className="anime-title" style={{ paddingLeft: `2rem` }}>
                Can't Load! Video Not Found!
              </h1>
	      <br/>	
	      <br/>	
	      	<Link to="../">
	  	<button className="next-pg">Browse More?</button>
		</Link>
	      <br/>	
	      <br/>	
            </span>
          ) : (
            <>
              <Video
		title={isJson ? isJson.title.length <= 0 ? isJson.animeID.replaceAll("-"," ") : isJson.title : "" }
                ep={isJson ? isJson.requested_episode : ""}
                link={isJson ? isJson.video_links[0].main_link : ""}
              />

              <div className="video-con">
                {isEp > 1 ? (
                  <>
                    <button
                      onClick={() => {
                        setEp(Number(isEp) - 1);
                      }}
                    >
                      <IoIosArrowDropleftCircle />
                    </button>
                  </>
                ) : (
                  ""
                )}

                {isJson.total_ep != isEp ? (
                  <>
                    <button
                      onClick={() => {
                        setEp(isJson.total_ep == isEp ? 1 : Number(isEp) + 1);
                      }}
                    >
                      <IoIosArrowDroprightCircle />
                    </button>
                  </>
                ) : (
                  ""
                )}
              </div>

              <div className="search_ep">
                <label htmlFor="ep_jump">Episode</label>
                <input
                  type="text"
                  value={goEp}
                  placeholder="EP Number"
                  onChange={(e) => {
                    if (!isNaN(e.target.value)) {
                      if (e.target.value !== 0)
                        if (e.target.value <= Number(isJson.total_ep))
                          setGoep(e.target.value);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (goEp > 0 && goEp !== isEp) {
                      if (e.key == "Enter") {
                        setEp(goEp);
                      }
                    }
                  }}
                />

                <div className="downlaodBtn">
                  <a href={isJson ? isJson.video_links.main_link : ""} download alt="Download" title={`Download ${isJson.title} Episode ${isJson.requested_episode}`}>
                    <FaDownload />
                  </a>
                </div>
              </div>

              <div className="ep-opts">
                {renderEpBtn()}

                {ep_list.map((ep) => {
                  return (
                    <button
                      className={`${isEp == ep ? "active_ep" : "ep_btn"}`}
                      key={ep}
                      onClick={() => {
                        setEp(ep);
                      }}
                    >
                      {ep}
                    </button>
                  );
                })}
              </div>

              <Details
                total={isJson ? isJson.total_ep : "0"}
                ep={isJson ? isJson.requested_episode : ""}
                desc={isJson ? isJson.description : "Not Available!"}
                status_={isJson ? isJson.anime_status : ""}
                type={isJson ? isJson.anime_type : "unknown"}
                genre={isJson ? isJson.genre : "unknown"}
                released={isJson ? isJson.released_year : ""}
                alt_name={isJson ? isJson.other_name : ""}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
