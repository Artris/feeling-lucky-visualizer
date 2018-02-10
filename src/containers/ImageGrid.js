import { connect } from 'react-redux';
import ImageGridList from '../components/ImageGridList';

const mapStateToProps = (state, ownProps) => {
  const { activeNode: { images } } = state;
  return { images };
};

export default connect(mapStateToProps, () => ({}))(ImageGridList);
