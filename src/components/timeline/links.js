import { h, Component } from 'preact';


const dimmedLinks = '#DAC9CA'; 
const highlightedLinks = '#635C91'; 


const Links = ({ processes }) => {
  if(processes.length < 2) return false;

  let lines = [];
  processes.map( (process,index,all) => {
    if(process.attributes.process.visible === true){
      all.map(pAll => {
        if( pAll.attributes.process.visible === true &&
            pAll.attributes.process.connection.from.includes(process.attributes.process.id))
        {          
          lines.push({
            x1: process.attributes.processPosition.x + process.attributes.processPosition.width,
            y1: process.attributes.processPosition.y + process.attributes.processPosition.height,
            x2: pAll.attributes.processPosition.x ,
            y2: pAll.attributes.processPosition.y,
            color: process.attributes.process.subselected ? highlightedLinks : dimmedLinks,
            stroke: process.attributes.process.subselected ? 3 : 1,
          });
        }
      });
    }
  });

  let svgLines = lines.map( line => (
      <line x1={line.x1} y1={line.y1} 
            x2={line.x2} y2={line.y2}  
            stroke={line.color}
            stroke-width = {line.stroke} />
  ));

  return (
    <g>
      {svgLines}
    </g>
  );
}

export default Links;
