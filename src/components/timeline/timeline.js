import { h, Component } from 'preact';
import Oproc from '../oproc/oproc';
import AxisX from './axis_x';
import AxisY from './axis_y';
import Swimlane from './swimlane';

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml';

export default class Timeline extends Component {
  constructor () {
    super();

    this.setState({
      process: {}
    });

    let oProc = new Oproc;
    //this.state.process = oProc.reload("oproc.json");
    this.state.process = oProc.dumbLoad();
  }

  render () {
   //console.log('render props', this.props);
   const { width, height, beginning, end, steps } = this.props;
   const yAxisWidth = 33;
   var swimlaneHeight = 50;
   var swimlanes = [
       {id: 0},
       {id: 1},
       {id: 2},
       {id: 3},
      ];

    console.log(this.state.process);

    return (
      <svg xmlns={NS_SVG} version='1.1' viewBox='0 0 640 480' preserveAspectRatio='xMidYMid slice' >
        <rect id="timeline_bg" x="0" y="0" width={width} height={height} style="fill:#95DAE7" />

        <AxisY x="0" y="0" height={height} width={yAxisWidth} />
        <AxisX x="0" y={height} width={width} beginning={beginning} end={end} />

      {
        swimlanes.map(
        lane => (
          <Swimlane id={lane.id} x={yAxisWidth} y={swimlaneHeight * parseInt(lane.id)} width={width-yAxisWidth} height={swimlaneHeight}/>
        ))
      }

      </svg>
    );
  }
}
