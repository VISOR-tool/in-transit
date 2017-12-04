import { h, Component } from 'preact';

const Process = ({ process, processPosition, stakeholder }) => {
  if(process.visible == true)
  {
    let procAttrs = {
      width: 80,
      stroke: '#3784F8',
      'stroke-width': 1,
      fill: '#61D2E8'
    };

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
      <g>
        <rect id={process.id}
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

export default Process;
