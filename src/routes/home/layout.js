import { flatten, uniqStrings } from '../../lib/util';

export default function layout (nodeIds, vertices) {
  const steps = orderGrowing(nodeIds, vertices);

  var positions = [];
  var x = 0;
  for (const step of steps) {
    var y = 0;
    for (const id of step) {
      positions.push({
        id,
        x,
        y: y - step.length / 2,
      });
      y++;
    }
    x++;
  }
  return positions;
}

function orderGrowing (nodeIds, vertices) {
  var nodesByConnectivity = nodeIds.concat();
  nodesByConnectivity.sort((a, b) => {
    return (vertices.from(b).length + vertices.to(b).length) -
      (vertices.from(a).length + vertices.to(a).length);
  });
  if (nodesByConnectivity.length < 1) {
    return [];
  }
  var steps = [[nodesByConnectivity[0]]];
  var seen = {};
  // console.log('orderBackward', vertices.terminalNodes());

  // Backwards
  while (steps[0].length > 0) {
    console.log('backward', steps);
    const lastStep = steps[0];
    for (const step of lastStep) {
      seen[step] = true;
    }

    const nextStep = uniqStrings(flatten(
      lastStep
        .map(to => vertices.to(to))
    )).filter(from => !seen[from]);
    steps.unshift(nextStep);
  }
  steps.shift();  // Last is empty

  // Forwards
  while (steps[steps.length - 1].length > 0) {
    console.log('forward', steps);
    const lastStep = steps[steps.length - 1];
    for (const step of lastStep) {
      seen[step] = true;
    }
    const nextStep = uniqStrings(flatten(
      lastStep
        .map(from => vertices.from(from))
    )).filter(to => !seen[to]);
    steps.push(nextStep);
  }
  steps.pop();  // Last is empty

  console.log('seen', Object.keys(seen).length, 'steps', steps, 'from', vertices);
  return steps;
}
