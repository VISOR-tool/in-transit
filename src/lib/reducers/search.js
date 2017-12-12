const INITIAL_STATE = {
  query: "",
};

const SEARCH = 'visor/search/SEARCH';

export function searchReducer(searchState = INITIAL_STATE, action) {
  switch(action['type']) {
  case SEARCH:
    return {
      ...searchState,
      query: action.value,
    };
  default:
    return searchState;
  }
}

export const searchActions = {
  search: query => ({
    type: SEARCH,
    value: query,
  }),
};
