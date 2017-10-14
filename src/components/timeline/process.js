import { h, Component } from 'preact';

export default class Process extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { process, processOriginX, processOriginY } = this.props;
    const procAttrs = {
      height: 40,
      width: 20,
      stroke: '#3784F8',
      'stroke-width': 1,
      fill: '#61D2E8'
    };
    const textAttrs = {
      'font-family': "Verdana",
      'font-size' : 10
    }

    //let obj = <rect id={process.id} x="100" y="30" width={processObjWidth} height={processObjHeight} {...attrs} />
    const { labelVisible } = true;
    return (
      <g>
        <rect id={process.id} x={processOriginX} y={processOriginY} {...procAttrs} />
        <text x={processOriginX+3} y={processOriginY+10} {...textAttrs} >process.title</text>
      </g>
    );
  }
}
