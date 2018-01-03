import { createStore, combineReducers } from 'redux';
import { zoomReducer } from './reducers/zoom';
import { dataReducer } from './reducers/data';
import { filterReducer } from './reducers/filter';
import { selectionReducer } from './reducers/selection';
import { searchReducer } from './reducers/search';

const INITIAL = {};

export default () => createStore(
  combineReducers({
    zoom: zoomReducer,
    data: dataReducer,
    filter: filterReducer,
    selection: selectionReducer,
    search: searchReducer,
  }), INITIAL, typeof devToolsExtension==='function' ? devToolsExtension() : undefined);
