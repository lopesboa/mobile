// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import type {_BottomTabBarProps, TabScene} from 'react-navigation';
import {getRoute, selectRoute} from '@coorpacademy/player-store';

import {getSlide} from '../redux/utils/state-extract';
import type {StoreState} from '../redux/store';
import theme from '../modules/theme';
import Text from '../components/text';
import TabBar from './tab-bar';

type ConnectedStateToProps = {|
  hasNoClue: boolean,
  hasNoContext: boolean,
  hasNoLesson: boolean,
  showContext: boolean
|};

type ConnectedDispatchProps = {|
  selectRoute: typeof selectRoute
|};

type Props = {|
  ...ConnectedStateToProps,
  ...ConnectedDispatchProps,
  ...$Exact<_BottomTabBarProps>
|};

const INACTIVE_COLOR = theme.colors.gray.lightMedium;

const styles = StyleSheet.create({
  inactiveText: {
    color: INACTIVE_COLOR
  }
});

class TabBarSlide extends React.Component<Props> {
  props: Props;

  componentDidUpdate(prevProps: Props) {
    if (this.props.showContext) {
      this.props.navigation.navigate('Context');
    }
  }

  handleTabPress = (scene: TabScene) => {
    const {onTabPress, hasNoClue, hasNoLesson} = this.props;

    if (
      (scene.route.routeName === 'Clue' && hasNoClue) ||
      (scene.route.routeName === 'Lesson' && hasNoLesson)
    ) {
      return;
    }

    let route;
    switch (scene.route.routeName) {
      case 'Context':
        route = 'context';
        break;
      case 'Clue':
        route = 'clue';
        break;
      case 'Lesson':
        route = 'media';
        break;
      case 'Question':
      default:
        route = 'answer';
        break;
    }

    this.props.selectRoute(route);

    return onTabPress(scene);
  };

  renderIcon = (scene: TabScene) => {
    const {renderIcon, hasNoClue, hasNoLesson} = this.props;

    if (
      (scene.route.key === 'Clue' && hasNoClue) ||
      (scene.route.key === 'Lesson' && hasNoLesson)
    ) {
      return renderIcon({
        ...scene,
        tintColor: INACTIVE_COLOR
      });
    }

    return renderIcon(scene);
  };

  getButtonComponent = (scene: TabScene) => {
    const {getButtonComponent, hasNoContext} = this.props;
    const HiddenView = () => <View style={{display: 'none'}} />;
    if (scene.route.key === 'Context' && hasNoContext) {
      return HiddenView;
    }
    return getButtonComponent(scene);
  };

  getLabelText = (scene: TabScene) => {
    const {getLabelText, labelStyle, hasNoClue, hasNoLesson} = this.props;

    if (
      (scene.route.key === 'Clue' && hasNoClue) ||
      (scene.route.key === 'Lesson' && hasNoLesson)
    ) {
      return <Text style={[labelStyle, styles.inactiveText]}>{getLabelText(scene)}</Text>;
    }

    return getLabelText(scene);
  };

  render() {
    const {navigation, ...props} = this.props;
    return (
      <TabBar
        {...props}
        navigation={navigation}
        onTabPress={this.handleTabPress}
        renderIcon={this.renderIcon}
        getButtonComponent={this.getButtonComponent}
        getLabelText={this.getLabelText}
      />
    );
  }
}

const mapStateToProps = (state: StoreState): ConnectedStateToProps => {
  const slide = getSlide(state);
  // $FlowFixMe overrided type
  const resources: Array<LessonType> = (slide && slide.lessons) || [];

  const currentRoute = getRoute(state);
  const showContext = currentRoute === 'context';

  return {
    hasNoClue: !(slide && slide.clue),
    hasNoLesson: !resources.length,
    hasNoContext: !(slide && slide.context && slide.context.title),
    showContext
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  selectRoute
};

export default connect(mapStateToProps, mapDispatchToProps)(TabBarSlide);
