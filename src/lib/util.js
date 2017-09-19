export function uniqStrings (array) {
  var seen = {};

  return array.filter(el => {
    if (seen.hasOwnProperty(el)) {
      return false;
    } else {
      seen[el] = true;
      return true;
    }
  });
}

export function flatten (arrays) {
  return [].concat.apply([], arrays);
}
