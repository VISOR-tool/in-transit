import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataLoad } from '../../lib/reducers/data';
import { filterActions } from '../../lib/reducers/filter';
import { dagesEdgeToSvgPath } from '../../lib/adapters';
import Node from './node';
import Path from './path';
import Legend from './legend';
import moment from 'moment';
import dagre from 'dagre';

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml'

const BACKGROUND_COLOR = "white";
const LANE_SIZE = 2;
const PARENT_SHAPE = "square";
const PARENT_SIZE = 12;
const PARENT_FILL = "yellow";
const PARENT_STROKE = "white";
const PARENT_LINK_COLOR = "yellow";
// const PARENT_LINK_WIDTH = 1;
const CHILD_SHAPE = "circle";
const CHILD_SIZE = 4;
const CHILD_OUTLINE_WIDTH = 3;
const CHILD_FILL= "#989899";
const CHILD_STROKE = "#989899";
const CHILD_LINK_COLOR = "gray";
const CHILD_LINK_WIDTH = 1;
// const PARTICIPATION_SHAPE = "circle";
// const PARTICIPATION_SIZE = 2;
const PARTICIPATION_FILL = "#FFB124";
const PARTICIPATION_STROKE = "#FFB124";
// const PARTICIPATION_LINK_COLOR = "red";
// const PARTICIPATION_LINK_WIDTH = 1;
const SELECTED_STROKE = "#ff6927";


class DagreAdapter{
  heigth = 0;
  width = 0;
  nodes = [];
  edges = [];
  connections = [];
  g = 'dagre graph';

  constructor( renderOptions ){
    this.g = new dagre.graphlib.Graph();
    this.g.setGraph( renderOptions );
    this.g.setDefaultEdgeLabel(function() { return {}; });
  }

  setConnections( node ){
    let newCon = false;
    node.connection.to.concat(node.connection.from).forEach( connection => {
      if(connection.length > 0){
        //sort both end points to make search for it a lot easier
        connection > node.id ? newCon = [connection, node.id] : newCon = [node.id, connection];
        if( this.connections.indexOf( element => element == newCon) === -1 )
            this.g.setEdge( newCon[0], newCon[1] );
      }
    });
  }

  createGraphLayoutFromOproc( oprocProcess, coloring, maxWidth, maxHeight, ){
    let g = this.g;
    oprocProcess.childs.forEach(child => {
      g.setNode(child.id, {
        label: moment(child.start).format('DD.MM.YYYY')+" "+child .name,
        id: child.id,
        width: CHILD_SIZE,
        height: CHILD_SIZE,
        ...coloring(child),
      });
    });
    oprocProcess.childs.forEach( child => this.setConnections(child));
    dagre.layout(g);
    /* beginning of an adaptiv size function on layout
    if( g.graph().height > maxHeight || g.graph().width > maxWidth){
      this.g.setGraph( {
        rankdir: "RL",
        align: "DR",
        nodesep: 10,
        edgesep: 15,
        ranksep: 20,
        marginx: 10,
        marginy: 10,} );
      dagre.layout(g);
    } */

    let nodes = [];
    g.nodes().forEach( function(v){
      if( g.node(v) != undefined ) nodes.push( g.node(v) )
    } );


    let edges = [];
    g.edges().forEach( function(e){
      if( g.edge(e) != undefined ) {
        edges.push({
          d: dagesEdgeToSvgPath( g.edge(e) ),
          stroke: CHILD_LINK_COLOR,
          width: CHILD_LINK_WIDTH
        });
      }
    });

    // draw most right nodes at first, for overlay behaviour
    nodes.sort( (a,b) => a.x < b.x );

    this.nodes = nodes;
    this.edges = edges;
    this.height = g.graph().height;
    this.width = g.graph().width;
  }
}

function RelationsGraph({
  data: process, filter, selected, width, height,
  toggleParticipation, toggleProcessOnlyWithResults, selectNone,
  }) {
  let nodes = [];
  let edges = [];

  const renderOptions = {
    ranker: "network-simplex", //network-simplex, tight-tree or longest-path
    rankdir: "RL",
    nodesep: 15,
    edgesep: 10,
    ranksep: 20,
    marginx: 10,
    marginy: 20,
  }


  const coloring = function(node) {
    let shape = CHILD_SHAPE;
    let size = CHILD_SIZE;
    let width = CHILD_OUTLINE_WIDTH;
    let fill = CHILD_FILL;
    let stroke = CHILD_STROKE;
    let edgeColor = CHILD_LINK_COLOR;

    if(node.participation.includes('open')){
      fill = PARTICIPATION_FILL;
      stroke = PARTICIPATION_STROKE;
    }
    if (node.id == selected) {
      stroke = SELECTED_STROKE;
    }
    if(node.childs.length > 0) {
      shape = PARENT_SHAPE;
      size = PARENT_SIZE;
      fill = PARENT_FILL;
      stroke = PARENT_STROKE;
    }

    if(node.childs.length > 0 ) edgeColor = PARENT_LINK_COLOR;
    if(node.connection.to.length > 0) edgeColor = CHILD_LINK_COLOR;

    return {
      size: size,
      width: width,
      shape: shape,
      stroke: stroke,
      fill: fill,
      edgeColor: edgeColor,
      };
  }

  let d = new DagreAdapter(renderOptions);
  d.createGraphLayoutFromOproc(process.process, coloring, width, height);
  nodes = d.nodes;
  edges = d.edges;
  height = d.height;
  //width = d.width; //let width on window size

  return (
    <div >
      <svg xmlns={NS_SVG} version='1.1' viewBox={[0, 0, width, 36].join(' ')} preserveAspectRatio='xMidYMid' style="cursor:default">
        <Legend x={0} y={0} width={width}/>
      </svg>
      <svg xmlns={NS_SVG} version='1.1' viewBox={[0, 0, width, height].join(' ')} preserveAspectRatio='xMidYMid slice' style="cursor:default">
        <g onmousedown={selectNone}>
          <rect id="graph_bg" x="0" y="0" width={width+"px"} height={height+"px"} fill={BACKGROUND_COLOR} />
          <text x="20" y="12" fill = "#555555" font-weight = "100" font-size = "12px"> Prozessübersicht </text>
          {edges.map( edge =>
            <path d={edge.d}
                  fill='none'
                  stroke="#000"
                  stroke-width={edge.width} />
          )}

          {nodes.map( node =>
            <Node id={node.id}
                  x={node.x} y={node.y} size={node.size}
                  shape={node.shape}
                  fill={node.fill}
                  stroke={node.stroke}
                  label={node.label}/>
          )}
        </g>
      </svg>
    </div>
  );
}


const mapStateToProps = ({ data, filteredData, filter, selection }) => ({
  dataUrl: data.wantedUrl,
  data: filteredData,
  filter,
  selected: selection.selected,
});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
  toggleParticipation: () => dispatch(filterActions.toggleParticipation()),
  selectNone: () => dispatch(selectionActions.select(null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RelationsGraph);
