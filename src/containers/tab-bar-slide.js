// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import type {_BottomTabBarProps, TabScene} from 'react-navigation';
import {getCurrentSlide} from '@coorpacademy/player-store';
import type {StoreState} from '../redux/store';
import theme from '../modules/theme';
import TabBar from './tab-bar';

type ConnectedStateToProps = {|
  hasNoClue: boolean,
  hasNoContext: boolean
|};

type Props = {|
  ...ConnectedStateToProps,
  ...$Exact<_BottomTabBarProps>
|};

class TabBarSlide extends React.Component<Props> {
  props: Props;

  componentWillMount() {
    if (!this.props.hasNoContext) {
      this.props.navigation.navigate('Context');
    }
  }

  componentDidUpdate(prevProps: Props) {
    const contextHasChanged =
      !this.props.hasNoContext && this.props.hasNoContext !== prevProps.hasNoContext;

    if (contextHasChanged) {
      this.props.navigation.navigate('Context');
    }
  }

  handleTabPress = (scene: TabScene) => {
    // $FlowFixMe the definition is incomplete for this
    const {onTabPress, hasNoClue, hasNoContext} = this.props;
    if (scene.route.routeName === 'Clue' && hasNoClue) {
      return;
    }

    if (scene.route.routeName === 'Context' && hasNoContext) {
      return;
    }

    return onTabPress(scene);
  };

  renderIcon = (scene: TabScene) => {
    const {renderIcon, hasNoClue, hasNoContext} = this.props;
    switch (scene.route.key) {
      case 'Context':
        return renderIcon({
          ...scene,
          tintColor: hasNoContext ? theme.colors.gray.medium : scene.tintColor
        });
      case 'Clue':
        return renderIcon({
          ...scene,
          tintColor: hasNoClue ? theme.colors.gray.medium : scene.tintColor
        });
      default:
        return renderIcon(scene);
    }
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

  const hasNoClue = !(slide && slide.clue);

  const hasNoContext = !(slide && slide.context && slide.context.title);

  return {
    hasNoClue,
    hasNoContext
  };
};

export default connect(mapStateToProps)(TabBarSlide);
