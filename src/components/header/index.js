import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

export default class Header extends Component {
  render () {
    return (
      <header class={style.header}>
        <h3>visor</h3>
        <nav>
          <Link activeClassName={style.active} href='/'>Timeline</Link>
        </nav>
      </header>
    );
  }
}
