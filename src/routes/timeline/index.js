import { h, Component } from 'preact';
import style from './style';
import Timeline from '../../components/timeline/timeline';
import Hitlist from '../../components/timeline/hitlist';
import Oproc from '../../components/oproc/oproc';
import Reflux from 'reflux';
import FluxStore from '../../components/timeline/flux-stores.js';




export default class Home extends Component {
  constructor () {
    super();
    let zoomSectionStart = new Date( Date.parse(2015) );
    let zoomSectionEnd = new Date( Date.parse(2017) );
    this.state = {
      zoomMin: 30 * 3600 * 1000, //min zoom level 1 Month
      zoomMax: 2.1 * 365 * 24 * 3600 * 1000, //max zoom level 2 Years
      zoomSectionStart: zoomSectionStart,
      zoomSectionEnd: zoomSectionEnd,
      timelineDrag: {drag: false},
      oproc: {},
      filter:
        {
          processMapping: "Beteiligten",
          wrapEmptyLanes: "on",
          lanesSortOrder: "aufsteigend",
          procOnlyVisibleWith: "",
          procVisibileWithout: "",
          processParticipation: "beliebiger",
        },
      };
    this.handleProcessParticipation = this.handleProcessParticipation.bind(this);
    this.handleProcVisibileWithout = this.handleProcVisibileWithout.bind(this);
    this.handleProcOnlyVisibleWith = this.handleProcOnlyVisibleWith.bind(this);
    this.handleProcessMapping = this.handleProcessMapping.bind(this);
    this.handleSwimlaneWrap = this.handleSwimlaneWrap.bind(this);
    this.handleLanesSortOrder = this.handleLanesSortOrder.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.handleSetStart = this.handleSetStart.bind(this);

    let oProc = new Oproc;
    //oProc.reload("oproc.json")
    //oProc.reload("oproc-tiny-tree.json")
    oProc.reload("oproc-elias.json")
        .then( oproc => this.setState({oproc: oproc}))
    Reflux.connect(FluxStore, 'fluxtest');
  };


  handleZoomTimeline = event => {

    event.preventDefault();
        if(event.type === "wheel"){
      let distance = ( event.deltaY * ((this.state.zoomSectionEnd.getTime() - this.state.zoomSectionStart.getTime())/1000) );
      let newStart = new Date( this.state.zoomSectionStart.getTime() + distance);
      let newEnd   = new Date( this.state.zoomSectionEnd.getTime() - distance);
      this.setState( {zoomSectionStart:newStart, zoomSectionEnd:newEnd} );
    }
  }

  handleDragTimeline = event => {
    event.preventDefault();
    if(event.type === "mousewheel" || event.type === "wheel"){
      let distance = ( event.deltaY * ((this.state.zoomSectionEnd.getTime() - this.state.zoomSectionStart.getTime())/1000) );
      let newStart = new Date( this.state.zoomSectionStart.getTime() + distance);
      let newEnd   = new Date( this.state.zoomSectionEnd.getTime() + distance);
      this.setState( {zoomSectionStart:newStart, zoomSectionEnd:newEnd} );
    }


    if(event.type === "mousedown") this.setState({timelineDrag: {drag:true, start: event.x} });
    if(event.type === "mouseup") this.setState({timelineDrag: {drag:false} });

    if(this.state.timelineDrag.drag == true)
    {
      let distance = event.x - this.state.timelineDrag.start; ((this.state.zoomSectionEnd.getTime() - this.state.zoomSectionStart.getTime())/1000);
      let start = new Date(this.state.zoomSectionStart.valueOf() - distance * 6000000);
      let end = new Date(this.state.zoomSectionEnd.valueOf() - distance * 6000000);
      this.setState({zoomSectionStart: start, zoomSectionEnd: end} );
    }
  }

  searchHitObjectSelection = (searchHit,event) => {

    const oproc = this.state.oproc;
    oproc.process.childs.map( proc => {
        proc.searchHit = false;
        if(searchHit.cat == 'sh'){
          if(proc.initiator == searchHit.val) proc.searchHit = true;
          proc.searchHit = proc.participants.some( shId => { return shId == searchHit.val } );
        }
        if(searchHit.cat == 'proc')
          if(proc.id == searchHit.val) {
              proc.searchHit = true;
          }
        if(searchHit.cat == 'loc')
          if(proc.location == searchHit.val) proc.searchHit = true;
        return proc;
      });
    this.setState(oproc)
  }

