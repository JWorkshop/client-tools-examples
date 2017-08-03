import React from "react";
import ReactDOM from "react-dom";
import Fireflies from "./fireflies";

import "./style.css";

ReactDOM.render((
  <div className="client-tools-example">
    <Fireflies style={{ position: "absolute", width: "100%", height: "100%" }} />
  </div>
), document.getElementById("root"));
