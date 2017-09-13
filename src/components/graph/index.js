import { h, Component } from 'preact';

const lanes = [{
  title: 'Rat der Weisen',
  boxes: [{
    title: 'Ratstagung I/2017',
    start: dateToTime('2017-01-01'),
    end: dateToTime('2017-01-02')
  }, {
    title: 'Ratstagung II/2017',
    start: dateToTime('2017-04-01'),
    end: dateToTime('2017-04-02')
  }, {
    title: 'Ratstagung III/2017',
    start: dateToTime('2017-07-01'),
    end: dateToTime('2017-07-02')
  }, {
    title: 'Ratstagung IV/2017',
    start: dateToTime('2017-10-01'),
    end: dateToTime('2017-10-02')
  }]
}, {
  title: 'Bürgerwehr',
  boxes: [{
    title: 'Demo',
    start: dateToTime('2017-03-31'),
    end: dateToTime('2017-04-01')
  }, {
    title: 'Wütender Mob',
    start: dateToTime('2017-07-02'),
    end: dateToTime('2017-07-04')
  }, {
    title: 'Revolution',
    start: dateToTime('2017-10-02'),
    end: dateToTime('2017-10-05')
  }]
}, {
  title: 'Militär',
  boxes: [{
    title: 'Aufrüstung',
    start: dateToTime('2017-04-01'),
    end: dateToTime('2017-05-01')
  }, {
    title: 'Einsatz im Inneren',
    start: dateToTime('2017-07-04'),
    end: dateToTime('2017-08-04')
  }, {
    title: 'Coup d\'Etat',
    start: dateToTime('2017-10-05'),
    end: dateToTime('2017-10-17')
  }]
}];

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml';

const LANE_HEIGHT = 40;
const LANE_H_GAP = 10;
const LANE_HEAD_WIDTH = 200;
const LANE_BOXES_WIDTH = 400;

export default class Graph extends Component {
  constructor () {
    super();

    this.setState({
      dragging: false,
      panX: 0,
      panY: 0,
      zoom: 1,
    });
  }

  onMouseDown = e => {
    if (e.button === 0) {
      console.log('onMouseDown', e);
      this.setState({
        dragging: true,
      });
    }
  }

  onMouseMove = e => {
    if (this.state.dragging) {
      e.preventDefault();

      const { zoom } = this.state;
      const dx = e.movementX * zoom;
      const dy = e.movementY * zoom;
      console.log('move', dx, dy, 'zoom', zoom);
      console.log('move', dx, dy);
      this.setState({
        panX: this.state.panX + dx,
        panY: this.state.panY + dy
      });
    }
  }

  onMouseUp = e => {
    if (e.button === 0) {
      this.setState({
        dragging: false
      });
    }
  }

  onMouseLeave = e => {
    this.setState({
      dragging: false
    });
  }

  onMousewheel = e => {
    if (e.deltaY !== 0) {
      e.preventDefault();

      var { zoom, panX, panY } = this.state;
      const mouseX = (e.offsetX - panX) / zoom;
      const mouseY = (e.offsetY - panY) / zoom;
      if (e.deltaY < 0) {
        zoom *= Math.pow(1.0005, -e.deltaY);
      } else {
        zoom *= Math.pow(0.9995, e.deltaY);
      }
      panX = e.offsetX - mouseX * zoom;
      panY = e.offsetY - mouseY * zoom;
      this.setState({
        zoom,
        panX,
        panY,
      });
    }
  }

  render () {
    const { panX, panY, zoom } = this.state;
    const mapX = (x) => zoom * x + panX;
    const mapY = (y) => zoom * y + panY;
    const minTime = Math.min.apply(
      Math,
      [].concat.apply(
        [],
        lanes.map(
          lane => lane.boxes.map(box => box.start)
        )
      )
    );
    const maxTime = Math.max.apply(
      Math,
      [].concat.apply(
        [],
        lanes.map(
          lane => lane.boxes.map(box => box.end)
        )
      )
    );
    const opts = {
      mapX, zoom,
      minTime, maxTime,
    };

    return (
      <svg xmlns={NS_SVG} version='1.1'
        viewBox='0 0 640 480' preserveAspectRatio='xMidYMid slice'
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseLeave}
        onMousewheel={this.onMousewheel}
        >
        {lanes.map((lane, lane_i) => {
          return (
            <g>
              <Lane lane={lane} mapY={y => mapY(y + lane_i * (LANE_HEIGHT + LANE_H_GAP))} {...opts}/>
            </g>
          );
        })}
      </svg>
    );
  }
}

class Lane extends Component {
  render () {
    const { lane, mapX, mapY, zoom, minTime, maxTime } = this.props;
    return (
      <g>
        <rect x={mapX(0)} y={mapY(0)} width={zoom * LANE_HEAD_WIDTH} height={zoom * LANE_HEIGHT} fill='rgba(127, 127, 255, 0.2)' stroke='black' />
        <text x={mapX(0)} y={mapY(LANE_HEIGHT / 2)} width={zoom * LANE_HEAD_WIDTH} height='auto' text-anchor='start' font-size={20}>
          {lane.title}
        </text>,

      {lane.boxes.map(box => {
        const x1 = LANE_HEAD_WIDTH + LANE_BOXES_WIDTH * (box.start - minTime) / (maxTime - minTime);
        const x2 = LANE_HEAD_WIDTH + LANE_BOXES_WIDTH * (box.end - minTime) / (maxTime - minTime);
        return (
          <g>
            <rect x={mapX(x1)} y={mapY(0)} width={zoom * (x2 - x1)} height={zoom * LANE_HEIGHT} fill='none' stroke='black'/>
            <text x={mapX(x1)} y={mapY(LANE_HEIGHT / 2)} height='auto' text-anchor='start' font-size={16}>
              {box.title}
            </text>
          </g>
        );
      })}
      </g>
    );
  }
}

function dateToTime (s) {
  return new Date(s).getTime() / 1000;
}
