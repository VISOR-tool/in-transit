import { h, Component } from 'preact';

export default class Legend extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const {x,y,width} = this.props;
    const attrsText = "";
    return (
    <g>
      <rect id="legend" x={x} y={y} width={width+"px"} height="20px" style="fill:red" />
        <text x={x+20} y={y+12} {...attrsText}>Beteiligung: geschlossen:</text>
        <circle cx={x+155} cy="8" r="3" stroke="black" stroke-width="2" fill="white" />
        <text x={x+190} y={y+12} {...attrsText}>offen:</text>
        <circle cx={x+230} cy="8" r="3" stroke="green" stroke-width="2" fill="yellow" />
    </g>
    );
  }
}