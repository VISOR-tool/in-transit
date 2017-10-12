import { h, Component } from 'preact';

export default class Swimlane extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { id, x, y, width, height } = this.props;

    var attrs = {
      stroke: 'blue',
      'stroke-width': 1,
      fill: 'white'
    };

    let lane = <rect id={"swimlane"+id} x={x} y={y} width={width} height={height} {...attrs} />

    const { labelVisible } = true;
    return (
      lane
    );
  }
}
