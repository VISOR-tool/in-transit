import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataLoad } from '../../lib/reducers/data';
import { filterActions } from '../../lib/reducers/filter';
import { toDagre } from '../../lib/adapters';
import Node from './node';
import Path from './path';
import Legend from './legend';
import moment from 'moment';
import dagre from 'dagre';


const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml'

const BACKGROUND_COLOR = {fill: "#1B0D78"};
const LANE_SIZE = 1;
const LANE_SPACING = 2;
const VERT_DISTANCE = 20;
const HORZ_DISTANCE = 20;
const PARENT_SHAPE = "square";
const PARENT_SIZE = 12;
const PARENT_FILL = "yellow";
const PARENT_STROKE = "white";
const PARENT_LINK_COLOR = "yellow"; 
// const PARENT_LINK_WIDTH = 1;
const CHILD_SHAPE = "circle";
const CHILD_SIZE = 2;
const CHILD_FILL= "white";
const CHILD_STROKE = "black";
const CHILD_LINK_COLOR = "gray";
const CHILD_LINK_WIDTH = 1;
// const PARTICIPATION_SHAPE = "circle";
// const PARTICIPATION_SIZE = 2;
const PARTICIPATION_FILL = "green";
const PARTICIPATION_STROKE = "green";
// const PARTICIPATION_LINK_COLOR = "red";
// const PARTICIPATION_LINK_WIDTH = 1;
const SELECTED_STROKE = "blue";


const dagesEdgeToSvgPath = function( edge ){
  //ausgabe werte = [{ x:21, y:12}, {x:231,y:213},{x:123,y:231}]
  //benötigt für svg: <path d='M x y L x y ...'
  const firstP = edge.points[0].x +" "+ edge.points[0].y;
  let followingP = "";
  edge.points.slice(1).map( 
    p => followingP = `${followingP} L ${p.x} ${p.y}` 
  );
  return `M ${firstP} ${followingP}`;  
}


class dagre_adapter{
  heigth = 0;
  width = 0;
  nodes = [];
  edges = [];
  g = 'dagre graph';

  constructor( renderOptions ){
    this.g = new dagre.graphlib.Graph();
    this.g.setGraph( renderOptions );
    this.g.setDefaultEdgeLabel(function() { return {}; });
    return this;
  }

  setConnections( node ){
    node.connection.from.forEach( link => this.g.setEdge( node.id, link ) );
    node.connection.to.forEach( link => this.g.setEdge( node.id, link ) );
  }

  createGraphLayoutFromOproc( oprocProcess ){
    let g = this.g;

    oprocProcess.childs.map( 
      child => {
        g.setNode(child.id, { 
          label: child.name, 
          id: child.id,
          width: CHILD_SIZE, 
          height: CHILD_SIZE, 
          size: CHILD_SIZE,
          shape: CHILD_SHAPE, 
          stroke: CHILD_STROKE
        } );
        //g.setEdge(child.id, child.connection.to[0]);
        //this.setConnections( child );
          }
    );
    
    g.setEdge(oprocProcess.childs[1].connection.from[0],  oprocProcess.childs[1].id);    
    this.setConnections(oprocProcess.childs[1]);

    dagre.layout(g);
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
    
    this.nodes = nodes;
    this.edges = edges;    
    this.height = g.graph().height;
    this.width = g.graph().width;
    
    console.log('dagre nodes: ', this.nodes.length, 'dagre edges: ', this.edges.length);
  }
}

function RelationsGraph({ 
  data: process, filter, selected, width, height,                    
  toggleParticipation, toggleProcessOnlyWithResults,
  }) {
  let nodes = [];
  let edges = [];

  const renderOptions ={ 
    rankdir: "RL",
    nodesep: 10, 
    edgesep: 15,
    marginx: 10,
    marginy: 10,
  }

  let d = new dagre_adapter(renderOptions);
  d.createGraphLayoutFromOproc(process.process);
  nodes = d.nodes;
  edges = d.edges;
  console.log('edges: ', edges);
  height = d.height;
  //width = d.width; //let it on window size
  
  return (
    <div>
      <svg xmlns={NS_SVG} version='1.1' viewBox={[0, 0, width, 15].join(' ')} preserveAspectRatio='xMidYMid ' style="cursor:default">
        <Legend x="0" y="0" width={width}/>
      </svg>
      <svg xmlns={NS_SVG} version='1.1' viewBox={[0, 0, width, height].join(' ')} preserveAspectRatio='xMidYMid slice' style="cursor:default">
        <g>
          <rect id="graph_bg" x="0" y="0" width={width+"px"} height={height+"px"} style={BACKGROUND_COLOR} />
          {edges.map( edge => 
            <path d={edge.d}
                  fill='none'
                  stroke={edge.stroke}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(RelationsGraph);