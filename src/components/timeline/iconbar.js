import { h } from 'preact';
import { connect } from 'preact-redux';
import style from './iconbar.css';
import { filterActions } from '../../lib/reducers/filter';

const Iconbar = ({
    filter,
    toggleVisibilityOfFilter,
    toggleVisibilityOfTextsearch,
    toggleVisibilityOfToplist,
    /*
    data,
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
        <div class={style.iconbarElement}>
            <img src={require('./icons/maintenance-icon.png')} 
                onmouseover={toggleVisibilityOfFilter} 
                onmouseout={toggleVisibilityOfFilter} 
                width="50" /></div>
        <div class={style.iconbarElement}>
            <img src={require('./icons/process-users-icon.png')} 
                onmouseover={toggleVisibilityOfTextsearch} 
                onmouseout={toggleVisibilityOfTextsearch} 
                width="50" /></div>
        <div class={style.iconbarElement}>
            <img src={require('./icons/Adobe-PDF-Document-icon.png')} 
                onmouseover={toggleVisibilityOfToplist} 
                onmouseout={toggleVisibilityOfToplist} 
                width="50" /></div>
    </div>
  );
};

const mapStateToProps = ({ filter }) => ({
  filter,
});
const mapDispatchToProps = dispatch => ({
    toggleVisibilityOfFilter: () =>  dispatch(filterActions.toggleVisibilityOfFilter()),
    toggleVisibilityOfTextsearch: () =>  dispatch(filterActions.toggleVisibilityOfTextsearch()),
    toggleVisibilityOfToplist: () =>  dispatch(filterActions.toggleVisibilityOfToplist()),
    //setProcVisibleWithout: value => dispatch(filterActions.setProcVisibleWithout(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Iconbar);
