import { h, Component } from 'preact';
import Process from './process';

export default class Swimlane extends Component {
  // constructor () {
  //   super();
  // }

  processPosition=function(process,offset,tlX, tlY){
      let processMargin = 30;
      let processWidth = 80;
      return {
        x: tlX + processMargin + (offset * (processWidth+processMargin)),
        y: tlY
        };
  }

  render () {
    const { id, x, y, width, height, processes } = this.props;

    var timelineAttrs = {
      stroke: 'blue',
      'stroke-width': 1,
      fill: 'white'
    };

    let lane = <rect id={"swimlane"+id} x={x} y={y} width={width} height={height} {...timelineAttrs} />;
    let processObjs = processes.map( (process, index) =>
            <Process
              process={process}
              processPosition = {this.processPosition(process, index, x, y)}
            />
        );

    const { labelVisible } = true;
    return (
      <g>
        {lane}
        {processObjs}
      </g>
    );
  }
}
