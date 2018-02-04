import { createStore, combineReducers } from 'redux';
import { zoomReducer } from './reducers/zoom';
import { dataReducer } from './reducers/data';
import { filterReducer, applyFilter } from './reducers/filter';
import { selectionReducer } from './reducers/selection';
import { searchReducer } from './reducers/search';
import { markerReducer } from './reducers/marker';

const INITIAL = {};

function makeFilterUpdater(inner) {
  return (oldState = INITIAL, action) => {
    // Avoid warning
    delete oldState.filteredData;

    const newState = inner(oldState, action);
    const { data, filter } = newState;
    const filteredData = applyFilter(data.data, filter);
    return {
      filteredData,
      ...newState
    };
  };
}

export default () => createStore(
  makeFilterUpdater(
    combineReducers({
      zoom: zoomReducer,
      data: dataReducer,
      filter: filterReducer,
      selection: selectionReducer,
      search: searchReducer,
      marker: markerReducer,
    })
  ),
  INITIAL,
  typeof devToolsExtension==='function' ? devToolsExtension() : undefined
);
