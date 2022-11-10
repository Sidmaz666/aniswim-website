import React from "react";

export default function Details({
  total,
  ep,
  desc,
  status_,
  type,
  genre,
  alt_name,
  released,
}) {
  return (
    <span className="anime-details">
      <div>
        <span>
          <span>Total Episode:</span> {total}
        </span>
        <span>
          <span>Anime Description:</span> {desc}
        </span>
        <span>
          <span>Anime Status:</span> {status_}
        </span>
        <span>
          <span>Anime Type:</span> {type}
        </span>
        <span>
          <span>Genre:</span> {genre}
        </span>
        <span>
          <span>Alternative Name:</span>
          <i> {alt_name}</i>
        </span>
        <span>
          <span>Released On:</span> {released}
        </span>

        <span>
          <span>Current Episode:</span> {ep}
        </span>
      </div>
    </span>
  );
}
