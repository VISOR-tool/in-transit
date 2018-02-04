const INITIAL_STATE = {
  marker: [ {id:'foo', x:331, process:"proc/11"} ],
};

const ADD_MARKER = 'visor/data/ADD_MARKER';
const GET_ALL_MARKER = 'visor/data/GET_ALL_MARKER';

export function markerReducer(allMarker = INITIAL_STATE, action) {
  switch(action['type']) {
  case ADD_MARKER:
    return {
      ...allMarker.push( action.marker ),
    };
  case GET_ALL_MARKER:
    return allMarker;
  }
}

const markerActions = {
  addMarker: (id,position) => ({
    type: ADD_MARKER,
    id,
    position,
  }),

  getMarkers: () => ({
    type: GET_ALL_MARKER,
  }),
}
