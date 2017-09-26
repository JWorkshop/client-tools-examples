import React, { Component } from "react";
import ClassNames from "classnames";
import PropTypes from "prop-types";
import { Animator, Mouse } from "client-tools";

import FirefliesLayer from "./fireflieslayer";
import Target from "./target";

import "./style.css";

class Fireflies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      target: new Target(props.mouse)
    };
  }

  componentDidMount() {
    const { mouse } = this.props;
    const scene = this.scene;

    mouse.attachToElement(scene);
  }

  componentWillUnmount() {
    const { mouse } = this.props;

    mouse.detachFromElement();
  }

  render() {
    const { className, style, animator } = this.props;
    const { target } = this.state;

    return (
      <div
        ref={scene => (this.scene = scene)}
        className={ClassNames("fireflies-scene", className)}
        style={style}
      >
        <FirefliesLayer animator={animator} target={target} />
        <FirefliesLayer animator={animator} target={target} />
        <FirefliesLayer animator={animator} target={target} />
        <FirefliesLayer animator={animator} target={target} />
        <FirefliesLayer animator={animator} target={target} />
      </div>
    );
  }
}

Fireflies.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape(),
  animator: PropTypes.object,
  mouse: PropTypes.object
};

Fireflies.defaultProps = {
  className: "",
  style: {},
  animator: new Animator(),
  mouse: new Mouse()
};

export default Fireflies;
