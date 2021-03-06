import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import Filtering from './../../components/timeline/filtering';
import Timeline from '../../components/timeline/timeline';
import Textsearch from '../../components/timeline/textsearch';
import Toplist from '../../components/timeline/toplist';
import DetailsOverlay from '../../components/timeline/details';
import RelationsGraph from '../../components/relationsGraph/relationsGraph';
import { dataLoad } from '../../lib/reducers/data';
import { filterActions } from '../../lib/reducers/filter';
import style from './style';

const TIMELINE_MIN_HEIGHT = 240;

class TimelineRoute extends Component {
  render () {
    const { dataUrl, loadData, data } = this.props;
    const wantedUrl = 'oproc-elias.json'; // 'oproc-elias-145-kapselt-ein.json'; //'oproc-elias-2018.json'; //'oproc-tiny-tree.json'

    if (dataUrl !== wantedUrl) {
      setTimeout(() => {
        if (dataUrl !== wantedUrl) {
          loadData(wantedUrl);
        }
      }, 1000);
    }

    if (data.process == undefined) return 'Daten werden noch geladen';
    let stakeholderOptions = [{ id: '', name: '…' }].concat(data.process.stakeholder).map(sh => <option value={sh.id}>{sh.name}</option>);

    const {
      filter,
      toggleSelectionBehaviour,
      toggleParticipation,
      setProcVisibleWithout,
      setProcOnlyVisibleWith,
      toggleProcessMapping,
      toggleLaneOrder,
      toggleLaneWrap,
      toggleProcessOnlyWithResults
    } = this.props;

    return (
      <div class={style.container}>
        <div class={style.tile1}>
          <RelationsGraph width={640} height={100} />
        </div>
        <div class={style.tile2}>
          <Filtering />
        </div>
        <div class={style.tile3}>
          <Timeline
            width={window.outerWidth - 5}
            height={Math.max(TIMELINE_MIN_HEIGHT, window.innerHeight - 300)}
            process={data}
            filter={filter}
          />
        </div>
        <DetailsOverlay />
      </div>
    );
  }
}

const mapStateToProps = ({ data, filteredData, filter }) => ({
  dataUrl: data.wantedUrl,
  data: filteredData,
  filter
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
  toggleLaneWrap: () => dispatch(filterActions.toggleLaneWrap())
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineRoute);
