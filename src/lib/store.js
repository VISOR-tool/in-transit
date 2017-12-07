import { createStore, combineReducers } from 'redux';

import { zoomReducer } from './reducers/zoom';
import { dataReducer } from './reducers/data';
import { filterReducer } from './reducers/filter';
import { selectionReducer } from './reducers/selection';

const INITIAL = {};

export default () => createStore(
  combineReducers({
    zoom: zoomReducer,
    data: dataReducer,
    filter: filterReducer,
    selection: selectionReducer,
  }), INITIAL, typeof devToolsExtension==='function' ? devToolsExtension() : undefined);
