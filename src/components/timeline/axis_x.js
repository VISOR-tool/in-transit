import { h, Component } from 'preact';
import { connect } from 'preact-redux';

class Axis_X extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { x, y, width, beginning, end, showAxisLabels } = this.props;
    const beginningDate = new Date(beginning);
    const endDate = new Date(end);
    const axisHeight = 20;
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
        height={axisHeight}
        {...attrs}
        />
        { showAxisLabels ? <g>
            <text
              x = {x + space}
              y = {y + axisHeight-space}
              {...attrsText}
              >
              {beginningDate.getFullYear()+'.'+beginningDate.getMonth()}
            </text>
            <text
              x = {x + width-53-space}
              y = {y + axisHeight-space}
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
