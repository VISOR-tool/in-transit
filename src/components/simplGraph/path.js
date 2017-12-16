import { h, Component } from 'preact';

export default class Path extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    var { path, size, color } = this.props;
    const line = `M${path.x1},${path.y1} L${path.x2},${path.y2}`;

    return (
      <g>        
          <path d={line} fill='none'
            stroke={color} stroke-width={size} />
        
      </g>
    );
  }
}
