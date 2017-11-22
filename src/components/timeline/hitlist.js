import { h, Component } from 'preact';

export default class Hitlist extends Component {
  constructor () {
    super();
    this.setState({
        searchTerm: "",
        searchHits: {
          stakeholder: [],
          processes: [],
          locations: [],
          },
        });
    this.handleSearch = this.handleSearch.bind(this);
  }

  /*
   * Auftrennung des Prozesses. Rein kommt das ganze Objekt
   * raus gehen verschiedene swimlanes die 1:n Ojekte enthalten
   */

  searchInPersons(searchTerm){
      const searchHits = this.state.searchHits;
      let hits = [];
      this.props.process.process.stakeholder.forEach(
          (sh) => {
            if(sh.name.toLowerCase().includes(searchTerm.toLowerCase()))
              hits.push(sh);
        },
        );
      if(hits.length > 0) {
        searchHits.stakeholder = hits;
        this.setState({searchHits: searchHits});
      }
      return hits;
  }

  searchInProcesses(searchTerm){
      const searchHits = this.state.searchHits;
      let hits = [];
      this.props.process.process.childs.forEach(
          (proc) => {
            if(proc.name.toLowerCase().includes(searchTerm.toLowerCase())) hits.push(proc);
          }
        );
      if(hits.length > 0) {
        searchHits.processes = hits;
        this.setState({searchHits: searchHits});
      }
  }

  searchInLocations(searchTerm){
      const searchHits = this.state.searchHits;
      let hits = [];
      this.props.process.process.locations.forEach(
          loc => {
            let str = Object.values(loc).toString().toLowerCase();
            if( str.includes(searchTerm.toLowerCase()))
              hits.push(loc);
          }
        );
      if(hits.length > 0) {
        searchHits.locations = hits;
        this.setState({searchHits: searchHits});
      }
  }

  handleSearch(event){
    if(event.target.value.length > 2){
      let searchTerm = event.target.value;
      this.setState({ searchTerm: searchTerm });

      this.searchInPersons(searchTerm);
      this.searchInProcesses(searchTerm);
      this.searchInLocations(searchTerm);
    }
  }


  render () {
    //const { beginning, end, steps, process, filter } = this.props;
    let stakeholder = "";
    if(this.state.searchHits.stakeholder.length > 0){
      stakeholder = this.state.searchHits.stakeholder.map( hit => <li>{hit.name}</li> )
      stakeholder = <div> <b>Prozessbeteilige</b> {stakeholder} </div>;
    }

    let processes = "";
    if(this.state.searchHits.processes.length > 0){
      processes = this.state.searchHits.processes.map( hit => <li>{hit.name}</li> )
      processes = <div> <b>Prozesse</b> {processes} </div>;
      }

    let locations = "";
    if(this.state.searchHits.locations.length > 0){
      locations = this.state.searchHits.locations.map( hit => <li>{hit.city}:<i>{hit.address} {hit.room}</i></li> )
        locations = <div><b>Orte</b>{locations}</div>;
    }


    return  <div>
              Suche: <input type="text" onInput={this.handleSearch} />

              {stakeholder}
              {processes}
              {locations}

          </div>
  }
}
