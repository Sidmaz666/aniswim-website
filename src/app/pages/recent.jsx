import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/card.jsx";
import { TailSpin } from "react-loader-spinner";
import {BsFillArrowRightCircleFill,BsFillArrowLeftCircleFill} from 'react-icons/bs'

export default function Recent() {
  const [isJson, setJson] = useState({});
  const [isLoad, setLoad] = useState(true);
  const [isPage, setPage] = useState(1);

  useEffect(() => {
    setLoad(true);
    const fetch = async () => {
      const req = await axios(`https://aniswim-api.vercel.app/latest/?page=${isPage}`);
      const data = await req.data;
      document.title = "Aniswim ~ Latest Anime";
      setJson(data);
      setLoad(false);
    };
    fetch();
  }, [isPage]);

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
          {isJson
            ? isJson.map((data) => {
                return (
                  <Card
	      	    key={data.animeId+data.thumbnail}
                    animeId={data.animeID}
		    title={data.title.length <= 0 ? data.animeID.replaceAll("-"," ") : data.title }
                    poster={data.thumbnail}
                  />
                );
              })
            : ""}
          <div className="pg-opts">
            {isPage > 1 ? (
              <button
                className="prev-pg"
                onClick={() => setPage(isPage == 1 ? 1 : isPage - 1)}
              >
	    <BsFillArrowLeftCircleFill/>&nbsp; Previous 
              </button>
            ) : (
              ""
            )}
            <button className="next-pg" onClick={() => setPage(isPage + 1)}>
	      Next&nbsp;<BsFillArrowRightCircleFill/>
            </button>
          </div>
        </>
      )}
    </>
  );
}

