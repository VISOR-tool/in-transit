//import { h, Component } from 'preact';
var Reflux = require('reflux');
var FilterActions = require('./flux-actions');

var FilterStore = Reflux.createStore({
    listenables: [FilterActions],

    init () {
      this.eventTypes = [];
    },

    filter (personId) {
      this.changed();
      console.log('flux filter');
    },
});

module.exports = FilterStore;
