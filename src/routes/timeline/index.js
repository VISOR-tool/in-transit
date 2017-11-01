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
      oproc: {}
    });

    let oProc = new Oproc;
    //oProc.reload("oproc.json")
    oProc.reload("oproc-tiny-tree.json")
        .then( oproc => {
        //this.process = oProc.dumbLoad();
        this.setState({oproc: oproc});
    });
  }

  render() {

    if( this.state.oproc.process == undefined ) return "daten werden geladen";
    return (
      <Timeline
        width={this.props.width}
        height={this.props.height}
        beginning={this.props.beginning}
        end={this.props.end}
        steps={this.props.steps}
        process={this.state.oproc}
        />
    );
  }
}

export default class Home extends Component {
  render () {

    return (
      <div class={style.home}>
        <h1>Timeline</h1>
        <TimelineView width="600" height="1000" beginning="2016" end="2018" steps="5" />
      </div>
    );
  }
}
