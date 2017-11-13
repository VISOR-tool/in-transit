import { h, Component } from 'preact';
import style from './style';
import Timeline from '../../components/timeline/timeline';
import Oproc from '../../components/oproc/oproc';
import Reflux from 'reflux';
import FluxStore from '../../components/timeline/flux-stores.js';



class TimelineView extends Component {
  render() {
    if( this.props.data.process == undefined ) return "daten können nicht geladen werden ";
    return (
      <Timeline
        beginning={this.props.beginning}
        end={this.props.end}
        steps={this.props.steps}
        process={this.props.data}
        filter={this.props.filter}
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
      fluxtest: 'bimbam',
      filter:
        {
          processMapping: "Initiator",
          wrapEmptyLanes: "off",
          lanesSortOrder: "aufsteigend",
        },
      };
    this.handleProcessMapping = this.handleProcessMapping.bind(this);
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

    Reflux.connect(FluxStore, 'fluxtest');
  };

  handleProcessMapping(event){
    const filter = this.state.filter;
    if(filter.processMapping == 'Initiator') filter.processMapping = 'Beteiligten';
    else filter.processMapping = 'Initiator';
    this.setState(filter);
  };

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
    const filter = this.state.filter;
    if(filter.wrapEmptyLanes == 'on') filter.wrapEmptyLanes = 'off';
    else filter.wrapEmptyLanes = 'on';
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

  render () {
    if(this.state.oproc.process == undefined) return "Daten werden noch geladen";
    let zoomEnd = new Date(this.state.zoomSectionStart + ((this.state.zoomMax - this.state.zoomMin)/100) * this.state.zoom);
    let oldStartDate = new Date(this.state.zoomSectionStart);
    return (
      <div class={style.home}>
        <div class={style.filter}>
          <b>Swimmbahnen</b>
            <br />in Schwimbahnen Prozesse zeigen von: <b onclick={this.handleProcessMapping}>{this.state.filter.processMapping}</b>
            <br />leere Schwimbahnen ausblenden: <b onclick={this.handleSwimlaneWrap}>{this.state.filter.wrapEmptyLanes}</b>
            <br />Aphabetisch <b onClick={this.handleLanesSortOrder}>{this.state.filter.lanesSortOrder}</b> sortieren
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
          filter={this.state.filter}
         />
      </div>
    );
  }
}
