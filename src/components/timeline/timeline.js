import { h, Component } from 'preact';
import { connect } from 'preact-redux';








import AxisX from './axis_x';
import AxisY from './axis_y';
import Swimlane from './swimlane';
import { zoomActions } from '../../lib/reducers/zoom';

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
    this.setState({ dragging: true });
  }

  onMouseUp = () => {
    this.setState({ dragging: false });
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

    if(filter.laneWrap)
        swimlanes = swimlanes.filter((lane) => {
          return lane.processes.length  > 0
          })

    const onWheel = this.onMouseWheel(this.props, tlWidth);
    return (
      <svg  xmlns={NS_SVG} version='1.1' viewBox={viewBox}  preserveAspectRatio='xMidYMid slice' >
        <rect id="timeline_bg" x="0" y="0" width={tlWidth} height={tlHeight} style="fill:#95DAE7" />
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
                      y = {20 + (swimlaneheight * parseInt(index))}
                      width = {tlWidth-yAxisWidth}
                      height = {swimlaneheight}
                      processes = {lane.processes}
                      stakeholder = {process.process.stakeholder}
                      />
          ))
        }
        </g>
        <AxisY x="0" y="0" height={tlHeight} width={yAxisWidth} />
        <AxisX x={yAxisWidth} y="0" width={tlWidth-yAxisWidth}
          onWheel={onWheel} showAxisLabels={true}
        />
      </svg>
    );
  }
}

const mapStateToProps = ({ zoom, filter }) => ({
  beginning: zoom.sectionStart,
  end: zoom.sectionEnd,
  filter,
});
const mapDispatchToProps = dispatch => ({
  setZoomSection: (begin, end) => dispatch(zoomActions.setZoomSection(begin, end)),
  setZoomBase: (begin, end) => dispatch(zoomActions.setZoomBase(begin, end)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
