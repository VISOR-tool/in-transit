import { h, Component } from 'preact';
import style from './style';
import layout from './layout';
import Timeline from '../../components/timeline/timeline';
import Oproc from '../../components/oproc/oproc';
import { uniqStrings } from '../../lib/util';


class TimelineView extends Component {
  constructor () {
    super();
    this.setState({
      oproc: {},
    });

    let oProc = new Oproc;
    //oProc.reload("oproc.json")
    //oProc.reload("oproc-tiny-tree.json")
    oProc.reload("oproc-elias.json")
        .then( oproc => {
        this.setState({oproc: oproc});
    });
  }

  render() {
    if( this.state.oproc.process == undefined ) return "daten können nicht geladen werden ";
    return (
      //Zoomfaktor bestimmen, der das lineal, den timeline Auschnitt
      //und dessen Objekte bestimmt

      <Timeline
        width={parseInt(this.props.width)}
        height={parseInt(this.props.height)}
        beginning={this.props.beginning}
        end={this.props.end}
        steps={this.props.steps}
        process={this.state.oproc}
        />
    );
  }
}

export default class Home extends Component {
  constructor () {
    super();
    this.state = {
      zoom: 99,
      zoomMin: 30 * 3600 * 1000, //min zoom level 1 Month
      zoomMax: 2.1 * 365 * 24 * 3600 * 1000, //max zoom level 2 Years
      zoomSectionStart: Date.parse(2014),
      };
    this.handleZoom = this.handleZoom.bind(this);
  }

  handleZoom = function(event){
    event.preventDefault();
    this.setState({ zoom: event.target.value });
    this.render();
  };

  render () {
    let zoomEnd = new Date(this.state.zoomSectionStart + ((this.state.zoomMax - this.state.zoomMin)/100) * this.state.zoom);

    return (
      <div class={style.home}>
        <h1>Timeline</h1>
        Zoom:
        <input
          type="range"
          id="zoom"
          value={this.state.zoom}
          onChange={this.handleZoom}
        />
        (1Mon/2Years)
        <TimelineView
          width="600"
          height="1000"
          beginning={this.state.zoomSectionStart}
          end={zoomEnd.valueOf()}
         />
      </div>
    );
  }
}
