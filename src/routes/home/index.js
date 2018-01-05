import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import style from './style';
import TransitMap from './transit_map';
import { dataLoad } from '../../lib/reducers/data';
import { applyFilter } from '../../lib/reducers/filter';

class Home extends Component {
  render () {
    const { dataUrl, loadData, data } = this.props;
    const wantedUrl = 'oproc-elias-2018.json'; //'oproc-tiny-tree.json'
    if (dataUrl !== wantedUrl) {
      setTimeout(() => {
        if (dataUrl !== wantedUrl) {
          loadData(wantedUrl);
        }
      }, 1000);
    }

    if (data.process == undefined) {
      return <p>Daten werden noch geladen</p>;
    }

    return (
      <div class={style.home}>
        <TransitMap data={data.process}/>
      </div>
    );
  }
}

const mapStateToProps = ({ data, filter }) => ({
  dataUrl: data.wantedUrl,
  data: applyFilter(data.data, filter),
});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
