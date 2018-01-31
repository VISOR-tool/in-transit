import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import Process from './process';
import Links from './links';

class Swimlane extends Component {
  constructor () {
    super();
  }

  processWidth = 80;
  spacer = 5;
  stacking = { base:false, count: 0 };

  processPositionX = function(process, tlX, tlY, width){
    //from connections mimize staking.base
    if( process.connection.from.length > 1 ) {
      this.stacking.base =
        this.stacking.base - process.connection.from.length - 1;
    }

    //reset values on last from connection
    if(this.stacking.base < 1) {
        this.stacking.base = 1;
        this.stacking.count = 0;
    }
    //increase the staking.count for every child
    if(this.stacking.base > 1) this.stacking.count++;
    if(this.stacking.base == 1) this.stacking.count=0;

    if( process.connection.to.length > 1 ) {
      this.stacking.base += (process.connection.to.length - 1);
    }

    let startPx = this.props.width/(this.props.zoomEnd.valueOf()-this.props.zoomStart.valueOf())
                  *(Date.parse(process.start)-this.props.zoomStart.valueOf())
                  +tlX;

    let stacking = 0
    if(this.stacking.count > 1) stacking = this.stacking.count - 1;

    return {
      id: process.id,
      visible: startPx > width ? false : true,
      x: startPx,
      width: this.processWidth,
      stackingOrder: 1,
      };
    }

    getSimultaneousObjects (thisElement, allPositions){
      const thisStart = thisElement.x;
      const thisEnd = thisElement.x + thisElement.width;
      let simCounts = {all: 0, iterator: 0};
      allPositions.forEach( proc => {
        if( thisElement != proc &&            
            ! (proc.x < thisStart && proc.x + proc.width < thisStart
            || proc.x > thisEnd && proc.x + proc.width > thisEnd))
            {
              simCounts.all++;
              if(proc.y != undefined) simCounts.iterator++
            }
          });
        return simCounts;
    }

    processPositionY (thisElement, tlY, processPositions) {
      //find stackings and place the elements vertical
      if( ! thisElement.visible || thisElement.y != undefined ) return;
      let stackedObjectsCount = this.getSimultaneousObjects (thisElement, processPositions);
      thisElement.height = (this.props.height - this.spacer) / (stackedObjectsCount.all+1);
      thisElement.y = (thisElement.height * stackedObjectsCount.iterator) + tlY;
      if(thisElement.y == NaN)
        console.log(thisElement.y, thisElement.height, stackedObjectsCount);
      return thisElement;
  }

  render () {
    const { id, title, x, y, width, height, processes, stakeholder } = this.props;
    this.stacking.base = 1;
    this.stacking.count = 0;
    let processPositions = [];
    processPositions = processes.map(process => this.processPositionX( process, x, width));
    this.stacking.count = 1;
    processPositions.map( pos => pos = this.processPositionY( pos, y, processPositions ));

    var timelineAttrs = {
      stroke: '#16CEEA',
      'stroke-width': 1,
      fill: 'white'
    };
    const textAttrs = {
      'font-family': "Verdana",
      'font-size' : "0.8em"
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
              processPosition = {processPositions[index]}
              stakeholder = {stakeholder}
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

const mapStateToProps = ({ zoom }) => ({
  zoomStart: zoom.sectionStart,
  zoomEnd: zoom.sectionEnd,
});

export default connect(mapStateToProps)(Swimlane);