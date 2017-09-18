import { h, Component } from 'preact';
import style from './style';
import Graph from '../../components/graph';
import Vertices from './vertices';
import layout from './layout';
import { uniqStrings } from '../../lib/util';

const COLORS = ['red', 'blue', 'green', 'yellow', 'brown'];

var objectCache = {};

class PapersGraph extends Component {
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

  _obtain (papers) {
    return Promise.all(papers.map(
      id => this._fetchObject('paper', id)
    )).then(papers => Promise.all(papers.map(
      paper => Promise.all((paper.consultation || []).map(
        consultation => {
          const organization = consultation.organization && consultation.organization.length == 1 && consultation.organization[0];
          if (consultation.meeting) {
            return this._fetchObject('meeting', consultation.meeting)
              .then(meeting => ({
                id: `meeting-${consultation.meeting}`,
                title: meeting.name
              }));
          } else if (organization && organization.id) {
            return this._fetchObject('organization', organization.id)
              .then(organization => ({
                id: `paper-${paper.id}-org-id-${organization.id}`,
                // id: `org-id-${organization.id}`,
                title: organization.name
              }));
          } else if (organization && organization.name) {
            return {
              id: `paper-${paper.id}-org-name-${organization.name}`,
              // id: `org-name-${organization.name}`,
              title: organization.name
            };
          } else {
            console.log('stub consultation', consultation);
            return null;
          }
        }))
        .then(consultations => ({
          id: paper.id,
          title: paper.name,
          consultations: consultations.filter(consultation => !!consultation)
        }))
    ))).then(papers => {
      var meetingIds = {};
      var nodesById = {};
      var lanes = [];
      var i = 0;
      for (const paper of papers) {
        var lastId;
        var laneNodes = [];

        for (const consultation of (paper.consultations || [])) {
          const { id, title } = consultation;
          nodesById[id] = {
            title
          };
          laneNodes.push(id);

          if (lastId) {
            this.vertices.set(lastId, id);
          }
          lastId = id;
        }

        if (laneNodes.length > 0) {
          lanes.push({
            id: paper.id,
            title: paper.title,
            nodes: laneNodes,
            color: COLORS[i % COLORS.length]
          });
        }
        i++;
      }

      const nodeIds = uniqStrings(Object.keys(nodesById));
      const nodes = layout(nodeIds, this.vertices).map(node => ({
        ...node,
        ...nodesById[node.id]
      }));
      console.log(`${nodeIds.length} nodeIds layouted into ${nodes.length} nodes`);
      this.setState({ nodes, lanes });
    });
  }

  _fetchObject (index, id) {
    if (!objectCache.hasOwnProperty(index)) {
      objectCache[index] = {};
    }
    const indexCache = objectCache[index];

    if (indexCache.hasOwnProperty(id)) return indexCache[id];
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
      <Graph nodes={this.state.nodes} lanes={this.state.lanes} />
    );
  }
}

export default class Home extends Component {
  render () {
        // <PapersGraph papers={[13055, 13374, 11573]} />
    return (
      <div class={style.home}>
        <h1>Graph Engine</h1>
        <PapersGraph papers={[13658, 13511, 13502]} />
      </div>
    );
  }
}
