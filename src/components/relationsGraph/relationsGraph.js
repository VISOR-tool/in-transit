import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataLoad } from '../../lib/reducers/data';
import { filterActions } from '../../lib/reducers/filter';
import Node from './node';
import Path from './path';
import Legend from './legend';
import moment from 'moment';

const LANE_SIZE = 2;
const LANE_SPACING = 2;

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml';

function RelationsGraph({ data: process,
                      filter, selected,
                      toggleParticipation,
                      toggleProcessOnlyWithResults,
                      width, height,
                    }) {
  let startX = 10, startY = 30;
  var nodes = [];
  var links = [];
  
  function createNodes(processes, process, x, y, filter){
    let size = 3;
    let stroke = "black";
    let color = "white";
    let shape = "circle";
    if(typeof process != 'object'){
      nodes.push(
        { id:process,
          x: x+40, y: y-10,
          size: 5,
          shape: shape,
          stroke: 2,
          color: "blue",
          label: "weitere",
        });   
      links.push({path:process, x1:x, y1:y, x2:x+40, y2:y-10, color:color });
    }else{
      if(process.participation.includes('open')){
        stroke = "green";
        color = "yellow";
      }
      if (process.id == selected) {
        stroke = "red";
      }
      if(process.childs.length > 0) {
        shape = "square";
        size = 5;
      }

      /*
      if childs -> rekursion
      if to -> rekursion
      */
      if(process.childs.length > 0 ) {
        process.childs.map(
          (nextChild,index) => {
              createNodes(processes, nextChild, x+40, y-10*index, filter, "white");
              links.push({path:process.id+nextChild.id, x1:x, y1:y, x2:x+40, y2:y-10*index, color:"yellow" });
          }
        )
      }
  
      if(process.connection.to.length > 0)
        process.connection.to.map(
          (nextProc,index) => {
            const nextObj = processes.find( nextTo => nextTo.id === nextProc );
            if(nextObj != undefined){
              createNodes(processes, nextObj, x+40, y+10*index, filter);
              links.push({path:process.id+nextObj.id, x1:x, y1:y, x2:x+40, y2:y+10*index, color:"gray" });
            }
          }
        );
    }

    // Seiteneffekte abfangen wenn childs childs haben
    // if( ((filter.processParticipation == 'offener') && process.participation.includes('open'))
    // || filter.processParticipation != 'offener' )
    nodes.push(
      { id:process.id,
        x: x, y: y,
        size: 3,
        shape: shape,
        stroke: stroke,
        color: color,
        label: moment(process.start).format('DD.MM.YYYY')+" "+process.name
      });      
  }

  /* prozesse zeichnen die keine eltern & kinder haben
     process.process.childs.map( orphan => {
     if(orphan.to.lenght == 0 && orphan.from.lenght == 0)
     this.createNodes(orphan, orphan, startX, startY, filter);
     }
     )
  */
  createNodes(process.process.childs, process.process.childs[0], startX, startY, filter);

  return(
    <div >
      <Graph nodes={nodes} lanes={links}
             height={height} width={width} />
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
          <rect id="graph_bg" x="0" y="0" width={width+"px"} height={height+"px"} style="fill:#1B0D78" />
          {lanes.map(link =>
            <Path id={link.path} path={link}
                  size={LANE_SIZE} color={link.color}
                  />)}

          {nodes.map( node =>
              <Node id={node.id}
              x={node.x} y={node.y} size={node.size}
              shape={node.shape}
              color={node.color}
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
