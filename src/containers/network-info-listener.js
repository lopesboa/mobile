// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import {signIn} from '../redux/actions/authentication';
import {fetchCards} from '../redux/actions/cards';
import {fetchBrand} from '../redux/actions/brands';

type ConnectedDispatchProps = {|
  signIn: typeof signIn,
  fetchCards: typeof fetchCards,
  fetchBrand: typeof fetchBrand
|};

type Props = {|
  ...ConnectedDispatchProps
|};

class NetworkInfoListener extends React.PureComponent<Props> {
  props: Props;

  async componentDidMount() {
    await this.props.signIn(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWM3NTFhYTY4ZjI3MTMwMDFiMzBlMWIzIiwidXNhZ2UiOiJtb2JpbGUiLCJob3N0IjoiaHR0cHM6Ly9tb2JpbGUtc3RhZ2luZy5jb29ycGFjYWRlbXkuY29tIiwiZ3JhbnRzIjp7Im1vb2MiOnsiZ3JhbnRzIjp7Im1vYmlsZSI6eyJyb2xlcyI6WyJ1c2VyIl19fX19LCJpYXQiOjE1NTExNzg4MTAsImV4cCI6MjAwMDAwMDAwMCwiYXVkIjoibW9iaWxlIiwiaXNzIjoiY29vcnBhY2FkZW15LWp3dCJ9.vC0vxTO8eNk2crp5_nhPgUF7UVqg8K3yFdj6SzHVNIY'
    );
    await this.props.fetchBrand();
    // @todo use dynamic language
    await this.props.fetchCards('en');
  }

  // @todo manage connection change to fetch real content when the user is online

  render() {
    return null;
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn,
  fetchCards,
  fetchBrand
};

export default connect(null, mapDispatchToProps)(NetworkInfoListener);
