import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const [isRecent, setRecent] = useState("Latest 🔥");
  const visit = useNavigate();

  function search_this() {
    const pre_query = document.querySelector("#srchTxt").value;
    if (pre_query.length == "") {
      console.log(`Can't just search for nothing!`);
    } else {
      const query = pre_query.replace(/\s/g, "+");
      window.location.href = `/search/${query}`;
    }
  }

  window.onload = function () {
    const get_search_inp = document.querySelector("input.srch-txt");
    get_search_inp.addEventListener("keypress", function (e) {
      if (e.key == "Enter") {
        search_this();
      }
    });
  };

  const setBtn = (path, title) => {
    setRecent(title);
    visit(path);
  };

  return (
    <header>
      <h1 className="h-logo">
        <span
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Äそ
        </span>
      </h1>
      <h1>
        <div>
          <input
            type="text"
            className="srch-txt"
            id="srchTxt"
            placeholder="...Search"
          />
          <button
            className="srch-btn"
            onClick={() => {
              search_this();
            }}
          >
            Go
          </button>
        </div>
      </h1>
      <h1
        className="latest-h1"
        onClick={() => {
          window.location.pathname == "/recent"
            ? setBtn("/", "Latest 🔥")
            : setBtn("/recent", "Popular 🌶️");
        }}
      >
        {isRecent}
      </h1>
    </header>
  );
}
