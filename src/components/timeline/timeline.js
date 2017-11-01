import { h, Component } from 'preact';
import AxisX from './axis_x';
import AxisY from './axis_y';
import Swimlane from './swimlane';

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml';

export default class Timeline extends Component {
  constructor () {
    super();
    this.setState({  });
  }

  /*
   * Auftrennung des Prozesses. Rein kommt das ganze Objekt
   * raus gehen verschiedene swimlanes die 1:n Ojekte enthalten
   */

  render () {
   const { width, height, beginning, end, steps, process } = this.props;
   const yAxisWidth = 33;
   let swimlaneheight = 50;
   let swimlanes = process.process.stakeholder;
   let allProcesses = process.process.childs;

   swimlanes.forEach( function(lane){ //fill swimlane with concernd processes
      lane.processes = allProcesses.filter( function(process){
        return process.participants.indexOf(lane.id) > -1;
        });
      return lane;
      });

    return (
      <svg xmlns={NS_SVG} version='1.1' viewBox='0 0 640 480' preserveAspectRatio='xMidYMid slice' >
        <rect id="timeline_bg" x="0" y="0" width={width} height={height} style="fill:#95DAE7" />

        <AxisY x="0" y="0" height={height} width={yAxisWidth} />
        <AxisX x="0" y="0" width={width} beginning={beginning} end={end} />

      {
        swimlanes.map(
        (lane,index) => (
          <Swimlane id = {lane.id}
                    title = {lane.name}
                    x = {yAxisWidth}
                    y = {20 + (swimlaneheight * parseInt(index))}
                    width = {width-yAxisWidth}
                    height = {swimlaneheight}
                    processes = {lane.processes}
                    />
        ))
      }

      </svg>
    );
  }
}
