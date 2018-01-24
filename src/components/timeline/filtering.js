import { h } from 'preact';
import { connect } from 'preact-redux';
import Textsearch from '../../components/timeline/textsearch';
import Toplist from '../../components/timeline/toplist';
import Iconbar, { IconbarElement } from '../../components/timeline/iconbar';
import { filterActions } from '../../lib/reducers/filter';
import style from './filter';

const Filtering = ({
  data,
  filter,
  toggleProcessOnlyWithResults,
  toggleParticipation,
  setProcVisibleWithout,
  setProcOnlyVisibleWith,
  toggleProcessMapping,
  toggleLaneOrder,
  toggleLaneWrap,
}) => {
  const stakeholderOptions = [{ id: "", name: "…" }]
        .concat(data.process && data.process.stakeholder || [])
        .map(
          sh => <option value={sh.id}>{sh.name}</option>
        );

  return (
    <Iconbar>
      <IconbarElement icon={require('./icons/maintenance-icon.png')}>
        <dl class={style.filter}>
          <dd>onClick: markieren/<b>selektieren</b></dd>
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
      </IconbarElement>

      <IconbarElement icon={require('./icons/process-users-icon.png')}>
        <div class={style.textsearch}>
          <Textsearch
            process={data}
            handleOnClicks={this.objectSelectionManager} />
        </div>
      </IconbarElement>

      <IconbarElement icon={require('./icons/Adobe-PDF-Document-icon.png')}>
        <div class={style.toplist}>
          <Toplist
            handleOnClicks={this.objectSelectionManager}/>
        </div>
      </IconbarElement>
    </Iconbar>
  );
};

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
});

export default connect(mapStateToProps, mapDispatchToProps)(Filtering);
