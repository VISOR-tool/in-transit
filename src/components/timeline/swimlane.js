import { h, Component } from 'preact';
import Process from './process';
import Links from './links';

export default class Swimlane extends Component {
  constructor () {
    super();
    this.state.tlMinimum = Date.parse("2012-03-01");
    this.state.tlMaximum = Date.parse("2016-01-31");
  }

  processMargin = 30;
  processWidth = 80;
  spacer = 5;
  stackingIterator = false;

  processPosition = function(process, tlX, tlY){
    if( process.connection.from.length > 1 ) {
      this.stackingIterator -= (process.connection.from.length - 1);
    }

    if(this.stackingIterator < 1) this.stackingIterator = 1;
    let height = (this.props.height - this.spacer) / this.stackingIterator;

    if( process.connection.to.length > 1 ) {
      this.stackingIterator += (process.connection.to.length - 1);
    }

    let startPx = this.props.width/(this.state.tlMaximum-this.state.tlMinimum)
                       *(Date.parse(process.start)-this.state.tlMinimum);

    //this.processWidth
    return {
      x: startPx,
      y: tlY,
      height: height,
      width: this.processWidth,
      };
  }

  processesVerticalLayout = function( processes ) {
  }

  render () {
    const { id, title, x, y, width, height, processes } = this.props;
    var processesVerticalLayout = this.processesVerticalLayout( processes );
    this.stackingIterator = 1;
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
              process = {process}
              processPosition = {this.processPosition(process, x, y)}
            />
        );
    //let startIndicator =  <line x1= y1= x2= y2=  {...attrs} />

    return (
      <g>
        {lane}
        {laneTitle}
        {processObjs}
        <Links processes={processObjs} />
      </g>
    );
  }
}
