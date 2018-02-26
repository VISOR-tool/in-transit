import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataLoad } from '../../lib/reducers/data';
import { selectionActions } from '../../lib/reducers/selection';
import moment from 'moment';
import style from './results.css';

class Results extends Component {

  render () {
    const { data: process, select, hover, unhover, filter } = this.props;

    return  <div class={style.results}>      
      <ul>
        { 
          process.process.childs.map( child => {
            if(child.results.length > 0){ 
              return <li
                      onmouseenter={() => hover(child.id)}
                      onmouseleave={() => unhover(child.id)}
                      onmousedown={ev => {
                          ev.cancelBubble = true;
                          select(child.id);
                      }}
                      class={ child.participation.includes('open') ? style.openParticipation : null }
                      >
                  <b> Prozess: {child.name}</b>
                      <ul> 
                        {child.results.map( result => <li>{result.name} <br/> 
                        <i>{result.description}</i> <br/> 
                        (Dateien: {result.files.length} )</li> )}                        
                      </ul>
                    
              </li>
            }
          })
        }
      </ul>        
    </div>;
  }
}


const mapStateToProps = ({ data, filter }) => ({
  data: data.data,
  dataUrl: data.wantedUrl,
  //selected
});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
  hover: value => dispatch(selectionActions.hover(value)),
  unhover: value => dispatch(selectionActions.unhover(value)),
  select: value => dispatch(selectionActions.select(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Results);
