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
      <rect id="legend" x={x} y={y} width={width+"px"} height="100px" style="fill:red" />
      <text x={x+20} y={y+20} {...attrsText}>Beteiligung: geschlosen:</text>
      <circle cx={x+200} cy="+15" r="5" stroke="black" stroke-width="4" fill="white" />
      <text x={x+240} y={y+20} {...attrsText}>offen:</text>
      <circle cx={x+300} cy="+15" r="5" stroke="green" stroke-width="4" fill="yellow" />
    </g>
    );
  }
}
