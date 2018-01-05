import { h, Component } from 'preact';
import Graph from '../../components/graph';

/// Renders <Graph/> from OProc data
export default ({ data }) => {
  console.log('data', data)
  var lanes = [];
  const nodes = [data].concat(data.childs).map(child => {
    if (child.parent) {
      lanes.push({
        id: child.id,
        nodes: [child.parent, child.id],
        color: 'black',
      });
    }
    return {
      id: child.id,
      x: Math.floor(10 * Math.random()),
      y: Math.floor(10 * Math.random()),
      size: 30,
      shape: 'circle',
      color: 'blue',
      title: child.name,
    };
  });
  
  return <Graph width={640} height={480}
    nodes={nodes} lanes={lanes} />;
};
