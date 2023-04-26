import React, {useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from '../components/card.jsx'
import { TailSpin } from "react-loader-spinner";
import {BsFillArrowRightCircleFill,BsFillArrowLeftCircleFill} from 'react-icons/bs'

export default function Search(){
  const {query} = useParams()
  const [isJson, setJson] = useState({});
  const [isLoad, setLoad] = useState(true);
  const [isPage, setPage] = useState(1);

  useEffect(() => {
    setLoad(true);
    const fetch = async () => {
      const req = await axios(`https://aniswim-api.vercel.app/search?q=${query}&page=${isPage}`);
      const data = await req.data;
      document.title = `Aniswim ~ Search:${query.replaceAll('+',' ')}`;
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
	  <div
	    style={{ width:`100%`, marginBottom:`1rem`, padding:`1.5rem`, display:`flex` }}
	    className="srch-prompt">
	    <h1 className="srch-for">
	    Search Results For ~ {query.replaceAll('+', ' ')}
	    </h1>
	  </div>
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
	    {
	      isJson.length > 0 ? 
            <button className="next-pg" onClick={() => setPage(isPage + 1)}>
	      Next&nbsp;<BsFillArrowRightCircleFill/>
            </button>
	    : <>
	    <div className="srch-prompt">
	    <h1 className="srch-for">
	      Not Found!
	    </h1>
	      </div>
	    </>
	    }
          </div>
        </>
      )}
    </>
  );

}
