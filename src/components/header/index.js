import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

export default class Header extends Component {
  render () {
    return (
      <header class={style.header}>
        <h3>visor - Städtebauliche Pläne durforsten</h3>
        <nav>
          <Link activeClassName={style.active} href='/'>Home</Link>
        </nav>
      </header>
    );
  }
}
