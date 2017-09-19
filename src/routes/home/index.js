import { h, Component } from 'preact';
import style from './style';
import Graph from '../../components/graph';
import Vertices from './vertices';
import layout, { snapToGrid } from './layout';
import * as Optimize from './optimize';
import { uniqStrings } from '../../lib/util';

const COLORS = ['red', 'blue', 'green', 'yellow', 'violet', 'orange', 'brown'];

var objectCache = {};
function fetchObject (index, id) {
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
      id => fetchObject('paper', id)
    )).then(papers => Promise.all(papers.map(
      paper => Promise.all((paper.consultation || []).map(
        consultation => {
          const organization = consultation.organization && consultation.organization.length == 1 && consultation.organization[0];
          if (consultation.meeting) {
            return fetchObject('meeting', consultation.meeting)
              .then(meeting => {
                // const organization = meeting.organization && meeting.organization[0];
                // if (organization) {
                //   return fetchObject('organization', organization)
                //     .then(organization => ({
                //       id: `org-${organization.id}`,
                //       title: organization.name,
                //       shape: 'circle',
                //     }));
                // } else {
                //   return {
                //     id: `meeting-${consultation.meeting}`,
                //     title: meeting.name,
                //     shape: 'circle',
                //   };
                // }
                  return {
                    id: `meeting-${consultation.meeting}`,
                    title: meeting.name,
                    shape: 'circle',
                  };
              });
          } else if (organization && organization.id) {
            return fetchObject('organization', organization.id)
              .then(organization => ({
                // id: `paper-${paper.id}-org-id-${organization.id}`,
                id: `org-id-${organization.id}`,
                title: organization.name,
                shape: 'square',
              }));
          } else if (organization && organization.name) {
            return {
              // id: `paper-${paper.id}-org-name-${organization.name}`,
              id: `org-name-${organization.name}`,
              title: organization.name,
              shape: 'square',
            };
          } else {
            console.log('stub consultation', consultation);
            return null;
          }
        }))
        .then(orgs => ({
          id: console.log('orgs', orgs) || paper.id,
          title: paper.name,
          orgs: orgs.filter(org => !!org)
        }))
    ))).then(papers => {
      var meetingIds = {};
      var nodesById = {};
      var lanes = [];
      var i = 0;
      for (const paper of papers) {
        var lastId;
        var laneNodes = [];

        for (const org of paper.orgs) {
          const { id } = org;
          nodesById[id] = org;
          if (laneNodes.indexOf(id) < 0) {
            laneNodes.push(id);
          }

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
        size: (node.shape === 'square' ? 20 : 24) + 2 * (this.vertices.from(node.id).length + this.vertices.from(node.id).length),
        ...nodesById[node.id],
      }));
      console.log(`${nodeIds.length} nodeIds layouted into ${nodes.length} nodes`);
      this.setState({ nodes, lanes }, () => {
        this.optimize();
      });
    });
  }

  optimize () {
    const { nodes, lanes } = this.state;
    const oldScore = Optimize.score(nodes, lanes);
    console.log('old score:', oldScore, 'nodes:', nodes);
    var bestGeneration;
    var bestScore = null;
    for (let i = 0; i < 20; i++) {
      const newGeneration = Optimize.mutate(nodes, 1 /*+ Math.floor(20 * Math.random())*/);
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
        nodes: bestGeneration,
      }, () => {
        requestAnimationFrame(() => this.optimize());
      });
    } else {
      console.log('skip score:', bestScore);
      setTimeout(() => this.optimize(), 500);
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
        // <PapersGraph papers={[13658, 13511, 13502]} />
        // <PapersGraph papers={[13055, 13374, 11573]} />
    return (
      <div class={style.home}>
        <h1>Graph Engine</h1>
        <PapersGraph papers={[13055, 13374, 11573, 13658, 13511, 13502]} />
      </div>
    );
  }
}
