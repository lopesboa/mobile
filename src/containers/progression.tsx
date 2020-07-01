import * as React from 'react';
import {connect} from 'react-redux';
import {isContentAdaptive, getProgressionSteps} from '@coorpacademy/player-store';

import ProgressionComponent from '../components/progression';
import type {StoreState} from '../redux/store';
import {isVideoFullScreen, getValidationStatus} from '../redux/utils/state-extract';

export interface ConnectedStateProps {
  isHidden: boolean;
  current?: number;
  total?: number;
  isLoading?: boolean;
}

type Props = ConnectedStateProps;

class Progression extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const isLoading = nextProps.isLoading;
    if (isLoading) return false;
    else return true;
  }

  render() {
    const {isHidden, current, total} = this.props;

    if (isHidden || !current || !total) {
      return null;
    }

    return <ProgressionComponent current={current} total={total} />;
  }
}

export const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const progressionSteps = getProgressionSteps(state);
  const {current, total} = progressionSteps || {};

  return {
    isHidden: isContentAdaptive(state) || !progressionSteps || isVideoFullScreen(state),
    current,
    total,
    isLoading: getValidationStatus(state),
  };
};

export {Progression as Component};
export default connect(mapStateToProps)(Progression);
