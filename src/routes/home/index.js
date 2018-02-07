import style from './style';
import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import Filtering from './../../components/timeline/filtering';
import { dataLoad } from '../../lib/reducers/data';

class Home extends Component {
  render () {
    const { dataUrl, loadData, data } = this.props;
    const wantedUrl = 'oproc-elias.json';  //hier syncronisieren mit der route timeline
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
