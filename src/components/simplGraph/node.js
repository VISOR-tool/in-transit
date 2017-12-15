import { h, Component } from 'preact';

export default class Node extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { shape, label, x, y, size, color } = this.props;
    const labelRotation = typeof this.props.labelRotation === 'number' ? this.props.labelRotation : 90;

    var attrs = {
      stroke: 'black',
      'stroke-width': size,
      fill: color || 'white',
      onmouseover: ev => this.setState({ labelVisible: true }),
      onmouseout: ev => this.setState({ labelVisible: false })
    };

    var shapeComponent;
    switch (shape) {
      case 'circle':
        shapeComponent = <circle cx={x} cy={y} r={size} {...attrs} />;
        break;
      case 'square':
        shapeComponent = <rect x={size} y={size} width={size} height={size} {...attrs} />;
        break;
      default:
        throw new Error('No Node shape!');
    }

    const { labelVisible } = this.state;
    return (
      <g>
        {shapeComponent}

        {labelVisible
        ? <g transform={'translate(' + x + ',' + y + ')'}>
          {(labelRotation <= 180)
         ? <text x={1.5 * size} y={size / 3} transform={'rotate(' + (labelRotation - 90) + ')'} text-anchor='start' font-size={Math.round(size / 2)}>
           {label}
         </text>
         : <text x={1.5 * size} y={size / 3} transform={'rotate(' + (labelRotation - 270) + ')'} text-anchor='end' font-size={Math.round(size)}>
           {label}
         </text>}

        </g> : null}
      </g>
    );
  }
}
