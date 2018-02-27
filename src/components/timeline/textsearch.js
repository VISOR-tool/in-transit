import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { selectionActions } from '../../lib/reducers/selection';
import { searchActions } from '../../lib/reducers/search';

function searchInPersons (query, data) {
  return data.process.stakeholder
    .filter(sh => sh.name.toLowerCase().includes(query.toLowerCase()));
}

function searchInProcesses (query, data) {
  return data.process.childs
    .filter(proc => proc.name.toLowerCase().includes(query.toLowerCase()));
}

function searchInLocations (query, data) {
  return data.process.locations
    .filter(loc =>
      Object.values(loc).toString().toLowerCase()
        .includes(query.toLowerCase())
    );
}

/*
 * Auftrennung des Prozesses. Rein kommt das ganze Objekt
 * raus gehen verschiedene swimlanes die 1:n Ojekte enthalten
 */
function Textsearch ({ select, search, query, data }) {
  const searchHits = query.length > 2 ? {
    stakeholder: searchInPersons(query, data),
    processes: searchInProcesses(query, data),
    locations: searchInLocations(query, data)
  } : {
    stakeholder: [],
    processes: [],
    locations: []
  };
  let stakeholder = '';
  if (searchHits.stakeholder.length > 0) {
    stakeholder = searchHits.stakeholder.map(
      hit => <li onClick={() => select({cat: 'sh', val: hit.id})} >
        {hit.name} </li>);
    stakeholder = <div> <b>Prozessbeteilige</b> <ul>{stakeholder}</ul> </div>;
  }

  let processes = '';
  if (searchHits.processes.length > 0) {
    processes = searchHits.processes.map(
      hit => <li onClick={() => select(hit.id)} >
        {hit.name} </li>);
    processes = <div> <b>Prozesse</b> <ul>{processes}</ul> </div>;
  }

  let locations = '';
  if (searchHits.locations.length > 0) {
    locations = searchHits.locations.map(
      hit => <li onClick={() => select({cat: 'loc', val: hit.id})} >
        {hit.city}:<i>{hit.address} {hit.room}</i></li>);
    locations = <div><b>Orte</b><ul>{locations}</ul></div>;
  }

  const handleSearch = (event) => {
    let query = event.target.value;
    search(query);
  };

  return (
    <div class='textsearch'>
      Suche: <input type='text' onInput={handleSearch} />
      {stakeholder}
      {processes}
      {locations}
    </div>
  );
}

const mapStateToProps = ({ search, filteredData }) => ({
  query: search.query,
  data: filteredData
});
const mapDispatchToProps = dispatch => ({
  select: value => dispatch(selectionActions.select(value)),
  search: query => dispatch(searchActions.search(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(Textsearch);
