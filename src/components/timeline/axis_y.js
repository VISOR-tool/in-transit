import { h, Component } from 'preact';

export default class Axis_Y extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { x, y, height, width } = this.props;
    const axisWidth = typeof width === 'number' ? width : 20;

    var attrs = {
      stroke: 'red',
      'stroke-width': 1,
      fill: 'white'
    };

    let axis = <rect id='yAXis' x={x} y={y} width={axisWidth} height={height} {...attrs} />;
    const { labelVisible } = true;
    return (
      axis
    );
  }
}
