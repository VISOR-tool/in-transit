import { h } from 'preact';
import { connect } from 'preact-redux';
import style from './iconbar.css';
import { filterActions } from '../../lib/reducers/filter';

export default ({ children }) => (
    <div class={style.iconbar}>
        {children}
    </div>
);

export let IconbarElement = ({
  icon,
  children,
}) => (
    <div class={style.iconbarElement}>
        <img src={icon} width="50" />
        <div class={style.iconbarElementChildren}>
            {children}
        </div>
    </div>
);
