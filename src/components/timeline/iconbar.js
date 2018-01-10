import { h } from 'preact';
import { connect } from 'preact-redux';
import style from './iconbar.css';

const Iconbar = ({
    /*
    data,
    filter,
    toggleProcessOnlyWithResults,
    toggleParticipation,
    setProcVisibleWithout,
    setProcOnlyVisibleWith,
    toggleProcessMapping,
    toggleLaneOrder,
    toggleLaneWrap,
    */
}) => {
  return (
    <div class={style.iconbar}>
        <div class={style.iconbarElement}><img src={require('./icons/maintenance-icon.png')} width="50" /></div>
        <div class={style.iconbarElement}><img src={require('./icons/process-users-icon.png')} width="50" /></div>
        <div class={style.iconbarElement}><img src={require('./icons/Adobe-PDF-Document-icon.png')} width="50" /></div>
    </div>
  );
};

const mapStateToProps = ({ filter }) => ({
  filter,
});
const mapDispatchToProps = dispatch => ({
  //setProcVisibleWithout: value => dispatch(filterActions.setProcVisibleWithout(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Iconbar);