  handleProcessParticipation(event){
    const filter = this.state.filter;
    if( filter.processParticipation == "beliebiger" )
      filter.processParticipation = "offener";
    else
      filter.processParticipation = "beliebiger";
    //change the visibility proerty for unwanted processes
    const oproc = this.state.oproc;
    oproc.process.childs.forEach( proc => {
        if(filter.processParticipation == "offener" && proc.participation == 'closed')
          proc.visible = false;
        else
          proc.visible = true;
        return proc;
      });
    this.setState(filter);
    this.setState(oproc)
  }

  handleProcVisibileWithout(event){
    const filter = this.state.filter;
    filter.procVisibileWithout = event.target.selectedOptions[0].value;
    this.setState(filter);
    //change the visibility proerty for unwanted processes
    const oproc = this.state.oproc;
    oproc.process.childs.forEach( proc => {
      if(proc.participants.indexOf( filter.procVisibileWithout ) == -1)
        proc.visible = true;
      else
        proc.visible = false;
    });
    this.setState(oproc)
  }

  handleProcOnlyVisibleWith(event){
    const filter = this.state.filter;
    filter.procOnlyVisibleWith = event.target.selectedOptions[0].value;
    this.setState(filter);
    //change the visibility proerty for unwanted processes
    const oproc = this.state.oproc;
    oproc.process.childs.forEach( proc => {
      if(proc.participants.indexOf( filter.procOnlyVisibleWith ) == -1)
        proc.visible = false;
      else
        proc.visible = true;
      return proc;
    });
    this.setState(oproc)
  }

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
    this.setState({ zoom: event.target.value });
    this.render();
  };

  handleSetStart(event){
    this.setState({ zoomSectionStart: Date.parse(event.target.value) });
  };

  render () {
    if(this.state.oproc.process == undefined) return "Daten werden noch geladen";
    let zoomEnd = new Date(this.state.zoomSectionStart.valueOf() + ((this.state.zoomMax - this.state.zoomMin)/100) * this.state.zoom);
    let oldStartDate = new Date(this.state.zoomSectionStart);
    let stakeholderOptions = this.state.oproc.process.stakeholder.map(sh => <option value={sh.id}>{sh.name}</option>);

    return (
      <div class={style.home}>
          <div class={style.filter}>
            <p><b>Swimmbahnen</b>
              <br />in Schwimbahnen Prozesse zeigen von: <b onClick={this.handleProcessMapping}>{this.state.filter.processMapping}</b>
              <br />leere Schwimbahnen ausblenden: <b onClick={this.handleSwimlaneWrap}>{this.state.filter.wrapEmptyLanes}</b>
              <br />Aphabetisch <b onClick={this.handleLanesSortOrder}>{this.state.filter.lanesSortOrder}</b> sortieren
            </p><p><b>Prozese</b>
              <br />nur Prozesse mit <b onClick={this.handleProcessParticipation}>{this.state.filter.processParticipation}</b> Beteiligung anzeigen
              <br />nur Prozesse mit Beteiligung von: <select onChange={this.handleProcOnlyVisibleWith}>{stakeholderOptions}</select>
              <br />nur Prozesse ohne Beteiligung von: <select onChange={this.handleProcVisibileWithout}>{stakeholderOptions}</select>
            </p>
          </div>

          <div class={style.hitlist}>
            <Hitlist
              process={this.state.oproc}
              handleSearchHits={this.searchHitObjectSelection}/>
          </div>

        <div class={style.timeline}>
          <h4>{this.state.oproc.process.name}</h4>
          <Timeline
            handleDragTimeline={this.handleDragTimeline}
            handleZoomTimeline={this.handleZoomTimeline}
            width="600"
            height="1000"
            beginning={this.state.zoomSectionStart}
            end={this.state.zoomSectionEnd}
            process={this.state.oproc}
            filter={this.state.filter}
           />
      </div>
      </div>
    );
  }
}
