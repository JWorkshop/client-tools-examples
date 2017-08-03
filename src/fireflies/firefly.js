import { Geometry2D } from "client-tools";
import Behaviours from "./behaviours";

const { getDistance, roundAngle } = Geometry2D;

const getMinVariation = (origin, target, variation) => {
  if (origin > target) {
    return -Math.min(variation, origin - target);
  } else if (origin < target) {
    return Math.min(variation, target - origin);
  } else {
    return 0;
  }
};

export default class Firefly {
  constructor (width, height) {
    /* Behaviour. Initially Wander. */
    this.behaviour = null;

    /* Color. */
    this.color = { r: 0, g: 0, b: 0 };
    this.colorVar = 300;

    /* Behaviour Color */
    this.behaviourColor = { r: 0, g: 0, b: 0 };

    /* Brightness (Opacity). */
    this.brightness = 0;
    this.brightnessVar = 3;
    this.brightnessMin = 0;
    this.brightnessMax = 1;
    this.brightnessGrd = 1;

    /* Speed Magnitude. */
    this.speed = 0;

    /* Behaviour Speed and Acceleration */
    this.behaviourSpeed = 0;
    this.acceleration = 0;

    /* Velocity. */
    this.velocity = { x: 0, y: 0 };

    /* Radius. */
    this.radius = 0;

    /* Position. */
    this.position = { x: 0, y: 0 };

    /* Direction. */
    this.direction = 0;
    this.directionVar = 0;
  };

  initialise (width, height) {
    this.behaviour = Behaviours.WANDER;
    this.radius = 10 + 20 * Math.random();
    this.position.x = width * Math.random();
    this.position.y = height;
    this.speed = 0;
    this.direction = 0;
  };

  isOutOfBound (width, height) {
    let { x, y } = this.position;
    let radius = this.radius;

    return x < -radius || width + radius < x || y < -radius || height + radius < y;
  };

  behave (target) {
    const {
      getColor,
      getSpeed,
      getAcceleration,
      getDirectionVar,
      getBrightnessMin,
      getBrightnessMax
    } = this.behaviour;
    const blurredPosition = target.getBlurredPosition();
    const o = {
      position: this.position,
      speed: this.speed,
      direction: this.direction
    };
    const t = {
      position: blurredPosition,
      speed: target.getSpeed(),
      direction: target.getDirection()
    };
    this.behaviourColor = getColor(o, t);
    this.behaviourSpeed = getSpeed(o, t);
    this.acceleration = getAcceleration(o, t);
    this.directionVar = getDirectionVar(o, t);
    this.brightnessMin = getBrightnessMin(o, t);
    this.brightnessMax = getBrightnessMax(o, t);
  };

  updateColor (timeDiff) {
    let { r, g, b } = this.color;
    let variation = this.colorVar * timeDiff;
    let { r: bR, g: bG, b: bB } = this.behaviourColor;

    this.color.r = (r + getMinVariation(r, bR, variation)) >> 0;
    this.color.g = (g + getMinVariation(g, bG, variation)) >> 0;
    this.color.b = (b + getMinVariation(b, bB, variation)) >> 0;
  };

  updateBrightness (timeDiff) {
    let b = this.brightness;
    let bMax = this.brightnessMax;
    let bMin = this.brightnessMin;
    let bVar = this.brightnessVar;

    this.brightnessGrd = (b >= bMax) ? -1 : (b <= bMin) ? 1 : this.brightnessGrd;
    this.brightness += this.brightnessGrd * bVar * timeDiff;
  };

  updateSpeed (timeDiff) {
    let speed = this.speed;
    let bSpeed = this.behaviourSpeed;
    let variation = this.acceleration * timeDiff;

    this.speed += getMinVariation(speed, bSpeed, variation);
  };

  updateDirection (timeDiff) {
    let d = this.direction;
    let dVar = this.directionVar;

    d += dVar * timeDiff;
    this.direction = roundAngle(d);
  };

  updateVelocityPosition (timeDiff) {
    let speed = this.speed;
    let direction = this.direction;
    let vX = speed * Math.cos(direction);
    let vY = speed * Math.sin(direction);

    this.velocity.x = vX;
    this.velocity.y = vY;
    this.position.x += vX * timeDiff;
    this.position.y += vY * timeDiff;
  };

  update (width, height, timeDiff, target) {
    const action = target.getAction();
    const position = target.getPosition();

    this.behaviour = Behaviours.WANDER;

    if (action && action.behaviour) {
      const { behaviour, effectiveRange } = action;

      /* Calculate the distance between itself and the mouse position. */
			let distance = getDistance(this.position, position);

      /* If the firefly is within the effective range,
       * then apply the action behaviour. Otherwise it will stay in wander. */
      if (distance < effectiveRange) {
        this.behaviour = behaviour;
      }
    }

    /* Re-initiate firefly when it flies off the boundary. */
    if (this.behaviour === null || this.isOutOfBound(width, height)) {
      this.initialise(width, height);
    } else {
      this.behave(target);
      this.updateColor(timeDiff);
      this.updateBrightness(timeDiff);
      this.updateSpeed(timeDiff);
      this.updateDirection(timeDiff);
      this.updateVelocityPosition(timeDiff);
    }
  };

  paint (context, width, height) {
    context.beginPath();

    let { x, y } = this.position;
    let radius = this.radius;
    let { r, g, b } = this.color;
    let brightness = this.brightness.toFixed(2);
    let gradient = context.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness}`);
    gradient.addColorStop(0.1, `rgba(255, 255, 255, ${0.8 * brightness}`);
    gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${0.2 * brightness})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    context.fillStyle = gradient;
    context.arc(x, y, radius, 2 * Math.PI, false);
    context.closePath();
    context.fill();
  };
};
