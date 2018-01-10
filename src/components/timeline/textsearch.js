import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { selectionActions } from '../../lib/reducers/selection';
import { searchActions } from '../../lib/reducers/search';

class Textsearch extends Component {
  /*
   * Auftrennung des Prozesses. Rein kommt das ganze Objekt
   * raus gehen verschiedene swimlanes die 1:n Ojekte enthalten
   */

  searchInPersons(query){
    let hits = [];
    this.props.process.process.stakeholder.forEach(
      (sh) => {
        if(sh.name.toLowerCase().includes(query.toLowerCase()))
          hits.push(sh);
      },
    );
    return hits;
  }

  searchInProcesses(query){
    let hits = [];
    this.props.process.process.childs.forEach(
      (proc) => {
        if(proc.name.toLowerCase().includes(query.toLowerCase()))
          hits.push(proc);
      }
    );
    return hits;
  }

  searchInLocations(query){
    let hits = [];
    this.props.process.process.locations.forEach(
      loc => {
        let str = Object.values(loc).toString().toLowerCase();
        if( str.includes(query.toLowerCase()))
          hits.push(loc);
      }
    );
    return hits;
  }

  render () {
    const { select, search, query } = this.props;
    const searchHits = query.length > 2 ? {
      stakeholder: this.searchInPersons(query),
      processes: this.searchInProcesses(query),
      locations: this.searchInLocations(query),
    } : {
      stakeholder: 0,
      processes: 0,
      locations: 0,
    };
    let stakeholder = "";
    if(searchHits.stakeholder.length > 0){
      stakeholder = searchHits.stakeholder.map(
                    hit => <li onClick={() => select({cat:'sh',val:hit.id})} >
                               {hit.name} </li> )
      stakeholder = <div> <b>Prozessbeteilige</b> <ul>{stakeholder}</ul> </div>;
    }

    let processes = "";
    if(searchHits.processes.length > 0){
      processes = searchHits.processes.map(
                  hit => <li onClick={() => select(hit.id)} >
                             {hit.name} </li> )
      processes = <div> <b>Prozesse</b> <ul>{processes}</ul> </div>;
      }

    let locations = "";
    if(searchHits.locations.length > 0){
      locations = searchHits.locations.map(
                  hit => <li onClick={() => select({cat:'loc',val:hit.id})} >
                             {hit.city}:<i>{hit.address} {hit.room}</i></li> )
      locations = <div><b>Orte</b><ul>{locations}</ul></div>;
    }

    const handleSearch = (event) => {
      let query = event.target.value;
      search(query);
    };

    return  <div class="textsearch"> 
              Suche: <input type="text" onInput={handleSearch} />
              {stakeholder}
              {processes}
              {locations}
          </div>
  }
}

const mapStateToProps = ({ search }) => ({
  query: search.query,
});
const mapDispatchToProps = dispatch => ({
  select: value => dispatch(selectionActions.select(value)),
  search: query => dispatch(searchActions.search(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Textsearch);
