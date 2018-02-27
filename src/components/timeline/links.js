import { h, Component } from 'preact';

const dimmedLinks = '#DAC9CA';
const highlightedLinks = '#888888';

const Links = ({ processes, processPositions }) => {
  if (processes.length < 2) return false;

  let lines = [];
  processes.map((p1, i) => {
    if (p1.visible === true) {
      processes.map((p2, j) => {
        if (p2.visible === true &&
            p2.connection.from.includes(p1.id)) {
          const pos1 = processPositions[i];
          const pos2 = processPositions[j];
          lines.push({
            x1: pos1.x + pos1.width,
            y1: pos1.y + pos1.height / 2,
            x2: pos2.x,
            y2: pos2.y + pos2.height / 2,

            color: p1.subselected ? highlightedLinks : dimmedLinks,
            stroke: p1.subselected ? 3 : 1
          });
        }
      });
    }
  });

  let svgLines = lines.map(line => (
    <line x1={line.x1} y1={line.y1}
      x2={line.x2} y2={line.y2}
      stroke={line.color}
      stroke-width={line.stroke} />
  ));

  return (
    <g>
      {svgLines}
    </g>
  );
};

export default Links;
