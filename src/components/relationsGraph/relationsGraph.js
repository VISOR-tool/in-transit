import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataLoad } from '../../lib/reducers/data';
import { filterActions } from '../../lib/reducers/filter';
import Node from './node';
import Path from './path';
import Legend from './legend';
import moment from 'moment';

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
// const PARENT_LINK_STROKE = 1;
const CHILD_SHAPE = "circle";
const CHILD_SIZE = 2;
const CHILD_FILL= "white";
const CHILD_STROKE = "black";
const CHILD_LINK_COLOR = "gray";
// const CHILD_LINK_STROKE = 1;
// const PARTICIPATION_SHAPE = "circle";
// const PARTICIPATION_SIZE = 2;
const PARTICIPATION_FILL = "green";
const PARTICIPATION_STROKE = "green";
// const PARTICIPATION_LINK_COLOR = "red";
// const PARTICIPATION_LINK_STROKE = 1;
const SELECTED_STROKE = "blue";


function RelationsGraph({ 
  data: process, filter, selected, width, height,                    
  toggleParticipation, toggleProcessOnlyWithResults,
  }) {
  let startX = 10, startY = 30;
  let maxHeight = 0;
  var nodes = [];
  var links = [];
  
  function createNodesAndLinks(processes, process, x, y, filter){
    
    if(nodes.find( node => node.id === process.id )) return 'also known node';

    let shape = CHILD_SHAPE;
    let size = CHILD_SIZE;
    let fill = CHILD_FILL;
    let stroke = CHILD_STROKE;

    if(process.participation.includes('open')){
      fill = PARTICIPATION_FILL;
      stroke = PARTICIPATION_STROKE;
    }
    if (process.id == selected) {
      stroke = SELECTED_STROKE;
    }
    
    if(process.childs.length > 0) {
      shape = PARENT_SHAPE;
      size = PARENT_SIZE;
      fill = PARENT_FILL;
      stroke = PARENT_STROKE;
    }    

    if(process.childs.length > 0 ) {
      process.childs.map(
        (nextChild,index) => {
            if(nodes.find( node => node.id === nextChild.id )) return 'also known';
            createNodesAndLinks(processes, nextChild, x+40, y+10*index, filter);
            links.push({path:process.id+nextChild.id, x1:x, y1:y, x2:x+40, y2:y+10*index, color:PARENT_LINK_COLOR });
            
        }
      )
    }

    if(process.connection.to.length > 0)
      process.connection.to.map(
        (nextProc,index) => {
          const nextObj = processes.find( nextTo => nextTo.id === nextProc );
          if(nextObj != undefined ){
            createNodesAndLinks(processes, nextObj, x+40, y+10*index, filter);
            links.push({path:process.id+nextObj.id, x1:x, y1:y, x2:x+40, y2:y+10*index, color:CHILD_LINK_COLOR });
          }
        }
      );

    nodes.push(
      { id:process.id,
        x: x, y: y,
        size: size,
        shape: shape,
        stroke: stroke,
        fill: fill,
        label: moment(process.start).format('DD.MM.YYYY')+" "+process.name
      });     
      maxHeight = maxHeight > y ? maxHeight : y; 
  }

  /* prozesse zeichnen die keine eltern & kinder haben
     process.process.childs.map( orphan => {
     if(orphan.to.lenght == 0 && orphan.from.lenght == 0)
     this.createNodesAndLinks(orphan, orphan, startX, startY, filter);
     }
     )
  */
  createNodesAndLinks(process.process.childs, process.process, startX, startY, filter);

  return(
    <div >
      <Graph nodes={nodes} lanes={links}
             height={maxHeight+10} width={width} />
        Beteiligung: <b onClick={toggleParticipation}>{filter.processParticipation}</b> |
        | Nur mit Ergebnissen: <b onClick={toggleProcessOnlyWithResults}>{filter.processOnlyWithResults} </b>
    </div>
  );
}

function Graph({ nodes, lanes, width, height }) {
  return (
    <div>
      <svg xmlns={NS_SVG} version='1.1' viewBox={[0, 0, width, 15].join(' ')} preserveAspectRatio='xMidYMid ' style="cursor:default">
        <Legend x="0" y="0" width={width}/>
      </svg>
      <svg xmlns={NS_SVG} version='1.1' viewBox={[0, 0, width, height].join(' ')} preserveAspectRatio='xMidYMid slice' style="cursor:default">
        <g>
          <rect id="graph_bg" x="0" y="0" width={width+"px"} height={height+"px"} style={BACKGROUND_COLOR} />
          {lanes.map(link =>
            <Path id={link.path} path={link}
                  size={LANE_SIZE} color={link.color}
                  />)}

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
