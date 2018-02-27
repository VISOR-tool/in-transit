import { h, Component } from 'preact';

function Item({x, y, stroke, fill, label}) {
  return <g>
    <circle cx={x} cy={y + 8} r={4} stroke={stroke} stroke-width={4 / 3} fill={fill}/>
    <text x={x + 8} y={y + 12}>{label}</text>
  </g>;
}

export default function Legend({x, y, width}) {
  return (
    <g>
      <text x={x + 20} y={y + 12} font-weight="bold">Legende</text>
      <Item x={x + 100} y={y} stroke='#989899' fill='#989899' label='Beteiligung geschlossen'/>
      <Item x={x + 250} y={y} stroke='#FFB124' fill='#FFB124' label='Beteiligung offen'/>
      <Item x={x + 400} y={y} stroke='#ff6927' fill='white' label='Selektierter Prozess'/>
    </g>
  );
}
