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
  stacking = { base: false, count: 0 };

  processPositionX = function(process, tlX, tlY, width){
    //from connections mimize staking.base
    if (process.connection.from.length > 1) {
      this.stacking.base =
        this.stacking.base - process.connection.from.length - 1;
    }

    //reset values on last from connection
    if (this.stacking.base < 1) {
      this.stacking.base = 1;
      this.stacking.count = 0;
    }
    //increase the staking.count for every child
    if (this.stacking.base > 1) this.stacking.count++;
    if (this.stacking.base === 1) this.stacking.count=0;

    if (process.connection.to.length > 1) {
      this.stacking.base += (process.connection.to.length - 1);
    }

    let startPx = this.props.width/(this.props.zoomEnd.valueOf()-this.props.zoomStart.valueOf())
                  *(Date.parse(process.start)-this.props.zoomStart.valueOf())
                  +tlX;

    let stacking = 0;

    if (this.stacking.count > 1) stacking = this.stacking.count - 1;

    return {
      id: process.id,
      visible: startPx > width ? false : true,
      x: startPx,
      width: this.processWidth,
      stackingOrder: 1
    };
  }

  getIntersections (thisElement, allPositions) {
    const thisStart = thisElement.x;
    const thisEnd = thisElement.x + thisElement.width;

    let intersectionList = [];

    allPositions.forEach(proc => {
      if (thisElement === proc) return; // skip self compare

      if ((proc.x >= thisStart && proc.x <= thisEnd) || (thisStart >= proc.x && thisStart <= proc.x + proc.width)) {
        if (intersectionList.indexOf(thisElement.id) === -1) intersectionList.push(thisElement.id);
        if (intersectionList.indexOf(proc.id) === -1) intersectionList.push(proc.id);
      }
    });

    return intersectionList;
  }

  processPositionY (thisElement, tlY, processPositions, intersectionMap) {
    // find stackings and place the elements vertical
    if (!thisElement.visible || thisElement.hasOwnProperty('y')) return;

    // set initial values
    thisElement.height = this.props.height;
    thisElement.y = tlY;

    // find maximun intersections for the element in the map
    let intersectionEntry = [];
    intersectionMap.forEach(tmpList => {
      if (tmpList.indexOf(thisElement.id) > -1) { intersectionEntry = tmpList.length > intersectionEntry.length ? tmpList : intersectionEntry; }
    });

    // skip this process
    if (intersectionEntry.length < 2) return thisElement;

    // update values by intersections
    thisElement.height = (this.props.height - this.spacer) / intersectionEntry.length;
    thisElement.y = (thisElement.height * intersectionEntry.indexOf(thisElement.id)) + tlY;

    return thisElement;
  }

  reduceIntersectionMap(intersectionMap, processes) {
    // remove duplicated entries in map
    let uniqueList = [];
    intersectionMap.forEach(elem => {
      let sortedList = elem.sort();
      let sortedListJoin = sortedList.join();
      if (uniqueList.some(elem => elem.join() === sortedListJoin) === false) uniqueList.push(sortedList);
    });

    // join entries that intersect each other by a process
    let mergedList = uniqueList.map(elem => elem);

    let update = false;
    do {
      update = false;
      mergedList.forEach((entry, index) => {
        // find processId that is present in multiple entries
        let duplicatedId = entry.find(id => {
          let e = mergedList.find(e => e.indexOf(id) > -1);
          return typeof e !== 'undefined' && e !== entry;
        });

        if (typeof duplicatedId === 'undefined')	return;

        // merge entries togehter
        let idxOtherEntry = mergedList.findIndex(e => e.indexOf(duplicatedId) > -1);
        entry = entry.concat(mergedList[idxOtherEntry]).filter((value, index, self) => self.indexOf(value) === index); // merge and remove duplicates
        mergedList[index] = entry; // update entry
        mergedList.splice(idxOtherEntry, 1); // remove other entry
        update = true;
      });
    } while (update);

    // sort by processList
    let sortedList = mergedList.sort((a, b) => {
      let comparison = 0;

      if (processes.indexOf(a) > processes.indexOf(b)) { comparison = 1; }
      else if (processes.indexOf(b) > processes.indexOf(a)) { comparison = -1; }

      return comparison;
    });

    /*
    console.log('processes', processes);
    console.log('uniqueList', uniqueList);
    console.log('mergedList', mergedList);
    console.log('sortedList', sortedList);
    */
    return sortedList;
  }

  render () {
    const { id, title, x, y, width, height, processes, stakeholder } = this.props;
    this.stacking.base = 1;
    this.stacking.count = 0;
    let processPositions = [];
    processPositions = processes.map(process => this.processPositionX( process, x, width));
    this.stacking.count = 1;

    let intersectionMap = [];

    // find intersections
    processPositions.forEach(pos => {
      let intersectedList = this.getIntersections(pos, processPositions);
      if (intersectedList.length > 1) intersectionMap.push(intersectedList);
    });

    let reducedIntersectionMap = this.reduceIntersectionMap(intersectionMap, processes); // optimize intersectionMap
    processPositions.map(pos => pos = this.processPositionY(pos, y, processPositions, reducedIntersectionMap)); // update positions because of intersections

    let timelineAttrs = {
      stroke: '#16CEEA',
      'stroke-width': 1,
      fill: 'white'
    };

    const textAttrs = {
      'font-family': 'Verdana',
      'font-size': '0.8em'
    };

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

const mapStateToProps = ({ zoom,marker }) => ({
  zoomStart: zoom.sectionStart,
  zoomEnd: zoom.sectionEnd,
  marker: marker,
});

export default connect(mapStateToProps)(Swimlane);
