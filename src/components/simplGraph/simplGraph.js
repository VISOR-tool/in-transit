import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataLoad } from '../../lib/reducers/data';
//import { applyFilter, filterActions } from '../../lib/reducers/filter';
import Node from './node';
import Path from './path';

const LANE_SIZE = 2;
const LANE_SPACING = 2;

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml';

class SimplGraph extends Component {
/* 
    constructor () {
    super();
  }
 */

  nodes = [];
  links = [];
  createNodes(processes, start, x, y){
    this.nodes.push({id:start.id, x: x, y: y, size: 3, shape: "circle"});
    if(start.connection.to.length > 0)
      start.connection.to.map(
        (nextProc,index) => { 
          const nextObj = processes.find( child => child.id === nextProc );
          if( nextObj != undefined){
            this.createNodes(processes, nextObj, x+40, y+10*index);
            this.links.push({path:start.id+nextObj.id, x1:x, y1:y, x2:x+40, y2:y+10*index });
          }
        }
      );
  }
  

  render() {
    const { data: process } = this.props;  
    let startX = 10, startY = 30;
    this.createNodes(process.process.childs, process.process.childs[0], startX, startY);
    return(
      <Graph nodes={this.nodes} lanes={this.links} 
             height={this.props.height} width={this.props.width} />
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
 */
  onMouseDown = e => {
    if (e.button === 0) {
      //console.log('onMouseDown', e);
      this.setState({
      });
    }
  }

  render () {
    const { nodes, lanes, width, height } = this.props;
    return (
      <svg xmlns={NS_SVG} version='1.1' viewBox={[0, 0, width, height].join(' ')} preserveAspectRatio='xMidYMid slice' >
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
              label={node.title || ''} labelRotation={0} />
        )}
      );
        </g>
      </svg>
    );
  }
}


const mapStateToProps = ({ data }) => ({
  data: data.data,
  dataUrl: data.wantedUrl,
});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SimplGraph);
