import { h, Component } from 'preact';
import style from './style';
import Timeline from '../../components/timeline/timeline';
import Oproc from '../../components/oproc/oproc';


class TimelineView extends Component {
  render() {
    if( this.props.data.process == undefined ) return "daten können nicht geladen werden ";
    return (
      <Timeline
        beginning={this.props.beginning}
        end={this.props.end}
        steps={this.props.steps}
        process={this.props.data}
        />
    );
  }
}

export default class Home extends Component {
  constructor () {
    super();
    this.state = {
      zoom: 99,
      zoomMin: 30 * 3600 * 1000, //min zoom level 1 Month
      zoomMax: 2.1 * 365 * 24 * 3600 * 1000, //max zoom level 2 Years
      zoomSectionStart: Date.parse(2015),
      oproc: {},
      filter:
        {
          wrapEmptyLanes: true,
          lanesSortOrder: "aufsteigend",
          processVisbility: "Partizipation",
        },
      };
    this.handleProcessVisbility = this.handleProcessVisbility.bind(this);
    this.handleSwimlaneWrap = this.handleSwimlaneWrap.bind(this);
    this.handleLanesSortOrder = this.handleLanesSortOrder.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.handleSetStart = this.handleSetStart.bind(this);

    let oProc = new Oproc;
    //oProc.reload("oproc.json")
    //oProc.reload("oproc-tiny-tree.json")
    oProc.reload("oproc-elias.json")
        .then( oproc => {
        this.setState({oproc: oproc});
    });
  };

  handleProcessVisbility(event){
    const filter = this.state.filter;
    if(filter.processVisbility == 'Partizipation')
         filter.processVisbility = 'Initiierung';
    else filter.processVisbility = 'Partizipation';
    this.setState({filter:filter});
  }

  handleLanesSortOrder(event){
    var sorted = this.state.oproc;
    const filter = this.state.filter;
    if(filter.lanesSortOrder == 'aufsteigend'){
      filter.lanesSortOrder = 'absteigend';
      sorted.process.stakeholder.sort(
        (a,b) => { return a.name.localeCompare(b.name) }
      );
    }
    else {
      filter.lanesSortOrder = 'aufsteigend';
      sorted.process.stakeholder.sort(
        (a,b) => { return b.name.localeCompare(a.name) }
      );
    }
    this.setState(filter);
    this.setState({oproc: sorted});
  };

  handleSwimlaneWrap(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const filter = this.state.filter;
    filter[name] = value;
    console.log(value);
    this.setState(filter);
  };

  handleZoom(event){
    event.preventDefault();
    this.setState({ zoom: event.target.value });
    this.render();
  };

  handleSetStart(event){
    event.preventDefault();
    this.setState({ zoomSectionStart: Date.parse(event.target.value) });
  };

  filter(){
    if(this.state.filter.wrapEmptyLanes) false;
  };

  render () {
    if(this.state.oproc.process == undefined) return "Daten werden noch geladen";
    let zoomEnd = new Date(this.state.zoomSectionStart + ((this.state.zoomMax - this.state.zoomMin)/100) * this.state.zoom);
    let oldStartDate = new Date(this.state.zoomSectionStart);
    return (
      <div class={style.home}>
        <div class={style.filter}>
          <b>Swimmbahnen</b>
            <br /><input
                    type="checkbox"
                    name="wrapEmptyLanes"
                    checked={this.state.filter.wrapEmptyLanes}
                    onChange={this.handleSwimlaneWrap}
                  />
                  leere Schwimbahnen ausblenden
            <br />Aphabetisch <b onClick={this.handleLanesSortOrder}>{this.state.filter.lanesSortOrder}</b> sortieren
            <br />Prozesse anzeigen nach:  <b onClick={this.handleProcessVisbility}>{this.state.filter.processVisbility}</b>
          <p>
          <b>Zoom</b>
          <br />start:
          <input
            id="zoomSectionStart"
            type="text"
            size="8"
            value={oldStartDate.getFullYear() +'.'+ oldStartDate.getMonth()}
            onChange={this.handleSetStart}
          />
          Zoom:
          <input
            type="range"
            id="zoom"
            value={this.state.zoom}
            onChange={this.handleZoom}
          />
          (1Mon/2Years)
         </p>
        </div>
        <h4>{this.state.oproc.process.name}</h4>
        <TimelineView
          width="600"
          height="1000"
          beginning={this.state.zoomSectionStart}
          end={zoomEnd.valueOf()}
          data={this.state.oproc}
         />
      </div>
    );
  }
}
