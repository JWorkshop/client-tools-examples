import React, { Component } from "react";
import ClassNames from "classnames";
import PropTypes from "prop-types";
import { Animator, CanvasAnimator } from "client-tools";

import Firefly from "../firefly";

import "./style.css";

class FirefliesLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fireflies: []
    };
  }

  componentDidMount() {
    const { number, animator } = this.props;
    let fireflies = [];

    for (let i = 0; i < number; i++) {
      fireflies.push(new Firefly());
    }

    this.setState({
      fireflies: fireflies
    });

    animator.add(timeDiff => this.update(timeDiff));
    animator.start();
  }

  update(timeDiff) {
    const { target } = this.props;
    const layer = this.layer;
    const { width, height } = layer.state;
    const { fireflies } = this.state;

    /* Update the fireflies. */
    for (let i = 0; i < fireflies.length; i++) {
      fireflies[i].update(width, height, timeDiff, target);
    }
  }

  animate(context, width, height) {
    const { fireflies } = this.state;

    /* Clear the canvas screen. */
    context.clearRect(0, 0, width, height);

    /* Set the color overlapping to become brighter. */
    context.globalCompositeOperation = "lighter";

    /* Paint the fireflies. */
    for (let i = 0; i < fireflies.length; i++) {
      fireflies[i].paint(context, width, height);
    }
  }

  render() {
    const { className, style, animator } = this.props;

    return (
      <CanvasAnimator
        ref={layer => (this.layer = layer)}
        className={ClassNames("fireflies-layer", className)}
        style={style}
        animator={animator}
        animate={(context, width, height, timeDiff) => {
          this.animate(context, width, height, timeDiff);
        }}
      />
    );
  }
}

FirefliesLayer.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape(),
  number: PropTypes.number,
  animator: PropTypes.object,
  target: PropTypes.object
};

FirefliesLayer.defaultProps = {
  className: "",
  style: {},
  number: 20,
  animator: new Animator(),
  target: null
};

export default FirefliesLayer;
