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
    const d = [`M${mapPath(path[0])}`];
    for (const p of path.slice(1)) {
      d.push(`L${mapPath(p)}`);
    }

    return (
      <path d={d.join(' ')} fill='none'
        stroke={color} stroke-width={zoom * size} />
    );
  }
}
