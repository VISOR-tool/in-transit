import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import style from './axis_x.css';
import moment from 'moment';

class Axis_X extends Component {
  render () {
    const { width, height, beginning, end, showAxisLabels, processName } = this.props;
    const space = 3;
    const MOMENT_FORMAT = 'DD.MM.Y';

    return showAxisLabels ?
      <ul class={style.axis} onWheel={this.props.onWheel}>
        <li>
          {moment(beginning).format(MOMENT_FORMAT)}
        </li>
        <li class={style.title}>
          Prozess: {processName}
        </li>
        <li class={style.title}>
          Timeline
        </li>
        <li>
          {moment(end).format(MOMENT_FORMAT)}
        </li>
      </ul> :
      null;
  }
}

const mapStateToProps = ({ zoom }) => ({
  beginning: zoom.sectionStart,
  end: zoom.sectionEnd
});

export default connect(mapStateToProps)(Axis_X);
