export default class Vertices {
  constructor () {
    this.linksFrom = {};
    this.linksTo = {};
  }

  set (from, to) {
    if (!this.linksFrom.hasOwnProperty(from)) {
      this.linksFrom[from] = {};
    }
    this.linksFrom[from][to] = true;

    if (!this.linksTo.hasOwnProperty(to)) {
      this.linksTo[to] = {};
    }
    this.linksTo[to][from] = true;
  }

  from (from) {
    return Object.keys(this.linksFrom[from] || {}).sort();
  }

  to (to) {
    return Object.keys(this.linksTo[to] || {}).sort();
  }

  startNodes () {
    const result = [];
    for (const from in this.linksFrom) {
      if (this.to(from).length == 0) {
        result.push(from);
      }
    }
    return result;
  }

  endNodes () {
    const result = [];
    for (const to in this.linksTo) {
      if (this.from(to).length == 0) {
        result.push(to);
      }
    }
    return result;
  }

  distanceToStart (to, seen = {}) {
    var froms = this.to(to);
    if (froms.length === 0) {
      return 0;
    }
    var newSeen = { ...seen };
    newSeen[to] = true;
    froms = froms.filter(from => !newSeen[from]);
    if (froms.length > 0) {
      // return 1 + avg(froms.map(from => this.distanceToStart(from, newSeen)));
      return 1 + Math.max.apply(Math, froms.map(from => this.distanceToStart(from, newSeen)));
    } else {
      return 1;
    }
  }

  distanceToEnd (from, seen = {}) {
    var tos = this.from(from);
    if (tos.length === 0) {
      return 0;
    }
    var newSeen = { ...seen };
    newSeen[from] = true;
    tos = tos.filter(to => !newSeen[to]);
    if (tos.length > 0) {
      // return 1 + avg(tos.map(to => this.distanceToEnd(to, newSeen)));
      return 1 + Math.min.apply(Math, tos.map(to => this.distanceToEnd(to, newSeen)));
    } else {
      return 1;
    }
  }
}

function avg (xs) {
  if (xs.length < 1) {
    return 0;
  } else {
    return xs.reduce((sum, x) => sum + x) / xs.length;
  }
}
