import { h, Component } from 'preact';
import style from './style';
import layout from './layout';
import Timeline from '../../components/timeline/timeline';
import Oproc from '../../components/oproc/oproc';
import { uniqStrings } from '../../lib/util';


class TimelineView extends Component {
  constructor () {
    super();

    this.setState({
    process: {}
    });
  }

  render() {
    let oProc = new Oproc;
    //this.state.process = oProc.reload("oproc.json");
    this.process = oProc.dumbLoad();


    return (
      <Timeline
        width={this.props.width}
        height={this.props.height}
        beginning={this.props.beginning}
        end={this.props.end}
        steps={this.props.steps}
        process={this.process}
        />
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
