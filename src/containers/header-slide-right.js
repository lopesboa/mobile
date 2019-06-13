// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {getCurrentProgression} from '@coorpacademy/player-store';

import HeaderSlideRightComponent from '../components/header-slide-right';
import type {StoreState} from '../redux/store';
import {getLives} from '../redux/utils/state-extract';
import {toggleGodMode} from '../redux/actions/godmode';
import {toggleFastSlide} from '../redux/actions/fastslide';

type ConnectedStateProps = {|
  hide: boolean,
  count: number,
  isGodModeActivated: boolean,
  isFastSlideActivated: boolean
|};

type ToggleFn = () => void;

type DispatchProps = {|
  toggleGodMode: () => null | ToggleFn,
  toggleFastSlide: () => null | ToggleFn
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

  handleFastSlideToggle = () => {
    const toggleFn = this.props.toggleFastSlide();
    if (typeof toggleFn !== 'object') {
      return () => {
        return toggleFn && toggleFn();
      };
    }
    return null;
  };

  render() {
    const {hide, count, isGodModeActivated, isFastSlideActivated} = this.props;

    if (hide) {
      return null;
    }

    return (
      <HeaderSlideRightComponent
        isGodModeActivated={isGodModeActivated}
        isFastSlideActivated={isFastSlideActivated}
        count={count}
        onGodModeToggle={this.handleGodModeToggle()}
        onFastSlideToggle={this.handleFastSlideToggle()}
      />
    );
  }
}

const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const progression = getCurrentProgression(state);
  const isGodModeActivated = state.godmode;
  const isFastSlideActivated = state.fastSlide;
  if (!progression) {
    return {hide: true, count: 0, isGodModeActivated, isFastSlideActivated};
  }
  const {hide, count} = getLives(state);
  return {
    isGodModeActivated,
    isFastSlideActivated,
    hide,
    count
  };
};

export default connect(
  mapStateToProps,
  {toggleGodMode, toggleFastSlide}
)(HeaderSlideRight);
