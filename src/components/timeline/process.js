import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { selectionActions } from '../../lib/reducers/selection';

const defaultObjectColor = '#CCCCCC';
const defaultObjectStrokeColor = '#3784F8';
const participateObjectColor = '#FFFFAD';
const participateObjectStrokeColor = "#000000";
const onHoverObjectColor = "#71E2F8";
const selectedObjectColor = "#B5B0FF";
const selectedObjectStrokeColor = "#FF0000";
const searchHitObjectColor = '#FFA487';
const searchHitObjectstrokeColor = '#3784F8';


const Process = ({ process, processPosition, stakeholder,
                   selected, select, hovered, hover, unhover,
                 }) => {
  const { id, subselected } = process;
  if (process.visible === true) {
    let bodyAttrs = {
      stroke: defaultObjectStrokeColor,
      'stroke-width': 1,
      fill: defaultObjectColor,
    };

    if(process.participation.includes("open")){
      bodyAttrs['fill'] = participateObjectColor;
      bodyAttrs['stroke'] = participateObjectStrokeColor;
    }

    if(hovered === id) {
      bodyAttrs['fill'] = onHoverObjectColor;
    }
      
    if(process.searchHit){
      bodyAttrs = {
        stroke: searchHitObjectstrokeColor,
        'stroke-width': 1,
        fill: searchHitObjectColor,
      };
    }

    let isSelected = selected === id;
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
      bodyAttrs['fill'] = selectedObjectColor;
      bodyAttrs['stroke'] = selectedObjectStrokeColor;
    }
      
    if(subselected === true) {
      bodyAttrs['fill'] = selectedObjectColor;
      bodyAttrs['stroke'] = selectedObjectStrokeColor;
    }

    const textAttrs = {
      "font-family": "Monospace",
      "font-weight" : "100",
      "font-size": "10px"
    }
    const iniAttrs = {
      "font-family": "monospace",
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
              width={processPosition.width}
              height={processPosition.height}
              {...bodyAttrs}
        />        
        
        { process.transformation.decision === 'true' ?
          <image
          xlinkHref={require('./icons/decision.svg')}
          x={processPosition.x-10}
          y={processPosition.y+processPosition.height-18}
          width="100"
          height={processPosition.height + 65}
          style='cursor:pointer'
          /> : null }

        { process.participation.includes("open") ?
          <image
          xlinkHref={require('./icons/participation.svg')}
          x={processPosition.x+65}
          y={processPosition.y+processPosition.height-18}
          width="100"
          height={processPosition.height + 65}
          style='cursor:pointer'
          stroke="red"
          /> : null  }

                  
          
        <text x={processPosition.x + spacer}
              y={processPosition.y + 14 }
              {...textAttrs}
              >{process.name.length > 15 ? process.name.slice(0,12)+'...' : process.name}
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