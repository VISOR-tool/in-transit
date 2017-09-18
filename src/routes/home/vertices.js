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

  terminalNodes () {
    const result = [];
    for (const to in this.linksTo) {
      if (this.from(to).length == 0) {
        result.push(to);
      }
    }
    return result;
  }
}
