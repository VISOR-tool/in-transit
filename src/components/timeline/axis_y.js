import { h, Component } from 'preact';

export default class Axis_Y extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const {  x, y, height } = this.props;

    var attrs = {
      stroke: 'red',
      'stroke-width': 1,
      fill: 'white'
    };

    let axis = <rect x="0" y="0" width="20" height={height}  {...attrs} />
    const { labelVisible } = true;
    return (
      axis
    );
  }
}
