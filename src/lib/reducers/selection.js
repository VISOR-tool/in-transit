const INITIAL_STATE = {
  hovered: null,
  selected: null,
};

const HOVER = 'visor/selection/HOVER';
const UNHOVER = 'visor/selection/HOVER';
const SELECT = 'visor/selection/SELEC';

export function selectionReducer(selectionState = INITIAL_STATE, action) {
  switch(action['type']) {
  case HOVER:
    return {
      ...selectionState,
      hovered: action.value,
    };
  case UNHOVER:
    if (selectionState.hovered === action.value) {
      return {
        ...selectionState,
        hovered: null,
      };
    } else {
      // Mismatch, return unmodified
      return selectionState;
    }
  case SELECT:
    return {
      ...selectionState,
      selected: action.value,
    };
  default:
    return selectionState;
  }
}

export const selectionActions = {
  hover: value => ({
    type: HOVER,
    value,
  }),
  unhover: value => ({
    type: UNHOVER,
    value,
  }),
  select: value => ({
    type: SELECT,
    value,
  }),
};
