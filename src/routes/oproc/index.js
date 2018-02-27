import { h, Component } from 'preact';
import style from './style';
import Graph from '../../components/graph';
import Vertices from './vertices';
import layout from './layout';
import * as Optimize from './optimize';
import { uniqStrings } from '../../lib/util';

const COLORS = ['red', 'blue', 'green', 'yellow', 'brown'];
const gen_cycles = 1000; // genetic optimize cycles. default=1000;

var objectCache = {};

function fetchObject (index, id) {
  if (!objectCache.hasOwnProperty(index)) {
    objectCache[index] = {};
  }
  /** ist der Teil um alle Properties nur einmal zu haben?
  else return false;
  */
  const indexCache = objectCache[index];

  if (indexCache.hasOwnProperty(id)) return indexCache[id];
  var promise = fetch(id)
    .then(res => res.json())
    .then(json => {
      indexCache[id] = json;
      return json;
    });
  indexCache[id] = promise;

  return promise;
}

class OprocGraph extends Component {
  constructor () {
    super();

    this.setState({
      nodes: [],
      lanes: []
    });
  }

  componentDidMount () {
    this.vertices = new Vertices();
    this._obtain(this.props.papers);
  }

  componentWillReceiveProps (nextProps) {
    this._obtain(nextProps.papers);
  }

  async download (paper) {
    const response = await fetch(paper);
    const parsedResponse = await response.json();
    return parsedResponse;
  }

  subProcesses (oproc) {
    return oproc.process.childs;
  }

  toNodes (childs) {
    // let nodes = childs.map( child => ({id:child.id, to: child.to, from: child.connection.from[0], shape:"circle", size:28, title:child.name, x:1, y:1,}) );
    let nodes = childs.map(function (child) {
      let node = {id: child.id, to: child.connection.to[0], from: child.connection.from[0], shape: 'square', size: 2, title: child.name, x: 0, y: 0};

      if (child.parent != undefined) {
        node.size = 40;
      }

      if (child.connection.from[0] == undefined || child.connection.to[0] == undefined) {
        node.size = 50;
      }
      return node;
    });
    console.error(nodes);
    return nodes;
  }

  arrangeVerticalChilds (nodes) {
    let margin_x_step = 1;
    let margin_x = 0;
    let margin_y_step = 1;
    let margin_y = 0;
    let new_nodes = nodes.map(function (child) {
      // hier weiter machen.
      // From und To sollte getrennt behandet werden

      if (child.from == undefined || child.to == undefined) {
        margin_y += margin_y_step;
        child.y = margin_y;
        return child;
      }
      margin_x += margin_x_step;
      margin_y += margin_y_step;
      child.x = margin_x;
      child.y = margin_y;
      return child;
    });
    return new_nodes;
  }

  lanesBetween (nodes) {
    let lanes = [
      // { color:"red", id:"13658", nodes: ["test-a", "test-b"] },
      // { color:"blue", id:"9", nodes: ["test-b", "test-c"] },
      // { color:"green", id:"66", nodes: ["test-a", "test-d"] },
    ];

    nodes.forEach(function (node) {
      if (node.from != undefined) { lanes.push({ color: 'blue', id: '1', nodes: [node.from, node.id] }); }
    });

    return {nodes: nodes, lanes: lanes};
  }

  intoStates (nodes, lanes) {
    console.log(`${nodes.length} nodeIds layouted into ${nodes.length} nodes`);
    this.setState({ nodes, lanes }, () => {
      // this.optimize();
    });
  }

  _obtain (papers) {
    let nodes = [];
    let lanes = [];
    let processes = [];
    let processIterator = 0;

    // papers.map(oprocJson => fetch(oprocJson).then(res => res.json()).then(json => { resolve( json.process ) }))
    this.download(papers[0])
      .then(oproc => this.subProcesses(oproc))
      .then(childs => this.toNodes(childs))
      .then(nodes => this.arrangeVerticalChilds(nodes))
      .then(nodes => this.lanesBetween(nodes))
      .then(nodesAndLanes => this.intoStates(nodesAndLanes.nodes, nodesAndLanes.lanes));
  }

  optimize () {
    const { nodes, lanes } = this.state;
    const oldScore = Optimize.score(nodes, lanes);
    console.log('old score:', oldScore, 'nodes:', nodes);
    var bestGeneration;
    var bestScore = null;
    for (let i = 0; i < 400; i++) {
      const newGeneration = Optimize.mutate(nodes, 1 /* + Math.floor(4 * Math.random()) */);
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
        requestAnimationFrame(() => this.optimize());
      });
    } else {
      console.log('skip score:', bestScore);
      if (eliminateGap(nodes, Math.random() < 0.5 ? 'x' : 'y')) {
        recenter(nodes);
        this.setState({
          nodes
        }, () => requestAnimationFrame(
          () => this.optimize()
        ));
      } else {
        // console.log("Finished optimizing");
        requestAnimationFrame(() => this.optimize());
      }
    }
  }

  render () {
    return (
      <Graph nodes={this.state.nodes} lanes={this.state.lanes} />
    );
  }
}

export default class Home extends Component {
  render () {
    return (
      <div class={style.home}>
        <h1>Graph Engine</h1>
        <OprocGraph papers={['oproc-tree.json', 'oproc.json']} />
      </div>
    );
  }
}
