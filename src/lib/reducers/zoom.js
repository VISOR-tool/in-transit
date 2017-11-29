const INITIAL_STATE = {
  zoomMin: 30 * 3600 * 1000, //min zoom level 1 Month
  zoomMax: 2.1 * 365 * 24 * 3600 * 1000, //max zoom level 2 Years
  sectionStart: new Date( Date.parse(2015) ),
  sectionEnd: new Date( Date.parse(2017) ),
  timelineDrag: {drag: false},
};

const SET_ZOOM_SECTION = 'visor/zoom/SET_ZOOM_SECTION';

export function zoomReducer(zoomState = INITIAL_STATE, action) {
  switch(action['type']) {
  case SET_ZOOM_SECTION:
    let start = zoomState.sectionStart.getTime() + action.deltaStart;
    const end = zoomState.sectionEnd.getTime() + action.deltaEnd;
    if (start >= end) {
      start = end - 1000;
    }

    return {
      ...zoomState,
      sectionStart: new Date(start),
      sectionEnd: new Date(end),
    };
  default:
    return zoomState;
  }
}

export const zoomActions = {
  setZoomSection: (deltaStart, deltaEnd) => ({
    type: SET_ZOOM_SECTION,
    deltaStart,
    deltaEnd,
  }),
};
