import { connect } from 'react-redux';
import GoogleMap from '../components/GoogleMap';

const mapStateToProps = (state, ownProps) => {
  const { activeNode: { latitude, longitude }, destination } = state;
  const origin = { latitude, longitude };

  return {
    origin,
    destination
  };
};

export default connect(mapStateToProps, () => ({}))(GoogleMap);
