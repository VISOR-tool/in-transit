import { h, Component } from 'preact';

export default class Path extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    var { path, size, color } = this.props;
    const { mapX, mapY, zoom } = this.context;

    function mapPath (p) {
      return `${mapX(p.x)},${mapY(p.y)}`;
    }
    var prevP = path[0];
    const lines = path.slice(1).map(p => {
      const line = `M${mapPath(prevP)} L${mapPath(p)}`;
      prevP = p;
      return line;
    });

    return (
      <g>
        {lines.map(line => (
          <path d={line} fill='none'
            stroke={color} stroke-width={zoom * size} />
        ))}
      </g>
    );
  }
}
