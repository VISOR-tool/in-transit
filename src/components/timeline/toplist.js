import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataLoad } from '../../lib/reducers/data';
import { selectionActions } from '../../lib/reducers/selection';


class Uniqe {
  constructor () {
    this.items = [];
  }

  add( index ){        
    this.items.map( li => {
      if(li.id == index) return { id: li.id, cnt: li.cnt++ };
    });

    if( ! this.items.find( li => li.id == index )) {
      this.items.push({ id: index, cnt: 1 });
    }
  }
  
  sort(){
    return this.items.sort((a, b) => a.cnt < b.cnt);
  }
}


class Toplist extends Component {
  render () {
    const { data: process, select } = this.props;

    let tlLoactions = new Uniqe();
    process.process.childs.map( p => { p.location.map( loc => tlLoactions.add(loc) ) });
    let mostLocations = tlLoactions.sort()
        .slice(0,3)
        .map( li => <li 
                onClick={() => select({cat:'loc',val:li.id})}
                data={li.id}
              >{li.id} ({li.cnt}x)</li> );

    let nextPrtcpDates = []
    process.process.childs.map( p => { 
        if(p.participation.includes("open") && new Date(p.start) > new Date() ) 
          nextPrtcpDates.push([p.participation, p.start, p.name, p.id]);
      });
    nextPrtcpDates.sort((a,b) => { return new Date(a[1]) - new Date(b[1]) });
    nextPrtcpDates = nextPrtcpDates.slice(0,3)
      .map( li => <li
              onClick={() => select(li[3])}
            > {li[1]} {li[2]} </li>)    

    let nextDecisionDates = [];
    process.process.childs.map( p => { 
      if(p.transformation.type === '>' && new Date(p.start) > new Date()) {
        if(p.transformation.info.length == 0 ) 
             nextDecisionDates.push( [p.start, p.name +'('+p.description+')',p.id] );
        else nextDecisionDates.push([p.start, p.transformation.info, p.id]);
      }
      
    });
    nextDecisionDates = nextDecisionDates.sort((a,b)=>{return new Date(a[0]) - new Date(b[0])} )
                        .slice(0,3)
                        .map( li => <li
                          onClick={() => select(li[2])}
                          >{li[0]} {li[1]}</li> );

    return (
      <div> 
        <b>Toplist</b>
        <br/>Häufigste Orte:
        <ul>
          {mostLocations}
        </ul>
        Nächste Beteiligungstermine:
        <ul>
          {nextPrtcpDates}
        </ul>
        Nächste Entscheidungen:
        <ul>
          {nextDecisionDates}
        </ul>        
      </div>
    );
  }
}


const mapStateToProps = ({ data }) => ({
  data: data.data,
  dataUrl: data.wantedUrl,
});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
  select: value => dispatch(selectionActions.select(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Toplist);
