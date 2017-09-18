import { h, Component } from 'preact';

export default class Node extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { shape, label, x, y, size, color } = this.props;
    const labelRotation = this.props.labelRotation || 90;
    const { mapX, mapY, zoom } = this.context;

    var attrs = {
      stroke: 'black',
      'stroke-width': zoom * Math.round(size / 10),
      fill: color || 'white'
    };

    var shapeComponent;
    switch (shape) {
      case 'circle':
        shapeComponent = <circle cx={mapX(x)} cy={mapY(y)} r={zoom * size / 2} {...attrs} />;
        break;
      case 'square':
        shapeComponent = <rect x={mapX(x - size / 2)} y={mapY(y - size / 2)}
          width={zoom * size} height={zoom * size} {...attrs} />;
        break;
      default:
        throw new Error('No Node shape!');
    }

    return (
      <g>
        {shapeComponent}

        <g transform={'translate(' + mapX(x) + ',' + mapY(y) + ')'}>
        {(labelRotation <= 180) ?
         <text x={zoom * 1.5 * size / 2} y={zoom * size / 6} transform={'rotate(' + (labelRotation - 90) + ')'} text-anchor='start' font-size={Math.round(zoom * size / 2)}>
            {label}
         </text> :
         <text x={- zoom * 1.5 * size / 2} y={zoom * size / 6} transform={'rotate(' + (labelRotation - 270) + ')'} text-anchor='end' font-size={Math.round(zoom * size / 2)}>
            {label}
         </text>}
         
        </g>
      </g>
    );
  }
}
