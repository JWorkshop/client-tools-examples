import React from "react";
import ReactDOM from "react-dom";
import Matrix from "./matrix";

import "./style.css";

ReactDOM.render(
  <div className="client-tools-example">
    <Matrix style={{ position: "absolute", width: "100%", height: "100%" }} />
  </div>,
  document.getElementById("root")
);
