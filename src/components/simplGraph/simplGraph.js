import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataLoad } from '../../lib/reducers/data';
import { applyFilter, filterActions } from '../../lib/reducers/filter';
import Node from './node';
import Path from './path';
import Legend from './legend';

const LANE_SIZE = 2;
const LANE_SPACING = 2;

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml';

class SimplGraph extends Component {
  createNodes(processes, process, x, y, filter){
    let stroke = "black";
    let color = "white";
    if(process.participation.includes('open')){
      stroke = "green";
      color = "yellow";
    }     
    if( ((filter.processParticipation == 'offener') && process.participation.includes('open')) 
        || filter.processParticipation != 'offener' )
          this.nodes.push(
            { id:process.id, 
              x: x, y: y, 
              size: 3, 
              shape: "circle", 
              stroke: stroke, 
              color: color,
              label: process.start,
            });

    if(process.connection.to.length > 0)
      process.connection.to.map(
        (nextProc,index) => { 
          const nextObj = processes.find( child => child.id === nextProc );
          if( nextObj != undefined){
            this.createNodes(processes, nextObj, x+40, y+10*index, filter);            
            this.links.push({path:process.id+nextObj.id, x1:x, y1:y, x2:x+40, y2:y+10*index });
          }
        }
      );
  }
  

  render() {
    const { data: process,
            filter,
            toggleParticipation,
            toggleProcessOnlyWithResults,
          } = this.props;  
    let startX = 10, startY = 30;
    this.nodes = [];
    this.links = [];
    this.createNodes(process.process.childs, process.process.childs[0], startX, startY, filter);
    return(
      <div>                 
        Beteiligung: <b onClick={toggleParticipation}>{filter.processParticipation}</b> |
        | Nur mit Ergebnissen: <b onClick={toggleProcessOnlyWithResults}>{filter.processOnlyWithResults} </b>

      <Graph nodes={this.nodes} lanes={this.links} 
             height={this.props.height} width={this.props.width} />
      </div>
    );
  }
}

class Graph extends Component {
/*   
    constructor () {
    super();

    this.setState({
    });
  }
  onMouseDown = e => {
    if (e.button === 0) {
      //console.log('onMouseDown', e);
      this.setState({
      });
    }
  }
  */
  
  render () {
    const { nodes, lanes, 
            width, height,
          } = this.props;
    return (
      <div>
        <svg xmlns={NS_SVG} version='1.1' viewBox={[0, 0, width, 30].join(' ')} preserveAspectRatio='xMidYMid ' style="cursor:default">
          <Legend x="0" y="0" width={this.props.width}/>      
        </svg>
        <svg xmlns={NS_SVG} version='1.1' viewBox={[0, 0, width, height].join(' ')} preserveAspectRatio='xMidYMid slice' style="cursor:default">
          <g>                    
          <rect id="graph_bg" x="0" y="0" width={width+"px"} height={height+"px"} style="fill:#1B0D78" />
          {lanes.map(link =>
            <Path id={link.path} path={link} 
                  size={LANE_SIZE} color="white"
                  />)}

          {nodes.map( node => 
              <Node id={node.id}
              x={node.x} y={node.y} size={node.size}
              shape={node.shape}
              color={node.color}
              stroke={node.stroke} 
              label={node.label}/>
          )}
        );
          </g>
        </svg>
      </div>
    );
  }
}


const mapStateToProps = ({ data, filter }) => ({
  dataUrl: data.wantedUrl,
  data:    applyFilter(data.data, filter),
  filter,
});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
  toggleParticipation: () => dispatch(filterActions.toggleParticipation()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SimplGraph);
