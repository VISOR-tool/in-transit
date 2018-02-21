import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import Textsearch from '../../components/timeline/textsearch';
import Toplist from '../../components/timeline/toplist';
import { filterActions } from '../../lib/reducers/filter';
import style from './filter';

const TAB_NAMES = [
  'Filtern',
  'Ordnen',
  'Suchen',
  'Aktiv',
];

class Filtering extends Component {
  constructor() {
    super()
    this.state = {
      tab: 0,
    };
  }

  renderContent() {
    const {
      data, filter,
      toggleProcessOnlyWithResults, toggleParticipation,
      setProcVisibleWithout, setProcOnlyVisibleWith,
      toggleProcessMapping, toggleLaneOrder,
      toggleLaneWrap, toggleSwimlanesMode,
    } = this.props;
    const stakeholderOptions = [{ id: "", name: "…" }]
          .concat(data.process && data.process.stakeholder || [])
          .map(
            sh => <option value={sh.id}>{sh.name}</option>
          );

    switch(this.state.tab) {
    case 0:
      return (
        <dl class={style.filter}>
          <dd>onClick: markieren/<b>selektieren</b></dd>
          <dt><b>Prozesse</b></dt>
          <dd onClick={toggleParticipation}>nur Prozesse mit <b>{filter.processParticipation}</b> Beteiligung anzeigen</dd>
          <dd onClick={toggleProcessOnlyWithResults}>nur Prozesse mit Ergebnissen anzeigen: <b>{filter.processOnlyWithResults}</b> </dd>
          <dd>nur Prozesse mit Beteiligung von: <select onChange={event => setProcOnlyVisibleWith(event.target.selectedOptions[0].value)}>{stakeholderOptions}</select></dd>
          <dd>nur Prozesse ohne Beteiligung von: <select onChange={event => setProcVisibleWithout(event.target.selectedOptions[0].value)}>{stakeholderOptions}</select></dd>
        </dl>
      );
    case 1:
      return (
        <dl class={style.filter}>
          <b>Swimmbahnen</b>
          <dd onClick={toggleSwimlanesMode}>Swimlanes: <b>{filter.swimlanesMode}</b> </dd>
          <dd onClick={toggleProcessMapping}>Schwimmbahnen sind: <b>{filter.processMapping}</b></dd>
          <dd onClick={toggleLaneWrap}>leere Schwimmbahnen ausblenden: <b>{filter.laneWrap ? 'an' : 'aus'}</b></dd>
          <dd onClick={toggleLaneOrder}>Aphabetisch <b>{filter.laneOrder == 'asc' ? "aufsteigend" : "absteigend"}</b> sortieren</dd>
        </dl>
      );
    case 2:
      return (
        <div class={style.textsearch}>
          <Textsearch
            process={data}
            handleOnClicks={this.objectSelectionManager} />
        </div>
      );
    case 3:
      return (
        <div class={style.toplist}>
          <Toplist
            handleOnClicks={this.objectSelectionManager}/>
        </div>
      );
    default:
      return null;
    }
  }
  
  render() {
    const selectTab = tab => () => this.setState({ tab });

    return (
      <div>
        <ul class={style.tabs}>
          {TAB_NAMES.map((tab, i) => (
            <li onClick={selectTab(i)}
                class={i == this.state.tab ? style.selectedTab : style.deselectedTab}
              >{tab}</li>
          ))}
        </ul>

        {this.renderContent()}
      </div>
    );
  }
}

const mapStateToProps = ({ data, filter }) => ({
  data: data && data.data,
  filter,
});
const mapDispatchToProps = dispatch => ({
  toggleProcessOnlyWithResults: () => dispatch(filterActions.toggleProcessOnlyWithResults()),
  toggleParticipation: () => dispatch(filterActions.toggleParticipation()),
  setProcVisibleWithout: value => dispatch(filterActions.setProcVisibleWithout(value)),
  setProcOnlyVisibleWith: value => dispatch(filterActions.setProcOnlyVisibleWith(value)),
  toggleProcessMapping: () => dispatch(filterActions.toggleProcessMapping()),
  toggleLaneOrder: () => dispatch(filterActions.toggleLaneOrder()),
  toggleLaneWrap: () => dispatch(filterActions.toggleLaneWrap()),
  toggleSwimlanesMode: () => dispatch(filterActions.toggleSwimlanesMode()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filtering);
