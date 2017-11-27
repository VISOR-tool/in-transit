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
   const { beginning, end, steps, process, filter } = this.props;
   const yAxisWidth = 33;
   let swimlanes = process.process.stakeholder;
   let allProcesses = process.process.childs;
   let swimlaneheight = this.props.height / swimlanes.length;

   swimlanes.forEach( function(lane){ //fill swimlane with concernd processes
      lane.processes = allProcesses.filter( function(process){
        //skip processes before zoom time span
        //if(Date.parse(process.start) <= beginning) return false;
        //skip processes after zoom time span
        //if(Date.parse(process.end) >= end) return false;

        //Swimmlane & Prozesse = Partizipants
        //skip processes whithout this participants
        if(filter.processMapping == "Initiator")
          return process.initiator == lane.id;
        else return process.participants.indexOf(lane.id) > -1;
        });
      return lane;
      });
    let tlHeight = this.props.height; //swimlanes.length * swimlaneheight + 20;
    let tlWidth = window.innerWidth;
    let viewBox = "0 0 "+window.innerWidth+" "+tlHeight;

    if(filter.wrapEmptyLanes == 'on')
        swimlanes = swimlanes.filter((lane) => {
          return lane.processes.length  > 0
          })

    return (
      <svg  xmlns={NS_SVG} version='1.1' viewBox={viewBox}  preserveAspectRatio='xMidYMid slice' >
        <rect id="timeline_bg" x="0" y="0" width={tlWidth} height={tlHeight} style="fill:#95DAE7" />
        <g
          onMouseWheel={this.props.handleDragTimeline}
          onwheel={this.props.handleDragTimeline}
          onMouseDown={this.props.handleDragTimeline}
          onMouseUp={this.props.handleDragTimeline}
          onMouseMove={this.props.handleDragTimeline}
        >
        {
          swimlanes.map(
          (lane,index) => (
            <Swimlane id = {lane.id}
                      title = {lane.name}
                      x = {yAxisWidth}
                      y = {20 + (swimlaneheight * parseInt(index))}
                      width = {tlWidth-yAxisWidth}
                      height = {swimlaneheight}
                      beginning = {beginning}
                      end = {end}
                      processes = {lane.processes}
                      stakeholder = {process.process.stakeholder}
                      />
          ))
        }
        </g>
        <AxisY x="0" y="0" height={tlHeight} width={yAxisWidth} />
        <AxisX x={yAxisWidth} y="0" width={tlWidth-yAxisWidth}
                beginning={beginning} end={end}
                handleZoomTimeline ={this.props.handleZoomTimeline}
               />
      </svg>
    );
  }
}
