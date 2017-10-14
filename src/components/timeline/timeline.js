import { h, Component } from 'preact';
import AxisX from './axis_x';
import AxisY from './axis_y';
import Swimlane from './swimlane';

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml';

export default class Timeline extends Component {
  constructor () {
    super();

    this.setState({
    });
  }


  /*
   * Auftrennung des Prozesses. Rein kommt das ganze Objekt
   * raus gehen verschiedene swimlanes die 1:n Ojekte enthalten
   */


  render () {
   //console.log('render props', this.props);
   const { width, height, beginning, end, steps, process } = this.props;
   const yAxisWidth = 33;
   var swimlaneHeight = 50;
   var swimlanes = [
       {id: 0},
       {id: 1},
       {id: 2},
       {id: 3},
      ];

    var processes = [
          { id : "proc1", title : "foobar" }
        ];


    return (
      <svg xmlns={NS_SVG} version='1.1' viewBox='0 0 640 480' preserveAspectRatio='xMidYMid slice' >
        <rect id="timeline_bg" x="0" y="0" width={width} height={height} style="fill:#95DAE7" />

        <AxisY x="0" y="0" height={height} width={yAxisWidth} />
        <AxisX x="0" y={height} width={width} beginning={beginning} end={end} />

      {
        swimlanes.map(
        lane => (
          <Swimlane id={lane.id}
                    x={yAxisWidth}
                    y={swimlaneHeight * parseInt(lane.id)}
                    width={width-yAxisWidth}
                    height={swimlaneHeight}
                    processes={processes}
                    />
        ))
      }

      </svg>
    );
  }
}
