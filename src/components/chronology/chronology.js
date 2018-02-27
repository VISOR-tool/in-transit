import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataLoad } from '../../lib/reducers/data';
import { selectionActions } from '../../lib/reducers/selection';
import moment from 'moment';
import style from './chronology.css';

const MOMENT_FORMAT = 'DD.MM.Y';

class Chronology extends Component {
  render () {
    const { data: process, select, hover, unhover, filter } = this.props;

    return (
      <div class={style.chronology}>
        <div><b>Prozess: {process.process.name}</b> ({process.process.childs.length} Subprozesse) </div>
        <div>{moment(process.process.start).format(MOMENT_FORMAT)} - {moment(process.process.end).format(MOMENT_FORMAT)}</div>
        <ul>
          {
            process.process.childs.map(child =>
              <li onmouseenter={() => hover(child.id)}
                onmouseleave={() => unhover(child.id)}
                onmousedown={ev => {
                  ev.cancelBubble = true;
                  select(id);
                }}
                class={child.participation.includes('open') ? style.openParticipation : null}
              >
                <b>{ moment(child.start).format(MOMENT_FORMAT) }</b>
                <div>{ child.name }</div>
              </li>)
          }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = ({ data, filter }) => ({
  data: data.data,
  dataUrl: data.wantedUrl
  // selected
});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
  hover: value => dispatch(selectionActions.hover(value)),
  unhover: value => dispatch(selectionActions.unhover(value)),
  select: value => dispatch(selectionActions.select(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chronology);
