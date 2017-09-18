import { h, Component } from 'preact';
import style from './style';
import Graph from '../../components/graph';
import Vertices from './vertices';
import layout from './layout';

const COLORS = ['red', 'blue', 'green', 'yellow', 'brown'];

var objectCache = {};

class PapersGraph extends Component {
  constructor () {
    super();

    this.setState({
      nodes: [],
      lanes: [],
    });
  }

  componentDidMount() {
    this.vertices = new Vertices;
    this._obtain(this.props.papers);
  }

  componentWillReceiveProps (nextProps) {
    this._obtain(nextProps.papers);
  }

  _obtain (papers) {
    return Promise.all(papers.map(
      id => this._fetchObject('paper', id)
    )).then(papers => {
      var meetingIds = {};
      var nodesById = {};
      var lanes = [];
      var i = 0;
      for (const paper of papers) {
        var lastId;
        var laneNodes = [];

        for (const consultation of (paper.consultation || [])) {
          // console.log('consultation', consultation);
          var id, title;
          if (consultation.meeting) {
            id = `meeting-${consultation.meeting}`;
            console.log('meeting id', id, 'from', consultation);
            meetingIds[consultation.meeting] = this._fetchObject('meeting', consultation.meeting);
          } else if (consultation.organization && consultation.organization.id) {
            id = `org-id-${consultation.organization.id}`;
            console.log('organization id', id, 'from', consultation.organization);
          } else if (consultation.organization && consultation.organization.name) {
            title = consultation.organization.name;
            id = `org-name-${consultation.organization.name}`;
            console.log('organization id', id, 'from', consultation.organization);
          } else {
            continue;
          }
          nodesById[id] = {
            name,
          };
          laneNodes.push(id);

          if (lastId) {
            this.vertices.set(lastId, id);
          }
          lastId = id;
        }

        if (laneNodes.length > 0) {
          console.log(laneNodes.length + ' lane nodes');
          lanes.push({
            title: paper.name,
            nodes: laneNodes,
            color: COLORS[i % COLORS.length],
          });
        }
        i++;
      }

      const nodes = layout(Object.keys(nodesById), this.vertices).map(node => ({
        ...node,
        ...nodesById[node.id],
      }));
      this.setState({ nodes, lanes });
    });
  }

  _fetchObject (index, id) {
    if (!objectCache.hasOwnProperty(index)) {
      objectCache[index] = {};
    }
    const indexCache = objectCache[index];

    if (indexCache.hasOwnProperty(id)) return;
    var promise = fetch(`https://ratsinfo.offenesdresden.de/api/oparl/${index}/${id}`)
      .then(res => res.json())
      .then(json => {
        indexCache[id] = json;
        return json;
      });
    indexCache[id] = promise;
    return promise;
  }

  render () {
    return (
      <Graph nodes={this.state.nodes} lanes={this.state.lanes}/>
    );
  }
}

export default class Home extends Component {
  render () {
    return (
      <div class={style.home}>
        <h1>Graph Engine</h1>
        <PapersGraph papers={[13658, 13511, 13502]}/>
      </div>
    );
  }
}
