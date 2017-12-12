import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { selectionActions } from '../../lib/reducers/selection';

const Process = ({ process, processPosition, stakeholder,
                   selected, select, hovered, hover, unhover,
                 }) => {
  const { id } = process;
  if(process.visible == true)
  {
    let procAttrs = {
      width: 80,
      stroke: '#3784F8',
      'stroke-width': 1,
      fill: '#61D2E8'
    };
    if (hovered === id) {
      procAttrs['fill'] = "#71E2F8";
    }
    let isSelected =
        selected === id;
    if (selected && selected.cat && selected.val) {
      switch (selected.cat) {
      case 'sh':
        isSelected =
          process.initiator === selected.val;
        break;
      case 'loc':
        isSelected =
          process.location &&
          (process.location.indexOf(selected.val) != -1);
        break;
      }
    }
    if (isSelected) {
      procAttrs['stroke'] = "#FF0000";
    }

    if(process.searchHit){
      procAttrs = {
        width: 80,
        stroke: '#3784F8',
        'stroke-width': 1,
        fill: '#E88261'
      };
    }

    const processAttrs = {
      "font-family": "Verdana",
      "font-size"  : 10,
      "font-weight" : "bold"
    }
    const iniAttrs = {
      "font-family": "Verdana",
      "font-size"  : 10,
    }
    const spacer = 5;
    const sh = stakeholder.find(sh => sh.id == process.initiator);
    const processInitiator = sh.name;
    return (
      <g  onmouseenter={() => hover(id)}
          onmouseleave={() => unhover(id)}
          onmousedown={() => select(id)}
          >
        <rect id={id}
              x={processPosition.x}
              y={processPosition.y}
              height={processPosition.height}
              {...procAttrs}
        />
        <text x={processPosition.x + spacer}
              y={processPosition.y + 9 }
              {...processAttrs}
              >{process.name}
        </text>
        <text x={processPosition.x + spacer}
              y={processPosition.y + 20}
              {...iniAttrs}
              >Ini:{processInitiator}
        </text>
        <text x={processPosition.x + spacer}
              y={processPosition.y + 30}
              {...iniAttrs}
              >[{process.participation}]
        </text>
        <text x={processPosition.x + spacer}
              y={processPosition.y + 40}
              {...iniAttrs}
              >[{process.start}]
        </text>
      </g>
    );
  }
}

const mapStateToProps = ({ selection }) => ({
  hovered: selection.hovered,
  selected: selection.selected,
});
const mapDispatchToProps = dispatch => ({
  hover: value => dispatch(selectionActions.hover(value)),
  unhover: value => dispatch(selectionActions.unhover(value)),
  select: value => dispatch(selectionActions.select(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Process);
