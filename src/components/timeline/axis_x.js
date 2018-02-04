import { h, Component } from 'preact';
import { connect } from 'preact-redux';

class Axis_X extends Component {

  render () {
    const { x, y, width, height, beginning, end, showAxisLabels, processName } = this.props;
    const beginningDate = new Date(beginning);
    const endDate = new Date(end);
    const space = 3;


    const attrsText = {
      stroke: '#9E49DE',
      'stroke-width': 0.3,
      fill: 'white'
    };
    const attrs = {
      stroke: 'red',
      'stroke-width': 1,
      fill: 'white'
    };

    return (
      <g
        onWheel={this.props.onWheel}
      >
      <rect
        id="xAXis"
        x={x}
        y={y}
        width={width}
        height={height}
        {...attrs}
        />
        { showAxisLabels ? <g>
          <text
              x = "200"
              y = {y + height-space}
              stroke = '#9E49DE'
              stroke-width = "0.3"
              fill = "Black"
              font-size = "2em"
              >
              {processName}
            </text>
            <text
              x = {x + space}
              y = {y + height-space}
              {...attrsText}
              >
              {beginningDate.getFullYear()+'.'+beginningDate.getMonth()}
            </text>
            <text
              x = {x + width-53-space}
              y = {y + height-space}
              {...attrsText}
              >
                {endDate.getFullYear()+'.'+endDate.getMonth()}
            </text>
        </g> : null}
      </g>
    );
  }
}

const mapStateToProps = ({ zoom }) => ({
  beginning: zoom.sectionStart,
  end: zoom.sectionEnd,
});

export default connect(mapStateToProps)(Axis_X);
