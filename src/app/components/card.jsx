import React from "react";
import { Link } from "react-router-dom";

export default function Card({animeId,title,poster}){
  return (
	<Link to={`../view/${animeId}`}>
       <figure className="per-ani">
	 <img className="poster" src={poster} alt={title} />
	  <figcaption className="title">
	   	{title}
	  </figcaption>
       </figure>
       </Link>
  )
}
