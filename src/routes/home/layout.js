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
        y: y - step.length / 2
      });
      y++;
    }
    x++;
  }
  return positions;
}

function orderForward (nodeIds, vertices) {
  var seen = {};
  var steps = [vertices.startNodes()];
  while (steps[steps.length - 1].length > 0) {
    const lastStep = steps[steps.length - 1];
    const nextStep = uniqStrings(flatten(
      lastStep
        .filter(from => {
          if (seen.hasOwnProperty(from)) {
            return false;
          } else {
            seen[from] = true;
            return true;
          }
        })
        .map(from => vertices.from(from))
    ));
    steps.push(nextStep);
  }
  steps.pop();  // Last is empty
  console.log('steps', steps, 'from', vertices);
  return steps;
}

function orderGrowing (nodeIds, vertices) {
  var nodesByConnectivity = nodeIds.concat();
  nodesByConnectivity.sort((a, b) => {
    return (vertices.from(b).length + vertices.to(b).length) -
      (vertices.from(a).length + vertices.to(a).length);
  });
  console.log({nodesByConnectivity});
  var steps = [[nodesByConnectivity[0]]];
  var seen = {};
  // console.log('orderBackward', vertices.terminalNodes());

  // Backwards
  while (steps[0].length > 0) {
    console.log('backward', steps);
    const lastStep = steps[0];
    const nextStep = uniqStrings(flatten(
      lastStep
        .filter(to => {
          if (seen.hasOwnProperty(to)) {
            return false;
          } else {
            seen[to] = true;
            return true;
          }
        })
        .map(to => vertices.to(to))
    ));
    steps.unshift(nextStep);
  }
  steps.shift();  // Last is empty

  // Forwards
  while (steps[steps.length - 1].length > 0) {
    console.log('forward', steps);
    const lastStep = steps[steps.length - 1];
    const nextStep = uniqStrings(flatten(
      lastStep
        .filter(from => {
          if (seen.hasOwnProperty(from)) {
            return false;
          } else {
            seen[from] = true;
            return true;
          }
        })
        .map(from => vertices.from(from))
    ));
    steps.push(nextStep);
  }
  steps.pop();  // Last is empty

  console.log('steps', steps, 'from', vertices);
  return steps;
}

function uniqStrings (array) {
  var seen = {};

  return array.filter(el => {
    if (seen.hasOwnProperty(el)) {
      return false;
    } else {
      seen[el] = true;
      return true;
    }
  });
}

function flatten (arrays) {
  return [].concat.apply([], arrays);
}
