import { h, Component } from 'preact';

export default class Legend extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const {x, y, width} = this.props;
    const attrsText = '';
    return (
      <g>
        <rect id='legend' x={x} y={y} width={width + 'px'} height='17px' stroke='black' stroke-width='1' fill='white' />
        <text x={x + 20} y={y + 12} {...attrsText}>Legende | Beteiligung geschlossen:</text>
        <text x={x + 240} y={y + 12} {...attrsText}>offen:</text>
        <text x={x + 320} y={y + 12} {...attrsText}>selektiert:</text>

        <circle cx={x + 223} cy='8' r='3' stroke='black' stroke-width='2' fill='white' />
        <circle cx={x + 280} cy='8' r='3' stroke='green' stroke-width='2' fill='green' />
        <circle cx={x + 380} cy='8' r='3' stroke='blue' stroke-width='2' fill='white' />
      </g>
    );
  }
}
