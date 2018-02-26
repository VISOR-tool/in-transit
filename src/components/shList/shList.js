import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataLoad } from '../../lib/reducers/data';
import { selectionActions } from '../../lib/reducers/selection';
import style from './shList.css';

class ShList extends Component {

  render () {
    const { data: process, select, hover, unhover, filter } = this.props;
    

    return (
      <div class={style.shList}>
        <div><b>Akteure</b> </div>
        <ul>
        {
            process.process.stakeholder.map( sh => 
                <li onmouseenter={() => hover(sh.id)}
                    onmouseleave={() => unhover(sh.id)}
                > 
                    <div>{ sh.name }</div>
                </li>)
        }
        </ul>        
      </div>
    );
  }
}


const mapStateToProps = ({ data, filter }) => ({
  data: data.data,
  dataUrl: data.wantedUrl,
});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
  hover: value => dispatch(selectionActions.hover(value)),
  unhover: value => dispatch(selectionActions.unhover(value)),
  select: value => dispatch(selectionActions.select(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShList);
