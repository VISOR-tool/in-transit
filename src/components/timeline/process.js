import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { selectionActions } from '../../lib/reducers/selection';

const defaultObjectColor = '#7F7F7F';
const defaultObjectStrokeColor = '#3784F8';
const defaultObjectOpacity = '0.3';
const participateObjectColor = '#FFFF00';
const participateObjectStrokeColor = "#000000";
const participateObjectOpacity = '0.5';
const onHoverObjectColor = "#71E2F8";
const onHoverObjectOpacity = '0.9';
const selectedObjectColor = "#3122F8";
const selectedObjectStrokeColor = "#FF0000";
const selectedObjectOpacity = '0.9';
const searchHitObjectColor = '#E88261';
const searchHitObjectstrokeColor = '#3784F8';


const Process = ({ process, processPosition, stakeholder,
                   selected, select, hovered, hover, unhover,
                 }) => {
  const { id } = process;
  if(process.visible == true)
  {
    let procAttrs = {
      width: 80,
      stroke: defaultObjectStrokeColor,
      'stroke-width': 1,
      fill: defaultObjectColor,
      opacity: defaultObjectOpacity,
    };

    if(process.participation.includes("open")){
      procAttrs['fill'] = participateObjectColor;
      procAttrs['stroke'] = participateObjectStrokeColor;
      procAttrs['opacity'] = participateObjectOpacity;      
    }


    if (hovered === id) {
      procAttrs['fill'] = onHoverObjectColor;
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
      procAttrs['fill'] = selectedObjectColor;
      procAttrs['stroke'] = selectedObjectStrokeColor;
      procAttrs['opacity'] = selectedObjectOpacity;
    }

    if(process.searchHit){
      procAttrs = {
        width: 80,
        stroke: searchHitObjectstrokeColor,
        'stroke-width': 1,
        fill: searchHitObjectColor,
      };
    }

    const processAttrs = {
      "font-family": "Verdana",
      "font-weight" : "bold",
      "font-size": "0.8em"
    }
    const iniAttrs = {
      "font-family": "Verdana",
      "font-size": "0.8em"
    }
    const spacer = 5;
    const sh = stakeholder.find(sh => sh.id == process.initiator);
    const processInitiator = sh.name;
    return (
      <g  onmouseenter={() => hover(id)}
          onmouseleave={() => unhover(id)}
          onmousedown={ev => {
            ev.cancelBubble = true;
            select(id);
          }}
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
        {/* <text x={processPosition.x + spacer}
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
        </text> */}
      </g>
    );
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(Process);
