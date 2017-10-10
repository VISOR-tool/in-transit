import { h, Component } from 'preact';

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XHTML = 'http://www.w3.org/1999/xhtml';

export default class Timeline extends Component {
  constructor () {
    super();

    this.setState({
      width: '',
      height: '',
      beginning: '',
      end: '',
      steps: ''
    });

  }

  render () {
    console.log('render props', this.props);

    return (
      <svg xmlns={NS_SVG} version='1.1' viewBox='0 0 640 480' preserveAspectRatio='xMidYMid slice' >
        <rect x="10" y="10" width={this.props.width} height={this.props.height} style="fill:#95DAE7" />
      </svg>
    );
  }
}
