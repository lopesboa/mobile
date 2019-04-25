// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {getCurrentProgression} from '@coorpacademy/player-store';

import HeaderSlideRightComponent from '../components/header-slide-right';
import type {StoreState} from '../redux/store';
import {getLives} from '../redux/utils/state-extract';
import {toggleGodMode} from '../redux/actions/godmode';

type ConnectedStateProps = {|
  hide: boolean,
  count: number,
  isGodMode: boolean
|};

type ToggleGodMode = () => void;

type DispatchProps = {|
  toggleGodMode: () => null | ToggleGodMode
|};

type Props = {|
  ...ConnectedStateProps,
  ...DispatchProps
|};

// react-navigation needs this to be a class
// eslint-disable-next-line react/prefer-stateless-function
class HeaderSlideRight extends React.Component<Props> {
  props: Props;

  handleGodModeToggle = () => {
    const toggleFn = this.props.toggleGodMode();
    if (typeof toggleFn !== 'object') {
      return () => {
        return toggleFn && toggleFn();
      };
    }
    return null;
  };

  render() {
    const {hide, count, isGodMode} = this.props;

    if (hide) {
      return null;
    }

    return (
      <HeaderSlideRightComponent
        isGodMode={isGodMode}
        count={count}
        onGodModeToggle={this.handleGodModeToggle()}
      />
    );
  }
}

const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const progression = getCurrentProgression(state);
  const isGodMode = state.godmode;
  if (!progression) {
    return {hide: true, count: 0, isGodMode};
  }
  const {hide, count} = getLives(state);
  return {
    isGodMode,
    hide,
    count
  };
};

export default connect(
  mapStateToProps,
  {toggleGodMode}
)(HeaderSlideRight);
