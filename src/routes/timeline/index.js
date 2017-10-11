import { h, Component } from 'preact';
import style from './style';
import layout from './layout';
import Timeline from '../../components/timeline';
import { uniqStrings } from '../../lib/util';


class TimelineView extends Component {
  constructor () {
    super();

    this.setState({
    });
  }

  render() {
    return (
      <Timeline width={this.props.width} height={this.props.height} beginning={this.props.beginning} end={this.props.end} steps={this.props.steps}/>
    );
  }
}

export default class Home extends Component {
  render () {
    return (
      <div class={style.home}>
        <h1>Timeline</h1>
        <TimelineView width="600" height="200" beginning="2016" end="2018" steps="5" />
      </div>
    );
  }
}
