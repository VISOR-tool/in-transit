import { h, Component } from 'preact';
import { connect } from 'preact-redux';

class Marker extends Component {
  
  render () {
    const { x, y, width, height } = this.props;    
    return (
      <g
        //onClick={console.log("Name des Prozesses")}
        //onHover={console.log("DetailViewöffnen")}
      >
      <rect
        id="process/id"
        x={x + 400}
        y={y}
        width="4"
        height="20"
        stroke="#9E49DE"
        stroke-width="0.3"
        fill="green"
        color="green"
        opacity="0.3"
        />        
      </g>
    );
  }
}

const mapStateToProps = ({ marker }) => ({
  marker: marker,
});

export default connect(mapStateToProps)(Marker);
