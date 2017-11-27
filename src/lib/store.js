import { createStore, combineReducers } from 'redux';

import { zoomInitial, zoomReducer } from './reducers/zoom';

const INITIAL = {
  zoom: zoomInitial,
  oproc: {},
  filter:
  {
    processMapping: "Beteiligten",
    wrapEmptyLanes: "on",
    lanesSortOrder: "aufsteigend",
    procOnlyVisibleWith: "",
    procVisibileWithout: "",
    processParticipation: "beliebiger",
  },
};

export default () => createStore(
  combineReducers({
    zoom: zoomReducer,
  }), INITIAL, typeof devToolsExtension==='function' ? devToolsExtension() : undefined);
