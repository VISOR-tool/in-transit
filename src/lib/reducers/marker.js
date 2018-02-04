const INITIAL_STATE = [
  {id:'foo', x:331, process:"proc/11"},
];

const ADD_MARKER = 'visor/data/ADD_MARKER';

export function markerReducer(allMarker = INITIAL_STATE, action) {
  switch(action['type']) {
  case ADD_MARKER:
    return allMarker.concat(action.marker);
  default:
    return allMarker;
  }
}

const markerActions = {
  addMarker: (id, position) => ({
    type: ADD_MARKER,
    marker: {
      id,
      position,
    },
  }),
}
