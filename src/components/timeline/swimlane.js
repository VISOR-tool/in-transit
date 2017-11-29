import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import Process from './process';
import Links from './links';

class Swimlane extends Component {
  constructor () {
    super();
  }

  processMargin = 30;
  processWidth = 80;
  spacer = 5;
  stacking = { base:false, count: 0 };

  processPosition = function(process, tlX, tlY){
    if( process.connection.from.length > 1 ) {
      this.stacking.base =
        this.stacking.base - process.connection.from.length - 1;
    }

    if(this.stacking.base < 1) {
        this.stacking.base = 1;
        this.stacking.count = 0;
    }
    if(this.stacking.base > 1) this.stacking.count++;
    if(this.stacking.base == 1) this.stacking.count=0;

    let height = (this.props.height - this.spacer) / this.stacking.base;
    if( process.connection.to.length > 1 ) {
      this.stacking.base += (process.connection.to.length - 1);
    }

    let startPx = this.props.width/(this.props.end-this.props.beginning)
                  *(Date.parse(process.start)-this.props.beginning)
                  +tlX;
    let stacking = 0
    if(this.stacking.count > 1) stacking = this.stacking.count - 1;

    return {
      x: startPx,
      y: tlY + (stacking * height),
      height: height,
      width: this.processWidth,
      };
  }

  render () {
    const { id, title, x, y, width, height, processes, beginning, end, stakeholder } = this.props;
    this.stacking.base = 1;
    var timelineAttrs = {
      stroke: '#16CEEA',
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
  beginning: zoom.sectionStart,
  end: zoom.sectionEnd,
});

export default connect(mapStateToProps)(Swimlane);
