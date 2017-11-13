import { h, Component } from 'preact';

export default class Links extends Component {
  // constructor () {
  //   super();
  // }

  render () {
    const { processes } = this.props;

    if(processes.length < 2) return false;

    let lines = [];
    processes.map( (process,index,all) => {
        if(process.attributes.process.visible == true){
          all.map(pAll => {
            if( pAll.attributes.process.visible == true &&
                pAll.attributes.process.connection.from.indexOf(process.attributes.process.id) > -1)
            {
              lines.push({
                    x1: process.attributes.processPosition.x + process.attributes.processPosition.width,
                    y1: process.attributes.processPosition.y + process.attributes.processPosition.height,
                    x2: pAll.attributes.processPosition.x ,
                    y2: pAll.attributes.processPosition.y
                  });
            }
          });
        }
    });

    var attrs = {
      stroke: '#80579E',
      'stroke-width': 1,
    };

    let svgLines = lines.map( line => (
         <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}  {...attrs} />
         ));

        //links.map( link => ( <line x1="0" y1="0" x2="200" y2="200"  {...attrs} /> ) )

    return (
      <g>
      {svgLines}
      </g>
    ) ;
  }
}
