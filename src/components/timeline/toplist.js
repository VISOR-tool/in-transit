import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataLoad } from '../../lib/reducers/data';


class Toplist {
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


class ToplistComponent extends Component {

  render () {
    console.log(this.props.processData);
    const process = this.props.processData;
    let toplist = new Toplist();
    process.process.childs.map( p => { p.location.map( loc => toplist.add(loc) ) });
    let mostLocations = toplist.sort().map( li => <li>[{li.cnt}] {li.id}</li> );
    return (
      <div> 
        <b>Toplist</b>
        <ul>
          {mostLocations}
        </ul>
      </div>
    );
  }
}



const mapStateToProps = ({ data }) => ({
  dataUrl: data.wantedUrl,
});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToplistComponent);
