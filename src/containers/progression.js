// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {getCurrentProgression, getNbSlides} from '@coorpacademy/player-store';

import ProgressionComponent from '../components/progression';
import type {StoreState} from '../redux/store';

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

export const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const progression = getCurrentProgression(state);

  return {
    isHidden: state.navigation.isHidden,
    current: progression && progression.state && progression.state.step.current,
    count: getNbSlides(state)
  };
};

export default connect(mapStateToProps)(Progression);
