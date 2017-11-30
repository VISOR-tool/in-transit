import { createStore, combineReducers } from 'redux';

import { zoomReducer } from './reducers/zoom';
import { dataReducer } from './reducers/data';

const INITIAL = {};

export default () => createStore(
  combineReducers({
    zoom: zoomReducer,
    data: dataReducer,
  }), INITIAL, typeof devToolsExtension==='function' ? devToolsExtension() : undefined);
