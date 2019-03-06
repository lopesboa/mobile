// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {getNbSlides} from '@coorpacademy/player-store';

import ProgressionComponent from '../components/progression';
import type {StoreState} from '../redux/store';
import {getCurrentStep} from '../redux/utils/state-extract';

type ConnectedStateProps = {|
  isHidden: boolean,
  current?: number,
  count?: number
|};

type Props = {|
  ...ConnectedStateProps
|};

const Progression = ({isHidden, current, count}: Props) => {
  if (isHidden || !current || !count) {
    return null;
  }

  return <ProgressionComponent current={current} count={count} />;
};

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  isHidden: state.navigation.isHidden,
  current: getCurrentStep(state),
  count: getNbSlides(state)
});

export default connect(mapStateToProps)(Progression);
