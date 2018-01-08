const INITIAL_STATE = {
  selectionBehaviour: 'on',
  processMapping: 'Beteiligten',
  laneWrap: true,
  laneOrder: 'asc',
  procOnlyVisibleWith: '',
  procVisibileWithout: '',
  processParticipation: 'beliebiger',
  processOnlyWithResults: 'on',
  visibleByProp: { loc: [], proc: [], sh: []},
};

const GET_OBJ_VISIBILITY = 'visor/filter/GET_OBJ_VISIBILITY';
const ADD_OBJ_TO_LIST_OF_VISIBLE = 'visor/filter/ADD_OBJ_TO_LIST_OF_VISIBLE';
const TOGGLE_SELECTION_BEAVIOUR = 'visor/filter/TOGGLE_SELECTION_BEAVIOUR';
const TOGGLE_PARTICIPATION = 'visor/filter/TOGGLE_PARTICIPATION';
const SET_PROC_VISIBLE_WITHOUT = 'visor/filter/SET_PROC_VISIBLE_WITHOUT';
const SET_PROC_ONLY_VISIBLE_WITH = 'visor/filter/SET_PROC_ONLY_VISIBLE_WITH';
const TOGGLE_PROCESS_MAPPING = 'visor/filter/TOGGLE_PROCESS_MAPPING';
const TOGGLE_LANE_ORDER = 'visor/filter/TOGGLE_LANE_ORDER';
const TOGGLE_LANE_WRAP = 'visor/filter/TOGGLE_LANE_WRAP';
const TOGGLE_WITH_RESULTS_ONLY = 'visor/filter/TOGGLE_WITH_RESULTS_ONLY';

export function filterReducer(filterState = INITIAL_STATE, action) {
  switch(action['type']) {
  case TOGGLE_SELECTION_BEAVIOUR:
    return{
      ...filterState,
      selectionBehaviour: filterState.selectionBehaviour == 'on' ? 'off' : 'on',
    }  
  case TOGGLE_WITH_RESULTS_ONLY:
    return{
        ...filterState,
        processOnlyWithResults: filterState.processOnlyWithResults == 'on' ? 'off' : 'on',
      }; 
  case TOGGLE_PARTICIPATION:
    return {
      ...filterState,
      processParticipation: filterState.processParticipation == 'beliebiger' ?
        'offener' : 'beliebiger',
    };

  case GET_OBJ_VISIBILITY:
    if( action.value != undefined && action.value.val.length != 0) {
      //console.log(filterState.visibleByProp[action.value.cat].indexOf(action.value.val));
    } 

  case ADD_OBJ_TO_LIST_OF_VISIBLE:
    if( action.value != undefined && action.value.val.length != 0) {
      let i = filterState.visibleByProp[action.value.cat].indexOf(action.value.val);
      if( i > -1 )  filterState.visibleByProp[action.value.cat].splice(i, 1);
      else filterState.visibleByProp[action.value.cat].push(action.value.val)
      return{
        ...filterState,
        }; 
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

  toggleSelectionBehaviour: () => ({
    type: TOGGLE_SELECTION_BEAVIOUR,
  }),

  toggleProcessOnlyWithResults: () => ({
    type: TOGGLE_WITH_RESULTS_ONLY,
  }),

  toggleParticipation: () => ({
    type: TOGGLE_PARTICIPATION,
  }),

  getVisibility: value =>({
    type: GET_OBJ_VISIBILITY,
    value
  }),

  toggleVisibility: value =>({
    type: ADD_OBJ_TO_LIST_OF_VISIBLE,
    value
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
      !(filter.processParticipation == 'offener' && proc.participation == 'closed') 
      && (!filter.procVisibileWithout || proc.participants.indexOf( filter.procVisibileWithout ) == -1) 
      && (!filter.procOnlyVisibleWith || proc.participants.indexOf( filter.procOnlyVisibleWith ) != -1);

    if(filter.selectionBehaviour === 'on'){
      proc.visible = filter.visibleByProp.proc.includes(proc.id);
      if( ! proc.visible )
        proc.location.map( loc => { if(filter.visibleByProp.loc.includes(loc)) proc.visible = true; });
      if( ! proc.visible )
        proc.participants.map( sh => { if(filter.visibleByProp.sh.includes(sh)) proc.visible = true; });
    }
    return proc;
  });
  
//  toggleProcessOnlyWithResults in der Filterübericht eingebaut -> hier jetzt wahrscheinlich die Filterung vornehmen

  return data;
}
