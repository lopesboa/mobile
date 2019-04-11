// @flow

import {connect} from 'react-redux';

import {signIn} from '../redux/actions/authentication';
import {fetchCards} from '../redux/actions/cards';
import {fetchBrand} from '../redux/actions/brands';

type ConnectedDispatchProps = {|
  signIn: typeof signIn,
  fetchCards: typeof fetchCards,
  fetchBrand: typeof fetchBrand
|};

// type Props = {|
//   ...ConnectedDispatchProps
// |};

const NetworkInfoListener = () => {
  return null;
};

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn,
  fetchCards,
  fetchBrand
};

export default connect(
  null,
  mapDispatchToProps
)(NetworkInfoListener);
