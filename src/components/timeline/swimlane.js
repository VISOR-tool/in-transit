import { h, Component } from 'preact';

export default class Swimlane extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const {  x, y, width } = this.props;

    var attrs = {
      stroke: 'blue',
      'stroke-width': 1,
      fill: 'white'
    };

    let lane = <rect id="swimlane_0" x={x} y="0" width={width} height="20"  {...attrs} />

    const { labelVisible } = true;
    return (
      lane
    );
  }
}
