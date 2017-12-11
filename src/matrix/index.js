import React, { Component } from "react";
import ClassNames from "classnames";
import PropTypes from "prop-types";
import {
  Animator,
  CanvasAnimator,
  CanvasAsciifier,
  ColorPicker,
  Color,
  UserMediaLoader
} from "client-tools";

import demoSource from "./demo.ogv";
import play from "./play.png";
import pause from "./pause.png";
import camera from "./camera.png";
import movie from "./movie.png";
import copy from "./copy.png";

import "./style.css";

const { max } = Math;

const InputField = ({ id, className, label, value, onChange }) => (
  <div className={className}>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type="text"
      value={value}
      onKeyDown={event => {
        const keyCode = event.which || event.keyCode;

        if (keyCode === 38) {
          onChange(value + 1);
        } else if (keyCode === 40) {
          onChange(value - 1);
        }
      }}
      onChange={event => {
        const value = event.target.value;
        if (!/\D/.test(value)) {
          onChange(value);
        }
      }}
    />
  </div>
);

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

class Matrix extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paused: false,
      onCamera: false,
      color: { r: 0, g: 255, b: 0, a: 1 },
      fontSize: 4,
      lineHeight: 5,
      source: demoSource
    };
  }

  componentDidMount() {
    const { canvas } = this;

    canvas.start();
  }

  playClickHandler() {
    const { video } = this;
    const { animator } = this.props;
    const { paused } = this.state;

    if (paused) {
      video.play();
      animator.resume();
    } else {
      video.pause();
      animator.pause();
    }

    this.setState({ paused: !paused });
  }

  async cameraClickHandler() {
    const { onCamera } = this.state;

    if (onCamera) {
      this.setState({ onCamera: false, source: demoSource });
    } else {
      try {
        const stream = await UserMediaLoader.requestUserMedia();

        this.setState({
          onCamera: true,
          source: window.URL.createObjectURL(stream)
        });
      } catch (error) {}
    }
  }

  copyClickHandler() {
    const { asciifier } = this;
    const asciiElement = asciifier.getAsciiElement();
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(asciiElement);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("Copy");
  }

  update() {
    const { video, canvas, asciifier } = this;
    const context = canvas.getContext();
    const width = canvas.getCanvasWidth();
    const height = canvas.getCanvasHeight();

    /* Clear the canvas screen. */
    context.clearRect(0, 0, width, height);

    /* Paint the video onto the canvas. */
    context.drawImage(video, 0, 0, width, height);

    /* Update the acsii code from the canvas. */
    asciifier.update(canvas);
  }

  render() {
    const { className, style, animator } = this.props;
    const {
      paused,
      onCamera,
      color,
      fontSize,
      lineHeight,
      source
    } = this.state;
    const { r, g, b, a } = color;

    return (
      <div
        ref={scene => (this.scene = scene)}
        className={ClassNames("matrix-wrapper", className)}
        style={style}
      >
        <div className="matrix-scene">
          <video
            ref={video => (this.video = video)}
            className="matrix-video"
            src={source}
            autoPlay={true}
            loop={true}
            muted={true}
          />
          <CanvasAnimator
            ref={canvas => (this.canvas = canvas)}
            className="matrix-canvas"
            animator={animator}
            animate={() => this.update()}
            onResize={() => this.update()}
          />
          <CanvasAsciifier
            ref={asciifier => (this.asciifier = asciifier)}
            className="matrix-ascii"
            textClassName="matrix-ascii-text"
            textStyle={{
              color: Color.rgbToString(r, g, b, a),
              fontSize: `${parseInt(fontSize, 10)}px`,
              lineHeight: `${parseInt(lineHeight, 10)}px`
            }}
            invert={true}
          />
          <button
            className={ClassNames("matrix-play-button", { paused: paused })}
            style={{ backgroundImage: `url(${paused ? play : pause})` }}
            onClick={() => this.playClickHandler()}
          />
          <button
            className="matrix-camera-button"
            style={{ backgroundImage: `url(${onCamera ? movie : camera})` }}
            onClick={() => this.cameraClickHandler()}
          />
          <button
            className="matrix-copy-button"
            style={{ backgroundImage: `url(${copy})` }}
            onClick={() => this.copyClickHandler()}
          />
          <ColorPicker
            id="color"
            className="matrix-color"
            color={color}
            dialogConfig={{ top: true }}
            onChange={value => this.setState({ color: value })}
          />
          <InputField
            id="fontSize"
            className="matrix-font-size"
            label="font size"
            value={fontSize}
            onChange={value =>
              this.setState({ fontSize: max(2, value) }, () => this.update())
            }
          />
          <InputField
            id="lineHeight"
            className="matrix-line-height"
            label="line height"
            value={lineHeight}
            onChange={value =>
              this.setState({ lineHeight: max(2, value) }, () => this.update())
            }
          />
        </div>
      </div>
    );
  }
}

Matrix.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape(),
  animator: PropTypes.instanceOf(Animator)
};

Matrix.defaultProps = {
  className: "",
  style: {},
  animator: new Animator()
};

export default Matrix;
