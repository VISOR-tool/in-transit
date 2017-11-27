import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { Provider } from 'preact-redux';

import createStore from '../lib/store.js';
import Header from './header';
import Home from '../routes/home';
import Profile from '../routes/profile';
import Oproc from '../routes/oproc';
import Timeline from '../routes/timeline';
// import Home from 'async!./home';
// import Profile from 'async!./profile';

export default class App extends Component {
  constructor () {
    super();

    this.store = createStore();
  }

  /** Gets fired when the route changes.
   *      @param {Object} event           "change" event from [preact-router](http://git.io/preact-router)
   *      @param {string} event.url       The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render () {
    return (
      <Provider store={this.store}>
        <div id='app'>
          <Header />
          <Router onChange={this.handleRoute}>
            <Home path='/' />
          </Router>
          <Router onChange={this.handleRoute}>
            <Oproc path='/oproc' />
          </Router>
          <Router onChange={this.handleRoute}>
            <Timeline path='/timeline' />
          </Router>

        </div>
      </Provider>
    );
  }
}
