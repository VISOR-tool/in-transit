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
    return Object.keys(this.linksFrom[from] || {});
  }

  to (to) {
    return Object.keys(this.linksTo[to] || {});
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

  distanceToStart (to, seen={}) {
    const froms = this.to(to)
          .filter(from => !seen[from]);
    if (froms.length > 0) {
      var newSeen = { ...seen };
      newSeen[to] = true;
      return 1 + Math.min.apply(Math, froms.map(from => this.distanceToStart(from, newSeen)));
    } else {
      return 0;
    }
  }

  distanceToEnd (from, seen={}) {
    const tos = this.from(from)
          .filter(to => !seen[to]);
    if (tos.length > 0) {
      var newSeen = { ...seen };
      newSeen[from] = true;
      return 1 + Math.min.apply(Math, tos.map(to => this.distanceToEnd(to, newSeen)));
    } else {
      return 0;
    }
  }
}
