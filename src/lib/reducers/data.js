import Oproc from '../oproc';

const INITIAL_STATE = {
  data: {},
};

const LOAD_DATA = 'visor/data/LOAD_DATA';
const LOAD_DONE = 'visor/data/LOAD_DONE';
const LOAD_FAIL = 'visor/data/LOAD_FAIL';

export function dataReducer(dataState = INITIAL_STATE, action) {
  switch(action['type']) {
  case LOAD_DATA:
    // TODO: erase `data` already?
    return {
      ...dataState,
      wantedUrl: action.url,
    };
  case LOAD_DONE:
    if (action.url === dataState.wantedUrl) {
      return {
        wantedUrl: action.url,
        url: action.url,
        data: action.data
      };
    } else {
      // Ignore this result if `wantedUrl` has already been updated
      return dataState;
    }
  case LOAD_FAIL:
    if (action.url === dataState.wantedUrl) {
      return {
        wantedUrl: action.url,
        error: action.error.message || action.error.toString(),
        // dummy
        data: {},
      };
    } else {
      // Ignore this result if `wantedUrl` has already been updated
      return dataState;
    }
  default:
    return dataState;
  }
}

const dataActions = {
  loadData: (url) => ({
    type: LOAD_DATA,
    url,
  }),

  loadDone: (url, data) => ({
    type: LOAD_DONE,
    wantedUrl: url,
    url, data,
  }),

  loadFail: (url, error) => ({
    type: LOAD_FAIL,
    url, error,
  }),
};

export const dataLoad = dispatch => url => {
  dispatch(dataActions.loadData(url));

  const oproc = new Oproc();
  oproc.reload(url)
    .then(
      oproc => dispatch(dataActions.loadDone(url, oproc))
    )
    .catch(
      error => dispatch(dataActions.loadFail(url, error))
    )
}
