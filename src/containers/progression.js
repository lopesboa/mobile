// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import type {StoreState} from '../redux';
import ProgressionComponent from '../components/progression';

type ConnectedStateToProps = {|
  isHidden: boolean
|};

type Props = {|
  ...ConnectedStateToProps
|};

const Progression = ({isHidden}: Props) => {
  if (isHidden) {
    return null;
  }

  return <ProgressionComponent />;
};

const mapStateToProps = ({navigation}: StoreState): ConnectedStateToProps => ({
  isHidden: navigation.isHidden
});

export default connect(mapStateToProps)(Progression);
