// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import type {HeaderProps} from 'react-navigation';
import {Header as HeaderBase} from 'react-navigation';

import type {StoreState} from '../redux';

type ConnectedStateToProps = {|
  isHidden: boolean
|};

type Props = HeaderProps & ConnectedStateToProps;

const Header = ({isHidden, ...props}: Props) => {
  if (isHidden) {
    return null;
  }

  return <HeaderBase {...props} />;
};

const mapStateToProps = ({navigation}: StoreState): ConnectedStateToProps => ({
  isHidden: navigation.isHidden
});

export default connect(mapStateToProps)(Header);
