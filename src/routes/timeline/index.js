import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import Filtering from './../../components/timeline/filtering';
import Timeline from '../../components/timeline/timeline';
import Textsearch from '../../components/timeline/textsearch';
import Toplist from '../../components/timeline/toplist';
import SimplGraph from '../../components/simplGraph/simplGraph';
import { dataLoad } from '../../lib/reducers/data';
import { filterActions } from '../../lib/reducers/filter';
import style from './style';


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
      <div>
        <div class={style.sidebar}>
          <Filtering />
        </div>
        <div class={style.workspace}>
          <SimplGraph  width={640} height={100} />        
          <h4>{data.process.name}</h4>        
          <Timeline
            width="600"
            height="1000"
            process={data}
            filter={filter}
            />
                  Der untere view macht keinen Sinn, da potentiell verbundene Objekte gar nicht auf einer Swimlane liegen müssen. die Folge: viele unverbundene Objekte. Swimlanes machen eher Sinn für größere Themengebiete. Vielleicht auch für Parent-child-verbindungen.
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ data, filteredData, filter }) => ({
  dataUrl: data.wantedUrl,
  data: filteredData,
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
