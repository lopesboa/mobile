// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {isContentAdaptive, getProgressionSteps} from '@coorpacademy/player-store';

import ProgressionComponent from '../components/progression';
import type {StoreState} from '../redux/store';
import {isVideoFullScreen} from '../redux/utils/state-extract';

export type ConnectedStateProps = {|
  isHidden: boolean,
  current?: number,
  total?: number
|};

type Props = {|
  ...ConnectedStateProps
|};

const Progression = ({isHidden, current, total}: Props) => {
  if (isHidden || !current || !total) {
    return null;
  }

  return <ProgressionComponent current={current} total={total} />;
};

export const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const progressionSteps = getProgressionSteps(state);
  const {current, total} = progressionSteps || {};

  return {
    isHidden: isContentAdaptive(state) || !progressionSteps || isVideoFullScreen(state),
    current,
    total
  };
};

export {Progression as Component};
export default connect(mapStateToProps)(Progression);
