import { h, Component } from 'preact';

export default class Node extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { shape, label, x, y, size, color, stroke } = this.props;
    const labelRotation = typeof this.props.labelRotation === 'number' ? this.props.labelRotation : -13;

    var attrs = {
      stroke: stroke,
      'stroke-width': size,
      fill: color,
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
         ? <g>
           <rect  x={1.5 * size} y={size / 3 -6} height="8" width={(label.length+4) * 2.55} fill="green" opacity="0.8"/>
           <text  x={1.5 * size +5} y={size / 3}                   
                  text-anchor='start' 
                  font-size="0.5em"                   
                  fill="white"
                  >
           {label}
         </text>
         </g>
         }

        </g> : null}
      </g>
    );
  }
}
