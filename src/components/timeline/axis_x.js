import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import style from './axis_x.css';

class Axis_X extends Component {
  render () {
    const { width, height, beginning, end, showAxisLabels, processName } = this.props;
    const beginningDate = new Date(beginning);
    const endDate = new Date(end);
    const space = 3;

    return showAxisLabels ?
      <ul class={style.axis} onWheel={this.props.onWheel}>
        <li>
          {beginningDate.getFullYear() + '.' + beginningDate.getMonth()}
        </li>
        <li class={style.title}>
          Prozess: {processName}
        </li>
        <li class={style.title}>
          Timeline
        </li>
        <li>
          {endDate.getFullYear() + '.' + endDate.getMonth()}
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
