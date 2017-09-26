import Actions from "./actions";

export default class Target {
  constructor(mouse) {
    this.mouse = mouse;
    this.clicked = false;
    this.dashSpeed = 1000;
    this.clickTime = 120;

    mouse.onMouseDown(() => {
      this.clicked = true;
      setTimeout(() => (this.clicked = false), this.clickTime);
    });
  }

  getPosition() {
    return this.mouse.position;
  }

  getBlurredPosition() {
    let action = this.getAction();
    let position = this.mouse.position;

    /* Create a blurred target position from the mouse position and the blurring range. */
    if (action && position) {
      let blurFactor = action.blurFactor;
      let { x, y } = position;
      let randDegree = 2 * Math.PI * Math.random();

      return {
        x: x + Math.cos(randDegree) * blurFactor,
        y: y + Math.sin(randDegree) * blurFactor
      };
    } else {
      return position;
    }
  }

  getDirection() {
    return this.mouse.direction;
  }

  getSpeed() {
    return this.mouse.movingSpeed;
  }

  getAction() {
    const { clicked, mouse, dashSpeed } = this;
    const { isMouseDown, isLeftButton, movingSpeed } = mouse;

    if (clicked) {
      return Actions.CLICK;
    } else if (isMouseDown && isLeftButton) {
      return Actions.HOLD;
    } else if (movingSpeed > dashSpeed) {
      return Actions.DASH;
    } else {
      return null;
    }
  }
}
