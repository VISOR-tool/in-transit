import { h, Component } from 'preact';
import style from './style';
import Graph from '../../components/graph';

export default class Home extends Component {
  render () {
    return (
      <div class={style.home}>
        <h1>Graph Engine</h1>
        <Graph />
      </div>
    );
  }
}
