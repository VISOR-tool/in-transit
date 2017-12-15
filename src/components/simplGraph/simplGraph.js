import { h, Component } from 'preact';
import Node from './node';
import Path from './path';

const LANE_SIZE = 6;
const LANE_SPACING = 2;

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml';

export default class SimplGraph extends Component {
  constructor () {
    super();

    this.setState({
      lanes : [],
      nodes : [{id: 1, x: 20, y: 30, size: 10, shape: "circle"},{id: 1, x: 60, y: 30, size: 8, shape: "circle"}],
    });
  }  

  render() {
    return(
      <Graph nodes={this.state.nodes} lanes={this.state.lanes} 
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
    console.log(nodes);
    return (
      <svg xmlns={NS_SVG} version='1.1' viewBox={[0, 0, width, height].join(' ')} preserveAspectRatio='xMidYMid slice' >
        <g>
        <rect id="graph_bg" x="0" y="0" width={width+"px"} height={height+"px"} style="fill:#1B0D78" />
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
