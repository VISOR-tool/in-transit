import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import AxisX from './axis_x';
import AxisY from './axis_y';
import Swimlane from './swimlane';
// deactive until finished // import Marker from './marker';
import { dataLoad } from '../../lib/reducers/data';
import { zoomActions } from '../../lib/reducers/zoom';
import { selectionActions } from '../../lib/reducers/selection';
import style from './timeline.css';
import swimlane from './swimlane';

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml';


class Timeline extends Component {
  constructor () {
    super();
    this.setState({
      dragging: false,
    });
  }

  componentDidMount() {
    let times = this.props.data.process.childs.map(child => child.start);
    times.sort((a,b) => Date.parse(a) - Date.parse(b));
    this.props.setZoomBase(times[0], times[times.length-1]);

    if (!this.resize) {
      this.resize = () => {
        const { beginning, end, setZoomSection } = this.props;
        setZoomSection(0, 0);
      };
      window.addEventListener('resize', this.resize)
    }
  }

  componentWillUnmount() {
    if (this.resize) {
      window.removeEventListener('resize', this.resize)
      this.resize = undefined;
    }
  }

  onMouseWheel = ({ beginning, end, setZoomSection }, tlWidth) => event => {
    event.preventDefault();

    let distance = event.deltaY * (end.getTime() - beginning.getTime()) / 1000;
    let a1 = event.offsetX / tlWidth;
    setZoomSection(- a1 * distance, (1 - a1) * distance);
  }

  onMouseMove = ({ beginning, end, setZoomSection }, tlWidth) => event => {
    if (!this.state.dragging) return;
    event.preventDefault();

    let distance = event.movementX / tlWidth * (beginning.getTime() - end.getTime());
    setZoomSection(distance, distance);
  }

  onMouseDown = () => {
    this.props.selectNone();
    this.setState({ dragging: true });
  }

  onMouseUp = () => {
    this.setState({ dragging: false });
  }

  fromStakeholder(){
    const { process, filter } = this.props;
    let swimlanes = process.process.stakeholder;
    let allProcesses = process.process.childs;
    swimlanes.forEach( function(lane){
      lane.processes = allProcesses.filter( function(process){
        if(filter.processMapping == "Initiator")
          return process.initiator == lane.id;
        else 
          return process.participants.indexOf(lane.id) > -1;
        });
      return lane;
    });
    return swimlanes;
  }
  
  fromResults(){
    const { process, filter } = this.props;
    let swimlanes = [];
    let counts = [];
    process.process.childs.forEach( process => {
      let index = swimlanes.findIndex( lane => {return lane.id == process.results.length} );
      if( index == -1 ){
        index = swimlanes.push({
          id: process.results.length, 
          name: 'Ergebnisanzahl: '+process.results.length, 
          processes: [],
        });
        index--;
      }
      swimlanes[index].processes.push(process);
    });    
    swimlanes.sort( (lane_a,lane_b) => lane_a.id > lane_b.id);
    return swimlanes;
  }
 
  fromParticipationCount(){
    const { process, filter } = this.props;
    let swimlanes = [];
    let counts = [];
    process.process.childs.forEach( process => {
      let index = swimlanes.findIndex( lane => {return lane.id == process.participants.length} );
      if( index == -1 ){
        index = swimlanes.push({
          id: process.participants.length, 
          name: 'Beteiligetenanzahl: '+process.participants.length, 
          processes: [],
        });
        index--;
      }
      swimlanes[index].processes.push(process);
    });    
    swimlanes.sort( (lane_a,lane_b) => lane_a.id > lane_b.id);
    return swimlanes;
  }


  render () {
    const { beginning, end, steps, process, filter } = this.props;
    const yAxisWidth = 33;
    const xAxisHeight = 20;
    let swimlanes = [];

    if(filter.swimlanesMode == 'off'){
      swimlanes = [{id: '', name: '', processes: process.process.childs}];
    }
    else{
      switch(filter.processMapping){
        case 'Initiator':
          swimlanes = this.fromStakeholder(); break;
        case 'Beteiligte':
          swimlanes = this.fromStakeholder(); break;
        case 'Resultateanzahl':
          swimlanes = this.fromResults(); break;
        case 'Beteiligtenanzahl':
          swimlanes = this.fromParticipationCount(); break;        
      }
    }   

    let swimlaneHeight = (this.props.height-xAxisHeight) / swimlanes.length;
    let tlHeight = this.props.height;
    let tlWidth = this.props.width;
    let viewBox = "0 0 "+window.innerWidth+" "+tlHeight;

    if(filter.laneWrap)
    swimlanes = swimlanes.filter((lane) => {
      return lane.processes.length  > 0
    })

    const onWheel = this.onMouseWheel(this.props, tlWidth);

    return (
      <div class={style.timeline}>
      <svg  xmlns={NS_SVG} version='1.1' viewBox={viewBox}  preserveAspectRatio='xMidYMid slice' >
        <rect id="timeline_bg" x="0" y="0" width={tlWidth} height={tlHeight} style="fill:#95DAE7" />
        <AxisX x={yAxisWidth} y="0" width={tlWidth-yAxisWidth} height={xAxisHeight}
              onWheel={onWheel} showAxisLabels={true}
              processName={process.process.name}
        />
        { /* deactive until finished <Marker x={yAxisWidth} y="0" height={xAxisHeight}/> */ }
        <g
          onMouseWheel={onWheel}
          onwheel={onWheel}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove(this.props, tlWidth).bind(this)}
        >
        {
          swimlanes.map(
          (lane,index) => (
            <Swimlane id = {lane.id}
                      title = {lane.name}
                      x = {yAxisWidth}
                      y = {20 + (swimlaneHeight * parseInt(index))}
                      width = {tlWidth-yAxisWidth}
                      height = {swimlaneHeight}
                      processes = {lane.processes}
                      stakeholder = {process.process.stakeholder}
                      />
          ))
        }
        </g>
        <AxisY x="0" y="0" height={tlHeight} width={yAxisWidth} />
      </svg>
      </div>
    );
  }
}

const mapStateToProps = ({ zoom, filter, data }) => ({
  beginning: zoom.sectionStart,
  end: zoom.sectionEnd,
  filter,
  data: data.data,
});
const mapDispatchToProps = dispatch => ({
  setZoomSection: (begin, end) => dispatch(zoomActions.setZoomSection(begin, end)),
  setZoomBase: (start, end) => dispatch(zoomActions.setZoomBase(start, end)),
  loadData: dataLoad(dispatch),
  selectNone: () => dispatch(selectionActions.select(null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
