import { h, Component } from 'preact';
import Process from './process';

export default class Swimlane extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { id, x, y, width, height, processes } = this.props;

    var timelineAttrs = {
      stroke: 'blue',
      'stroke-width': 1,
      fill: 'white'
    };

    let lane = <rect id={"swimlane"+id} x={x} y={y} width={width} height={height} {...timelineAttrs} />;
    let obj = processes.map( process => <Process process={processes} processOriginX={x} processOriginY={y} /> );

    const { labelVisible } = true;
    return (
      <g>
        {lane}
        {obj}
      </g>
    );
  }
}
