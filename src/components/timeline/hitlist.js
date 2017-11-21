import { h, Component } from 'preact';
import style from './hitlist';

export default class Hitlist extends Component {
  constructor () {
    super();
    this.setState({  });
  }

  /*
   * Auftrennung des Prozesses. Rein kommt das ganze Objekt
   * raus gehen verschiedene swimlanes die 1:n Ojekte enthalten
   */
  render () {
   //const { beginning, end, steps, process, filter } = this.props;

    return  <div class={style.hitlist}>
              <ul>
                <li>dadfs</li>
                <li>ffhdg</li>
                <li>tregedfgdv</li>
                <li>rwterhdbxsygv</li>
                <li>gdfsshdg</li>
              </ul>

          </div>
  }
}
