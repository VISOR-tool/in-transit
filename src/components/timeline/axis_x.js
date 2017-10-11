import { h, Component } from 'preact';

export default class Axis_X extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const {  x, y, width, beginning, end, steps } = this.props;
    const labelRotation = typeof this.props.labelRotation === 'number' ? this.props.labelRotation : 90;
    const { zoom } = this.context;

    var attrs = {
      stroke: 'red',
      'stroke-width': 1,
      fill: 'white'
    };

    let axis = <rect x="0" y={y} width={width} height="20"  {...attrs} />
    const { labelVisible } = true;
    return (
      axis
    );
  }
}
