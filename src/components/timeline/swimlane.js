import { h, Component } from 'preact';
import Process from './process';

export default class Swimlane extends Component {
  // constructor () {
  //   super();
  // }


  spacer = 5;
  stackingIterator = 1;
  processPosition = function(process, offset, tlX, tlY){
      let processMargin = 30;
      let processWidth = 80;

      if( process.connection.from.length > 1 ) {
        this.stackingIterator -= (process.connection.from.length - 1);
      }

      if(this.stackingIterator < 1) this.stackingIterator = 1;
      let height = (this.props.height - this.spacer) / this.stackingIterator;

      if( process.connection.to.length > 1 ) {
        this.stackingIterator += (process.connection.to.length - 1);
      }

      return {
        x: tlX + processMargin + (offset * (processWidth+processMargin)),
        y: tlY,
        height: height,
        };
  }

  render () {
    const { id, title, x, y, width, height, processes } = this.props;

    var timelineAttrs = {
      stroke: 'blue',
      'stroke-width': 1,
      fill: 'white'
    };
    const textAttrs = {
      'font-family': "Verdana",
      'font-size' : 10
    }
    let lane = <rect id={id}
                    x = {x}
                    y = {y}
                    width = {width}
                    height = {height}
                    {...timelineAttrs} />;
    let laneTitle = <text
                    x = {x}
                    y = {y + height - this.spacer}
                    {...textAttrs}
                    >
                    {title}</text>;
    let processObjs = processes.map( (process, index) =>
            <Process
              process={process}
              processPosition = {this.processPosition(process, index, x, y)}
            />
        );

    const { labelVisible } = true;
    return (
      <g>
        {lane}
        {laneTitle}
        {processObjs}
      </g>
    );
  }
}
