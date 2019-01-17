// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import HeaderSlideRightComponent from '../components/header-slide-right';
import type {StoreState} from '../redux';

type ConnectedProps = {|
  count?: number
|};

type Props = {|
  ...ConnectedProps
|};

// react-navigation needs this to be a class
// eslint-disable-next-line react/prefer-stateless-function
class HeaderSlideRight extends React.Component<Props> {
  props: Props;

  render() {
    const {count} = this.props;

    if (count === undefined) {
      return null;
    }

    return <HeaderSlideRightComponent count={count} />;
  }
}

const mapStateToProps = ({progression}: StoreState): ConnectedProps => ({
  count: progression.lives
});

export default connect(mapStateToProps)(HeaderSlideRight);
