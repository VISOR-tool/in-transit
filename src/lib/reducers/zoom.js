export const zoomInitial = {
  zoomMin: 30 * 3600 * 1000, //min zoom level 1 Month
  zoomMax: 2.1 * 365 * 24 * 3600 * 1000, //max zoom level 2 Years
  zoomSectionStart: new Date( Date.parse(2015) ),
  zoomSectionEnd: new Date( Date.parse(2017) ),
  timelineDrag: {drag: false},
};

export function zoomReducer(action, zoomState) {
  switch(action) {
  default:
    return zoomState;
  }
}
