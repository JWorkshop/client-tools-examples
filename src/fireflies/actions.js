import Behaviours from "./behaviours";

const actions = {
  HOLD: {
    behaviour: Behaviours.ATTRACT,
    effectiveRange: 300,
    blurFactor: 350
  },
  DASH: {
    behaviour: Behaviours.FOLLOW,
    effectiveRange: 200,
    blurFactor: 100
  },
  CLICK: {
    behaviour: Behaviours.FLEE,
    effectiveRange: 300,
    blurFactor: 0
  }
};

export default actions;
