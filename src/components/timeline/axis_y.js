import { h, Component } from 'preact';

export default class Axis_Y extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { x, y, height, width } = this.props;
    const axisWidth = typeof width === 'number' ? width : 20;

    var attrs = {
      fill: '#888888',
      'filter': 'url(#y-axis-shadow)'
    };

    const { labelVisible } = true;
    return (
      <g>
        <filter id="y-axis-shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
          <feFlood flood-color="rgba(0,0,0,0.5)"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <rect id='yAXis' x={x} y={y} width={axisWidth} height={height} {...attrs} />;
      </g>
    );
  }
}
