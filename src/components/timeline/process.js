import { h, Component } from 'preact';

export default class Process extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { process, processPosition } = this.props;
    const procAttrs = {
      height: 40,
      width: 80,
      stroke: '#3784F8',
      'stroke-width': 1,
      fill: '#61D2E8'
    };
    const textAttrs = {
      'font-family': "Verdana",
      'font-size' : 10
    }
    const space = 5;

    //let obj = <rect id={process.id} x="100" y="30" width={processObjWidth} height={processObjHeight} {...attrs} />
    const { labelVisible } = true;
    return (
      <g>
        <rect id={process.id}
              x={processPosition.x}
              y={processPosition.y}
              {...procAttrs}
              />
        <text x={processPosition.x + space}
              y={processPosition.y+procAttrs.height - space}
              {...textAttrs}
              >
              process.title</text>
      </g>
    );
  }
}
