// @flow

import * as React from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import type {_BottomTabBarProps, TabScene} from 'react-navigation';
import {getCurrentSlide} from '@coorpacademy/player-store';

import type {StoreState} from '../redux/store';
import theme from '../modules/theme';
import Text from '../components/text';
import TabBar from './tab-bar';

type ConnectedStateToProps = {|
  hasNoClue: boolean,
  hasNoContext: boolean,
  hasNoLesson: boolean
|};

type Props = {|
  ...ConnectedStateToProps,
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
    const {onTabPress, hasNoClue, hasNoContext, hasNoLesson} = this.props;

    if (
      (scene.route.routeName === 'Clue' && hasNoClue) ||
      (scene.route.routeName === 'Context' && hasNoContext) ||
      (scene.route.routeName === 'Lesson' && hasNoLesson)
    ) {
      return;
    }

    return onTabPress(scene);
  };

  renderIcon = (scene: TabScene) => {
    const {renderIcon, hasNoClue, hasNoContext, hasNoLesson} = this.props;

    if (
      (scene.route.key === 'Clue' && hasNoClue) ||
      (scene.route.key === 'Context' && hasNoContext) ||
      (scene.route.key === 'Lesson' && hasNoLesson)
    ) {
      return renderIcon({
        ...scene,
        tintColor: INACTIVE_COLOR
      });
    }

    return renderIcon(scene);
  };

  getLabelText = (scene: TabScene) => {
    const {getLabelText, labelStyle, hasNoClue, hasNoContext, hasNoLesson} = this.props;

    if (
      (scene.route.key === 'Clue' && hasNoClue) ||
      (scene.route.key === 'Context' && hasNoContext) ||
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
        getLabelText={this.getLabelText}
      />
    );
  }
}

const mapStateToProps = (state: StoreState): ConnectedStateToProps => {
  const slide = getCurrentSlide(state);
  // $FlowFixMe overrided type
  const resources: Array<LessonType> = (slide && slide.lessons) || [];

  return {
    hasNoClue: !(slide && slide.clue),
    hasNoLesson: !resources.length,
    hasNoContext: !(slide && slide.context && slide.context.title)
  };
};

export default connect(mapStateToProps)(TabBarSlide);
