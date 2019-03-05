// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import {fetchRequest as fetchCards} from '../redux/actions/cards';
import {fetchRequest as fetchBrand} from '../redux/actions/brands';

type ConnectedDispatchProps = {|
  fetchCards: typeof fetchCards,
  fetchBrand: typeof fetchBrand
|};

type Props = {|
  ...ConnectedDispatchProps
|};

class NetworkInfoListener extends React.PureComponent<Props> {
  props: Props;

  componentDidMount() {
    // @todo use dynamic language
    this.props.fetchCards('en');
    this.props.fetchBrand('token');
  }

  // @todo manage connection change to fetch real content when the user is online

  render() {
    return null;
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  fetchCards,
  fetchBrand
};

export default connect(null, mapDispatchToProps)(NetworkInfoListener);
