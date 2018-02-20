import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { selectionActions } from '../../lib/reducers/selection';

const Node = props => {
  const { id, shape, label, x, y, size, fill, stroke } = props;
  const labelRotation = typeof props.labelRotation === 'number' ? props.labelRotation : -13;
  const { hover, unhover, select } = props;

  var attrs = {
    stroke: stroke,
    fill: fill,
    onmouseover: ev => hover(id),
    onmouseout: ev => unhover(id),
    onmousedown: ev => {
      ev.cancelBubble = true;
      select(id);
    },
  };

  var shapeComponent;
  switch (shape) {
  case 'circle':size
    shapeComponent = <circle cx={x} cy={y} r={size} stroke-width={size/3} {...attrs} />;
    break;
  case 'square':
    shapeComponent = <rect x={x} y={y} width={size/2} height={size/2} stroke-width={size/5} {...attrs} />;
    break;
  default:
    throw new Error('No Node shape!');
  }

  const labelVisible = props.hovered == id;
  return (
    <g>
      {shapeComponent}
      {labelVisible
      ? <g transform={'translate(' + x + ',' + y + ')'}>
       ? <g>
        <rect  x={3 * size -7} y={size - 14} height="18" width={(label.length * 5)+4} fill="green" />
        <text  x={(3 * size -4)} y={size / 3}
              text-anchor='start'
              font-size="0.9em"
              fill="white"
              >
        {label}
        </text>
       </g>
       }

      </g> : null}
    </g>
  );
}

const mapStateToProps = ({ selection, filter }) => ({
  hovered: selection.hovered,
  selected: selection.selected,
});
const mapDispatchToProps = dispatch => ({
  hover: value => dispatch(selectionActions.hover(value)),
  unhover: value => dispatch(selectionActions.unhover(value)),
  select: value => dispatch(selectionActions.select(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Node);
