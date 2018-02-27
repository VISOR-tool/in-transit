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
        <text x={x + 20} y={y + 12} font-weight="bold">Legende </text>
        <text x={x + 80} y={y + 12} {...attrsText}>Beteiligung geschlossen:</text>
        <text x={x + 240} y={y + 12} {...attrsText}>offen:</text>
        <text x={x + 420} y={y + 12} {...attrsText}>selektiert:</text>

        <circle cx={x + 223} cy='8' r='3' stroke='#989899' stroke-width='2' fill='#989899' />
        <circle cx={x + 280} cy='8' r='3' stroke='#FFB124' stroke-width='2' fill='#FFB124' />
        <circle cx={x + 480} cy='8' r='3' stroke='#ff6927' stroke-width='2' fill='white' />
      </g>
    );
  }
}
