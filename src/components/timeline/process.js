import { h, Component } from 'preact';

export default class Process extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { process, processPosition } = this.props;
    const procAttrs = {
      width: 80,
      stroke: '#3784F8',
      'stroke-width': 1,
      fill: '#61D2E8'
    };
    const textAttrs = {
      'font-family': "Verdana",
      'font-size' : 10
    }
    const spacer = 5;
    return (
      <g>
        <rect id={process.id}
              x={processPosition.x}
              y={processPosition.y}
              height={processPosition.height}
              {...procAttrs}
              />
        <text x={processPosition.x + spacer}
              y={processPosition.y + spacer+ spacer}
              {...textAttrs}
              >
              {process.id.substr(25)}</text>
      </g>
    );
  }
}
