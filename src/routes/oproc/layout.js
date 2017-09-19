import { flatten, uniqStrings } from '../../lib/util';

export default function layout (nodeIds, vertices) {
  const steps = order(nodeIds, vertices);
  console.log('steps', steps);

  var positions = [];
  var x = 0;
  for (const step of steps) {
    var y = 0;
    for (const id of step) {
      positions.push({
        id,
        x,
        y: y - step.length / 2
      });
      y++;
    }
    x++;
  }
  return positions;
}

function order (nodeIds, vertices) {
  var steps = [];
  for (const nodeId of nodeIds) {
    // const i = Math.round(100 + 5 * vertices.distanceToStart(nodeId) - 3 * vertices.distanceToEnd(nodeId));
    const i = 1000 - vertices.distanceToEnd(nodeId);
    // const i = vertices.distanceToStart(nodeId);
    if (!steps[i]) steps[i] = [];
    steps[i].push(nodeId);
  }
  return steps
    .filter(step => !!step);
}
