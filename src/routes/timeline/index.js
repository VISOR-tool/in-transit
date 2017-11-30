import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import style from './style';
import Timeline from '../../components/timeline/timeline';
import Hitlist from '../../components/timeline/hitlist';
import { dataLoad } from '../../lib/reducers/data';


class TimelineRoute extends Component {
  constructor () {
    super();

    this.state = {
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
  };

  objectSelectionManager = (hitProperty,event) => {
    const oproc = this.state.oproc;
    oproc.process.childs.map( proc => {
        proc.searchHit = false;
        if(hitProperty.cat == 'sh'){
          if(proc.initiator == hitProperty.val) proc.searchHit = true;
          proc.searchHit = proc.participants.some( shId => { return shId == hitProperty.val } );
        }
        if(hitProperty.cat == 'proc')
          if(proc.id == hitProperty.val) {
              proc.searchHit = true;
          }
        if(hitProperty.cat == 'loc')
          if(proc.location == hitProperty.val) proc.searchHit = true;
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
    this.setState(filter);  // !?!
    this.setState(oproc)  // WAT?
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

  render () {
    console.log('render', this.props);
    const { dataUrl, loadData, data } = this.props;
    const wantedUrl = 'oproc-elias.json';
    if (dataUrl !== wantedUrl) {
      setTimeout(() => {
        if (dataUrl !== wantedUrl) {
          loadData(wantedUrl);
        }
      }, 1000);
    }

    if(data.process == undefined) return "Daten werden noch geladen";
    let stakeholderOptions = data.process.stakeholder.map(sh => <option value={sh.id}>{sh.name}</option>);

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
              process={data}
              handleOnClicks={this.objectSelectionManager}/>
          </div>


        <div class={style.timeline}>
          <h4>{data.process.name}</h4>
          <Timeline
            width="600"
            height="1000"
            process={data}
            filter={this.state.filter}
           />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ data }) => ({
  dataUrl: data.wantedUrl,
  data: data.data,
});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineRoute);
