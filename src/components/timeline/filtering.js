import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import Textsearch from '../../components/timeline/textsearch';
import Toplist from '../../components/timeline/toplist';
import Chronology from '../../components/chronology/chronology';
import ShList from '../../components/shList/shList';
import Results from '../../components/results/results';
import { filterActions, PROCESS_MAPPINGS } from '../../lib/reducers/filter';
import style from './filter';

const TAB_NAMES = [
  'Filtern',
  'Ordnen',
  'Suchen',
  'Aktiv',
  'Chronologie',
  'Akteure',
  'Resultate'
];

class Filtering extends Component {
  constructor () {
    super();
    this.state = {
      tab: 0
    };
  }

  renderContent () {
    const {
      data, filter,
      toggleProcessOnlyWithResults, toggleParticipation,
      setProcVisibleWithout, setProcOnlyVisibleWith,
      setProcessMapping, toggleLaneOrder,
      toggleLaneWrap, toggleSwimlanesMode
    } = this.props;
    switch (this.state.tab) {
      case 0:
        const stakeholderOptions = [{ id: '', name: '…' }]
          .concat(data.process && data.process.stakeholder || [])
          .map(
            sh => <option value={sh.id}>{sh.name}</option>
          );

        return (
          <dl class={style.filter}>
            <dt><b>Prozesse</b></dt>
            <dd><label><input type='checkbox' checked={filter.processParticipation == 'offener'} onchange={toggleParticipation}/> nur Prozesse mit <b>offener</b> Beteiligung anzeigen</label></dd>
            <dd><label><input type='checkbox' checked={filter.processOnlyWithResults == 'on'} onchange={toggleProcessOnlyWithResults}/>nur Prozesse mit Ergebnissen anzeigen</label></dd>
            <dd>nur Prozesse mit Beteiligung von: <select onChange={event => setProcOnlyVisibleWith(event.target.selectedOptions[0].value)}>{stakeholderOptions}</select></dd>
            <dd>nur Prozesse ohne Beteiligung von: <select onChange={event => setProcVisibleWithout(event.target.selectedOptions[0].value)}>{stakeholderOptions}</select></dd>
          </dl>
        );
    case 1:
        const enabled = filter.swimlanesMode == 'on';

        return (
          <dl class={style.filter}>
            <b>Swimmbahnen</b>
            <dd>
              <label><input type='checkbox' checked={enabled} onchange={toggleSwimlanesMode}/> Swimlanes: </label>
              <select onchange={event => setProcessMapping(event.target.selectedOptions[0].value)} disabled={! enabled}>
                {PROCESS_MAPPINGS
                   .map(name => <option value={name} selected={filter.processMapping == name}>{name}</option>)
                }
              </select>
            </dd>
            <dd><label><input type='checkbox' checked={filter.laneWrap} onchange={toggleLaneWrap} disabled={! enabled}/> leere Schwimmbahnen ausblenden</label></dd>
            <dd onClick={toggleLaneOrder}>Aphabetisch <b>{filter.laneOrder == 'asc' ? 'aufsteigend' : 'absteigend'}</b> sortieren</dd>
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
              handleOnClicks={this.objectSelectionManager} />
          </div>
        );
      case 4:
        return (
          <div class={style.chronology}>
            <Chronology
            />
          </div>
        );
      case 5:
        return (
          <div class={style.shList}>
            <ShList
            />
          </div>
        );
      case 6:
        return (
          <div class={style.results}>
            <Results
            />
          </div>
        );
      default:
        return null;
    }
  }

  render () {
    const selectTab = tab => () => this.setState({ tab });

    return (
      <div class={style.component}>
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
  filter
});
const mapDispatchToProps = dispatch => ({
  toggleProcessOnlyWithResults: () => dispatch(filterActions.toggleProcessOnlyWithResults()),
  toggleParticipation: () => dispatch(filterActions.toggleParticipation()),
  setProcVisibleWithout: value => dispatch(filterActions.setProcVisibleWithout(value)),
  setProcOnlyVisibleWith: value => dispatch(filterActions.setProcOnlyVisibleWith(value)),
  setProcessMapping: value => dispatch(filterActions.setProcessMapping(value)),
  toggleLaneOrder: () => dispatch(filterActions.toggleLaneOrder()),
  toggleLaneWrap: () => dispatch(filterActions.toggleLaneWrap()),
  toggleSwimlanesMode: () => dispatch(filterActions.toggleSwimlanesMode())
});

export default connect(mapStateToProps, mapDispatchToProps)(Filtering);
