import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import Process from './process';
import Links from './links';
import { selectionActions } from '../../lib/reducers/selection';

const PROCESS_MIN_WIDTH = 80;
const PROCESS_SPACING = 5;
const PROCESS_HEIGHT = 40;

class Swimlane extends Component {
  markNodes( startNode, processes ){
    processes.map( process => {
      if(process.id === startNode) {
        process.subselected = true;
        if(process.connection.to.length > 0)
        process.connection.to.map( nextNode => this.markNodes(nextNode, processes) )
      }
    });
  }

  
  resetSubselection( processes ){
    processes.map( process => {
        process.subselected = false;        
    });
  }

  assignSubselectionToAffectedObjects( processes ){
    this.resetSubselection( processes );    
    if(this.props.selected === null) return processes;

    this.markNodes(
      this.props.selected,
      processes,
    )
    return processes;
  }

  render () {
    const { id, title, x, y, width, height, stakeholder, zoomStart, zoomEnd } = this.props;
    // Clone
    let processes = this.props.processes.concat();

    let timelineAttrs = {
      stroke: '#16CEEA',
      'stroke-width': 1,
      fill: 'white'
    };

    const textAttrs = {
      'font-family': 'Verdana',
      'font-size': '0.8em'
    };

    function timeToX(time) {
      if (typeof time == 'string') {
        time = Date.parse(time);
      }
      if (time.getTime) {
        time = time.getTime();
      }
      if (typeof time != 'number') {
        throw new Error('Cannot calculate with time');
      }
      return width / (zoomEnd - zoomStart) * (time - zoomStart);
    }

    // Sorting isn't needed actually
    processes.sort((p1, p2) => {
      if (p1.start != p2.start) {
        return Date.parse(p1.start) - Date.parse(p2.start);
      } else {
        return Date.parse(p1.end) - Date.parse(p2.end);
      }
    });

    // Construct basic positions
    let processPositions = processes.map(process => {
      const x = timeToX(process.start);
      const width = Math.max(
        PROCESS_MIN_WIDTH,
        process.end ? timeToX(process.end) - x : PROCESS_MIN_WIDTH
      );
      const height = PROCESS_HEIGHT;
      return { x, y, width, height };
    });
    // Align without overlaps
    for (let i = 0; i < processPositions.length; i++) {
      const pos = processPositions[i];
      let done = false;
      while (!done) {
        done = true;
        for (let j = 0; j < i; j++) {
          const prevPos = processPositions[j];
          if (overlaps(pos, prevPos)) {
            // Move down
            pos.y += PROCESS_HEIGHT + PROCESS_SPACING;
            // Retry with new pos.y
            done = false;
          }
        }
      }
    }
    const maxY = processPositions.reduce((maxY, pos) => {
      const y = pos.y + pos.height;
      return y > maxY ? y : maxY;
    }, 0);

    return (
      <g>
        <rect id={id}
            x = {x}
            y = {y}
            width = {width}
            height = {height}
            {...timelineAttrs} />
        <text
            x = {x}
            y = {y + height - PROCESS_SPACING}
            {...textAttrs}
          >{title}</text>

        <Links processes={processes} processPositions={processPositions} />
        {processes.map( (process, index) =>
            <Process
              process = {process}
              processPosition = {processPositions[index]}
              stakeholder = {stakeholder}
            />
        )}
      </g>
    );
  }
}

const mapStateToProps = ({ zoom,marker, selection }) => ({
  zoomStart: zoom.sectionStart.getTime(),
  zoomEnd: zoom.sectionEnd.getTime(),
  marker: marker,
  selected: selection.selected,
});

export default connect(mapStateToProps)(Swimlane);

function overlaps(pos1, pos2) {
  return pos1.x + pos1.width >= pos2.x && pos1.x < pos2.x + pos2.width &&
    pos1.y + pos1.height >= pos2.y && pos1.y < pos2.y + pos2.height;
}
