import style from './style';
import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import TransitMap from './transit_map';
import Filtering from './../../components/timeline/filtering';
import { dataLoad } from '../../lib/reducers/data';

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
        <Filtering/>
        <TransitMap data={data.process}/>
      </div>
    );
  }
}

const mapStateToProps = ({ data, filteredData }) => ({
  dataUrl: data.wantedUrl,
  data: filteredData,
});
const mapDispatchToProps = dispatch => ({
  loadData: dataLoad(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
