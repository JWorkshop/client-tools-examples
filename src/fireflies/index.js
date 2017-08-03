import React, { Component } from "react";
import ClassNames from "classnames";
import PropTypes from "prop-types";
import { Animator, Mouse } from "client-tools";

import FirefliesLayer from "./fireflieslayer";
import Target from "./target";

import "./style.css";

export default class Fireflies extends Component {
  constructor (props) {
    super(props);
    this.state = {
      target: new Target(props.mouse)
    };
  };

  componentDidMount () {
    const { mouse } = this.props;
    const { container } = this.refs;

    mouse.attachToElement(container);
  };

  componentWillUnmount () {
    const { mouse } = this.props;

    mouse.detachFromElement();
  };

  render () {
    const { className, style, animator } = this.props;
    const { target } = this.state;

    return (
      <div ref="container" className={ClassNames("fireflies_scene", className)} style={style}>
        <FirefliesLayer animator={animator} target={target} />
        <FirefliesLayer animator={animator} target={target} />
        <FirefliesLayer animator={animator} target={target} />
        <FirefliesLayer animator={animator} target={target} />
        <FirefliesLayer animator={animator} target={target} />
      </div>
    );
  };
};

Fireflies.defaultProps = {
  animator: new Animator(),
  mouse: new Mouse()
};

Fireflies.propTypes = {
  animator: PropTypes.object,
  mouse: PropTypes.object
};
