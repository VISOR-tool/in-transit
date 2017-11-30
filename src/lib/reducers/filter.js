const INITIAL_STATE = {
  processMapping: 'Beteiligten',
  laneWrap: true,
  laneOrder: 'asc',
  procOnlyVisibleWith: '',
  procVisibileWithout: '',
  processParticipation: 'beliebiger',
};

const TOGGLE_PARTICIPATION = 'visor/filter/TOGGLE_PARTICIPATION';
const SET_PROC_VISIBLE_WITHOUT = 'visor/filter/SET_PROC_VISIBLE_WITHOUT';
const SET_PROC_ONLY_VISIBLE_WITH = 'visor/filter/SET_PROC_ONLY_VISIBLE_WITH';
const TOGGLE_PROCESS_MAPPING = 'visor/filter/TOGGLE_PROCESS_MAPPING';
const TOGGLE_LANE_ORDER = 'visor/filter/TOGGLE_LANE_ORDER';
const TOGGLE_LANE_WRAP = 'visor/filter/TOGGLE_LANE_WRAP';

export function filterReducer(filterState = INITIAL_STATE, action) {
  switch(action['type']) {
  case TOGGLE_PARTICIPATION:
    return {
      ...filterState,
      processParticipation: filterState.processParticipation == 'beliebiger' ?
        'offener' : 'beliebiger',
    };
  case SET_PROC_VISIBLE_WITHOUT:
    return {
      ...filterState,
      procVisibileWithout: action.value,
    };
  case SET_PROC_ONLY_VISIBLE_WITH:
    return {
      ...filterState,
      procOnlyVisibleWith: action.value,
    };
  case TOGGLE_PROCESS_MAPPING:
    return {
      ...filterState,
      processMapping: filterState.processMapping == 'Initiator' ?
        'Beteiligten' : 'Initiator',
    };
  case TOGGLE_LANE_ORDER:
    return {
      ...filterState,
      laneOrder: filterState.laneOrder == 'asc' ?
        'desc' : 'asc',
    };
  case TOGGLE_LANE_WRAP:
    return {
      ...filterState,
      laneWrap: ! filterState.laneWrap,
    };
  default:
    return filterState;
  }
}

export const filterActions = {
  toggleParticipation: () => ({
    type: TOGGLE_PARTICIPATION,
  }),

  setProcVisibleWithout: value => ({
    type: SET_PROC_VISIBLE_WITHOUT,
    value,
  }),

  setProcOnlyVisibleWith: value => ({
    type: SET_PROC_ONLY_VISIBLE_WITH,
    value,
  }),

  toggleProcessMapping: () => ({
    type: TOGGLE_PROCESS_MAPPING,
  }),

  toggleLaneOrder: () => ({
    type: TOGGLE_LANE_ORDER,
  }),

  toggleLaneWrap: () => ({
    type: TOGGLE_LANE_WRAP,
  }),
};

export function applyFilter(data, filter) {
  if (!data.process) return data;

  (data.process.stakeholder || []).sort(
    filter.laneOrder == 'asc' ?
      (a,b) => a.name.localeCompare(b.name) :
      (a,b) => b.name.localeCompare(a.name)
  );

  data.process.childs = (data.process.childs || []).map(proc => {
    proc.visible =
      !(filter.processParticipation == 'offener' && proc.participation == 'closed') &&
      (!filter.procVisibileWithout || proc.participants.indexOf( filter.procVisibileWithout ) == -1) &&
      (!filter.procOnlyVisibleWith || proc.participants.indexOf( filter.procOnlyVisibleWith ) != -1);

    return proc;
  });
  
  return data;
}
