export function dagesEdgeToSvgPath (edge) {
  // ausgabe werte = [{ x:21, y:12}, {x:231,y:213},{x:123,y:231}]
  // benötigt für svg: <path d='M x y L x y ...'
  const firstP = edge.points[0].x + ' ' + edge.points[0].y;
  let followingP = '';
  edge.points.slice(1).map(
    p => followingP = `${followingP} L ${p.x} ${p.y}`
  );
  return `M ${firstP} ${followingP}`;
}
