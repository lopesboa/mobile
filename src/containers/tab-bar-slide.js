// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import type {_BottomTabBarProps, TabScene} from 'react-navigation';
import {getCurrentSlide} from '@coorpacademy/player-store';
import type {StoreState} from '../redux/store';
import theme from '../modules/theme';
import TabBar from './tab-bar';

type ConnectedStateToProps = {|
  hasNotClue: boolean
|};

type Props = {|
  ...ConnectedStateToProps,
  ...$Exact<_BottomTabBarProps>
|};

class TabBarSlide extends React.PureComponent<Props> {
  props: Props;

  handleTabPress = (scene: TabScene) => {
    // $FlowFixMe the definition is incomplete for this
    const {onTabPress, hasNotClue} = this.props;

    if (scene.route.routeName === 'Clue' && hasNotClue) {
      return;
    }

    return onTabPress(scene);
  };

  renderIcon = (scene: TabScene) => {
    const {renderIcon, hasNotClue} = this.props;

    if (scene.route.key === 'Clue' && hasNotClue) {
      return renderIcon({
        ...scene,
        tintColor: hasNotClue ? theme.colors.gray.medium : scene.tintColor
      });
    }

    return renderIcon(scene);
  };

  render() {
    const {navigation, ...props} = this.props;

    return (
      <TabBar
        {...props}
        navigation={navigation}
        onTabPress={this.handleTabPress}
        renderIcon={this.renderIcon}
      />
    );
  }
}

const mapStateToProps = (state: StoreState): ConnectedStateToProps => {
  const slide = getCurrentSlide(state);
  const hasNotClue = !(slide && slide.clue);

  return {
    hasNotClue
  };
};

export default connect(mapStateToProps)(TabBarSlide);
