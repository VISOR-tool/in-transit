import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import style from './style';
import SimplGraph from '../../components/simplGraph/simplGraph';
import Timeline from '../../components/timeline/timeline';
import Hitlist from '../../components/timeline/hitlist';
import Toplist from '../../components/timeline/toplist';
import { dataLoad } from '../../lib/reducers/data';
import { applyFilter, filterActions } from '../../lib/reducers/filter';


class TimelineRoute extends Component {
  
  render () {
    const { dataUrl, loadData, data } = this.props;
    const wantedUrl = 'oproc-elias-2018.json'; //'oproc-elias-2018.json'; //'oproc-tiny-tree.json'
    if (dataUrl !== wantedUrl) {
      setTimeout(() => {
        if (dataUrl !== wantedUrl) {
          loadData(wantedUrl);
        }
      }, 1000);
    }
    
    if(data.process == undefined) return "Daten werden noch geladen";
    let stakeholderOptions = [{ id: "", name: "…" }].concat(data.process.stakeholder).map(sh => <option value={sh.id}>{sh.name}</option>);

    const {
      filter,
      toggleSelectionBehaviour,
      toggleParticipation,
      setProcVisibleWithout,
      setProcOnlyVisibleWith,
      toggleProcessMapping,
      toggleLaneOrder,
      toggleLaneWrap,
      toggleProcessOnlyWithResults,
    } = this.props;
    return (
      <div class={style.home}>
          <dl class={style.filter}>
          <dt><b>Listeneinträge</b></dt>
              <dd>onClick alleinstellen: <click onClick={toggleSelectionBehaviour}>{filter.selectionBehaviour}</click></dd>
            <dt><b>Swimmbahnen</b></dt>
              <dd>in Schwimmbahnen Prozesse zeigen von: <b onClick={toggleProcessMapping}>{filter.processMapping}</b></dd>
              <dd>leere Schwimmbahnen ausblenden: <b onClick={toggleLaneWrap}>{filter.laneWrap ? 'an' : 'aus'}</b></dd>
              <dd>Aphabetisch <b onClick={toggleLaneOrder}>{filter.laneOrder == 'asc' ? "aufsteigend" : "absteigend"}</b> sortieren</dd>
            <dt><b>Prozese</b></dt>
              <dd>nur Prozesse mit <b onClick={toggleParticipation}>{filter.processParticipation}</b> Beteiligung anzeigen</dd>
              <dd>nur Prozesse mit Ergebnissen anzeigen: <b onClick={toggleProcessOnlyWithResults}>{filter.processOnlyWithResults}</b> </dd>
              <dd>nur Prozesse mit Beteiligung von: <select onChange={event => setProcOnlyVisibleWith(event.target.selectedOptions[0].value)}>{stakeholderOptions}</select></dd>
              <dd>nur Prozesse ohne Beteiligung von: <select onChange={event => setProcVisibleWithout(event.target.selectedOptions[0].value)}>{stakeholderOptions}</select></dd>
            </dl>

          <div class={style.hitlist}>
            <Hitlist
              process={data} />
          </div>

          <div class={style.toplist}>
            <Toplist />
          </div>

        <SimplGraph  width={640} height={100} />
        Der untere view macht keinen Sinn, da potentiell verbundene Objekte gar nicht auf einer Swimlane liegen müssen. die Folge: viele unverbundene Objekte. Swimlanes machen eher Sinn für größere Themengebiete. Vielleicht auch für Parent-child-verbindungen.
        <div class={style.timeline}>
          <h4>{data.process.name}</h4>
          <Timeline
            width="600"
            height="1000"
            process={data}
            filter={filter}
           />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ data, filter }) => ({
  dataUrl: data.wantedUrl,
  data: applyFilter(data.data, filter),
  filter,

});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
  toggleSelectionBehaviour: () => dispatch(filterActions.toggleSelectionBehaviour()),
  toggleProcessOnlyWithResults: () => dispatch(filterActions.toggleProcessOnlyWithResults()),
  toggleParticipation: () => dispatch(filterActions.toggleParticipation()),
  setProcVisibleWithout: value => dispatch(filterActions.setProcVisibleWithout(value)),
  setProcOnlyVisibleWith: value => dispatch(filterActions.setProcOnlyVisibleWith(value)),
  toggleProcessMapping: () => dispatch(filterActions.toggleProcessMapping()),
  toggleLaneOrder: () => dispatch(filterActions.toggleLaneOrder()),
  toggleLaneWrap: () => dispatch(filterActions.toggleLaneWrap()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineRoute);
