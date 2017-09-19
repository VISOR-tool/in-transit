export function score (nodes, lanes) {
  var sum = 0;

  var nodesById = {};
  var coordsUsed = {};
  for (const node of nodes) {
    nodesById[node.id] = node;

    // "Allocate" some space
    const coord = `${Math.floor(node.x / 2)},${Math.floor(node.y / 2)}`;
    if (coordsUsed[coord]) {
      sum += 1000;
    } else {
      coordsUsed[coord] = true;
    }
  }

  for (const lane of lanes) {
    let prevNodeId;
    for (const nodeId of lane.nodes) {
      if (prevNodeId) {
        const node = nodesById[nodeId];
        const prevNode = nodesById[prevNodeId];
        const x1 = Math.min(node.x, prevNode.x);
        const y1 = Math.min(node.y, prevNode.y);
        const x2 = Math.max(node.x, prevNode.x);
        const y2 = Math.max(node.y, prevNode.y);
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        // console.log({dx,dy});
        if (dy < 0.01) {
          // Straight lines
          const dist = dx + dy;
          if (dist < 2) {
            sum += 10;
          } else {
            sum += dist / 1000;
          }
        } else if (dx < 0.01) {
          // Straight lines
          const dist = dx + dy;
          if (dist < 2) {
            sum += 20;
          } else {
            sum += dist / 500;
          }
        } else if (Math.abs(dx - dy) < 0.01) {
          // 45° angle
          const dist = Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
          if (dist < 2) {
            sum += Math.pow((2 - dist), 2);
          } else {
            sum += Math.pow((dist - 2) / 10, 2);
          }
        } else {
          // Skewed line
          sum += (1 + dx) * (1 + dy);
        }

        for (const node of nodes) {
          const { x, y } = node;
          if (node.id !== nodeId &&
              node.id !== prevNodeId &&
              x1 - 0.5 > x && y1 - 0.5 > y &&
              x2 + 0.5 < x && y2 + 0.5 < y) {
            // Link occludes unrelated node
            sum += 300;
          }
        }
      }
      prevNodeId = nodeId;
    }
  }
  return 1000 / (1 + sum);
}

export function mutate (nodes, mutations) {
  var mutated = [].concat(nodes);
  for (let n = 0; n < mutations; n++) {
    var i = Math.floor(nodes.length * Math.random());
    var node = { ...nodes[i] };
    node.x += (Math.ceil(12 * Math.random()) - 6) / 2;
    node.y += (Math.ceil(12 * Math.random()) - 6) / 2;
    mutated = [].concat(
      mutated.slice(0, i),
      [node],
      mutated.slice(i + 1)
    );
  }
  return mutated;
}
