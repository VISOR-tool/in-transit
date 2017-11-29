import { createStore, combineReducers } from 'redux';

import { zoomReducer } from './reducers/zoom';

const INITIAL = {};

export default () => createStore(
  combineReducers({
    zoom: zoomReducer,
  }), INITIAL, typeof devToolsExtension==='function' ? devToolsExtension() : undefined);
