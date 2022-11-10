import React from "react";

export default function Container({ children, footer }) {
  return (
    <div className="contain-top-list">
      <center>
        <div className="container">{children}</div>
      </center>
      {footer ? footer : ''}
    </div>
  );
}
