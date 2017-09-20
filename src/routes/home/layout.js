import { flatten, uniqStrings } from '../../lib/util';

const LEARN_RATE_INIT = 1;
const LEARN_RATE_DEC = 0.0005;

export default function layout (nodeIds, vertices) {
  if (nodeIds.length < 1) {
    return [];
  }

  var nodes = nodeIds.map(nodeId => ({
    id: nodeId,
    x: 10 * Math.random() - 5,
    y: 10 * Math.random() - 5,
  }));

  for (let rate = LEARN_RATE_INIT; rate > 0; rate -= LEARN_RATE_DEC) {
    learn(nodes, vertices, rate);
  }
  snapToGrid(nodes);
  
  return nodes;
}

function learn(nodes, vertices, rate) {
  let minX = nodes[0].x;
  let maxX = minX;
  let minY = nodes[0].y;
  let maxY = minY;
  for(let i = 1; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.x < minX) minX = node.x;
    if (node.x > maxX) maxX = node.x;
    if (node.y < minY) minY = node.y;
    if (node.y > maxY) maxY = node.y;
  }

  minX = Math.min(-5, minX);
  maxX = Math.max(5, maxX);
  minY = Math.min(-5, minY);
  maxY = Math.max(5, maxY);
  const rx = ((maxX - minX) * Math.random()) + minX;
  const ry = ((maxY - minY) * Math.random()) + minY;
  let nearest = null;
  let minDist = null;
  for (const node of nodes) {
    var dist = Math.sqrt(
      Math.pow(node.x - rx, 2) + Math.pow(node.y - ry, 2)
    );
    if (minDist === null || dist < minDist) {
      minDist = dist;
      nearest = node;
    }
  }

  nearest.x += rate * (rx - nearest.x);
  nearest.y += rate * (ry - nearest.y);

  let neighborIds = {};
  for (const neighborId of vertices.from(nearest.id).concat(vertices.to(nearest.id))) {
    neighborIds[neighborId] = true;
  }
  console.log('nearest:', nearest.id, 'neighs:', Object.keys(neighborIds));
  for (let node of nodes) {
    if (neighborIds[node.id]) {
      node.x += 0.5 * rate * (rx - node.x);
      node.y += 0.5 * rate * (ry - node.y);
    }
  }
}

export function recenter (nodes) {
  if (nodes.length < 1) {
    return;
  }

  let cx = 0;
  let cy = 0;
  for (const node of nodes) {
    cx += node.x;
    cy += node.y;
  }
  cx /= nodes.length;
  cy /= nodes.length;

  // Reposition
  for (const node of nodes) {
    node.x -= cx;
    node.y -= cy;
  }
}

export function snapToGrid (nodes) {
  for (let node of nodes) {
    node.x = Math.round(node.x);
    node.y = Math.round(node.y);
  }
}

export function eliminateGap (nodes, dim) {
  let maxGap = null;
  let gap1;
  let gap2;
  const xs = nodes.map(node => node[dim])
        .sort((a, b) => a - b);
  let prevX = null;
  for (const x of xs) {
    if (prevX !== null) {
      const gap = x - prevX;
      if (gap > 1 && (maxGap === null || gap > maxGap)) {
        maxGap = gap;
        gap1 = prevX;
        gap2 = x;
      }
    }
    prevX = x;
  }

  if (maxGap === null) {
    console.log('No more gaps to remove');
    return;
  }
  console.log('max gap', maxGap, 'between', gap1, gap2);
  
  for (const node of nodes) {
    if (node[dim] >= gap2) {
      node[dim] -= gap2 - gap1 + 1;
    }
  }
}
