import React from "react";
import {AiFillGithub} from 'react-icons/ai'

export default function Footer() {
  return (
    <>
      <div className="footer">
        <span className="auth">
          <a
            href="https://github.com/sidmaz666"
            target="_blank"
            rel="noreferrer"
	    style={{ display:`flex` }}
          >
	    Coded by Sidmaz666
	    <span style={{ color:`#00C853`, marginLeft:`0.5rem` }} >
	      <AiFillGithub/>
	    </span>
          </a>
        </span>
        <br />
        <span className="cl">© Copyleft </span>
      </div>
    </>
  );
}
