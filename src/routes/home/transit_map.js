import { h, Component } from 'preact';
import Graph from '../../components/graph';
import Vertices from './vertices';
import layout, { snapToGrid, eliminateGap, recenter } from './layout';
import * as Optimize from './optimize';
import { uniqStrings } from '../../lib/util';

/// Renders <Graph/> from OProc data
export default class TransitMap extends Component {
  constructor () {
    super();

    this.setState({
      nodes: [],
      lanes: [],
    });
  }

  componentDidMount () {
    this._recalculate(this.props.data);
  }

  componentWillReceiveProps (nextProps, nextState) {
    this._recalculate(nextProps);
  }

  _recalculate (data) {
    if (!data) {
      return;
    }

    var vertices = new Vertices();
    var lanes = [];
    var procsById = {};
    [data].concat(data.childs).forEach(proc => {
      if (proc.parent) {
        vertices.set(proc.id, proc.parent);
        lanes.push({
          id: proc.id,
          nodes: [proc.id, proc.parent],
          color: '#333',
        });
      }
      procsById[proc.id] = proc;
    });
    const nodes = layout(
      uniqStrings(Object.keys(procsById)),
      vertices
    ).map(node => ({
      ...node,
      size: 30,
      shape: 'circle',
      color: 'blue',
      title: procsById[node.id].name,
    }));

    this.setState(
      { nodes, lanes },
      () => this._optimize()
    );
  }

  _optimize () {
    const { nodes, lanes } = this.state;
    const oldScore = Optimize.score(nodes, lanes);
    console.log('old score:', oldScore, 'nodes:', nodes);
    var bestGeneration;
    var bestScore = null;
    for (let i = 0; i < 100; i++) {
      const newGeneration = Optimize.mutate(nodes, 1 + Math.floor(4 * Math.random()));
      snapToGrid(newGeneration);
      const newScore = Optimize.score(newGeneration, lanes);
      // console.log('new score:', newScore, 'gen:', newGeneration);
      if (bestScore === null || newScore > bestScore) {
        bestGeneration = newGeneration;
        bestScore = newScore;
      }
    }
    if (bestScore > oldScore) {
      console.log('best score:', bestScore);
      this.setState({
        nodes: bestGeneration
      }, () => {
        requestAnimationFrame(() => this._optimize());
      });
    } else {
      console.log('skip score:', bestScore);
      if (eliminateGap(nodes, 'x') || eliminateGap(nodes, 'y')) {
        console.log('eliminated gap');
        recenter(nodes);
        this.setState({
          nodes
        }, () => requestAnimationFrame(
          () => this._optimize()
        ));
      } else {
        requestAnimationFrame(() => this._optimize());
        // console.log("Finished optimizing");
      }
    }
  }

  render () {
    const { nodes, lanes } = this.state;
    return <Graph width={640} height={480}
      nodes={nodes} lanes={lanes} />;
  }
}
