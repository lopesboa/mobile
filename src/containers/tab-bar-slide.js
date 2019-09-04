// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import type {_BottomTabBarProps, TabScene} from 'react-navigation';
import {hasSeenLesson, getCurrentSlide} from '@coorpacademy/player-store';

import {getCurrentScreenName, getCurrentTabName, getContext} from '../redux/utils/state-extract';
import type {StoreState} from '../redux/store';
import theme from '../modules/theme';
import Text from '../components/text';
import PlaceholderCircle from '../components/placeholder-circle';
import PlaceholderLine from '../components/placeholder-line';
import translations from '../translations';
import TabBar from './tab-bar';
import Notification, {DEFAULT_HEIGHT} from './notification-animated';

type ConnectedStateToProps = {|
  isFocused: boolean,
  isSwitchDisabled: boolean,
  isLoading: boolean,
  hasClue: boolean,
  hasContext: boolean,
  hasLesson: boolean,
  hasNewLesson: boolean
|};

type Props = {|
  ...ConnectedStateToProps,
  ...$Exact<_BottomTabBarProps>
|};

const INACTIVE_COLOR = theme.colors.gray.lightMedium;
const PLACEHOLDER_COLOR = theme.colors.gray.light;

const styles = StyleSheet.create({
  inactiveText: {
    color: INACTIVE_COLOR,
    textAlign: 'center'
  },
  notification: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: '50%',
    bottom: 0,
    paddingVertical: theme.spacing.tiny,
    paddingHorizontal: DEFAULT_HEIGHT / 2
  },
  hidden: {
    display: 'none'
  }
});

class TabBarSlide extends React.Component<Props> {
  props: Props;

  componentDidMount() {
    this.switchTab();
  }

  componentDidUpdate(prevProps: Props) {
    const {hasContext, isFocused, isSwitchDisabled} = this.props;

    const hasContextChanged = prevProps.hasContext !== hasContext;
    const hasFocusChanged = prevProps.isFocused !== isFocused;

    if (isFocused && !isSwitchDisabled && (hasContextChanged || hasFocusChanged)) {
      this.switchTab();
    }
  }

  switchTab = () => {
    const {hasContext} = this.props;

    if (hasContext) {
      this.props.navigation.navigate('Context');
    } else {
      this.props.navigation.navigate('Question');
    }
  };

  handleTabPress = (scene: TabScene) => {
    const {onTabPress, hasClue, hasLesson} = this.props;

    if (
      (scene.route.routeName === 'Clue' && !hasClue) ||
      (scene.route.routeName === 'Lesson' && !hasLesson)
    ) {
      return;
    }

    return onTabPress(scene);
  };

  renderIcon = (scene: TabScene) => {
    const {renderIcon, hasClue, hasLesson, isLoading} = this.props;

    if (isLoading) {
      return <PlaceholderCircle width={20} color={PLACEHOLDER_COLOR} />;
    }

    if ((scene.route.key === 'Clue' && !hasClue) || (scene.route.key === 'Lesson' && !hasLesson)) {
      return renderIcon({
        ...scene,
        tintColor: INACTIVE_COLOR
      });
    }

    return renderIcon(scene);
  };

  getButtonComponent = (scene: TabScene) => {
    const {getButtonComponent, hasContext} = this.props;
    const HiddenView = () => <View style={styles.hidden} />;

    if (scene.route.key === 'Context' && !hasContext) {
      // $FlowFixMe dont understand why it cries
      return HiddenView;
    }

    return getButtonComponent(scene);
  };

  getLabelText = (scene: TabScene) => ({tintColor}) => {
    const {getLabelText, labelStyle, hasClue, hasLesson, hasNewLesson, isLoading} = this.props;

    if (isLoading) {
      return <PlaceholderLine width={40} color={PLACEHOLDER_COLOR} size="small" />;
    }

    const labelKey = getLabelText(scene);

    if (!labelKey) {
      return null;
    }

    // $FlowFixMe Cannot access computed property
    const labelText = translations[labelKey];

    if ((scene.route.key === 'Clue' && !hasClue) || (scene.route.key === 'Lesson' && !hasLesson)) {
      return <Text style={[labelStyle, styles.inactiveText]}>{labelText}</Text>;
    }

    // hack: we have to render it next to label to handle Android overflow
    if (scene.route.key === 'Lesson' && hasNewLesson) {
      return (
        <React.Fragment>
          <Text style={[labelStyle, {color: tintColor}]}>{labelText}</Text>
          <Notification testID="lesson-notification" style={styles.notification} />
        </React.Fragment>
      );
    }

    return <Text style={[labelStyle, {color: tintColor}]}>{labelText}</Text>;
  };

  render() {
    const {
      navigation,
      /* eslint-disable no-unused-vars */
      isFocused,
      isSwitchDisabled,
      isLoading,
      hasClue,
      hasContext,
      hasLesson,
      hasNewLesson,
      /* eslint-enable no-unused-vars */
      ...props
    } = this.props;

    return (
      <TabBar
        {...props}
        navigation={navigation}
        onTabPress={this.handleTabPress}
        onTabLongPress={this.handleTabPress}
        renderIcon={this.renderIcon}
        getButtonComponent={this.getButtonComponent}
        getLabelText={this.getLabelText}
      />
    );
  }
}

const mapStateToProps = (state: StoreState): ConnectedStateToProps => {
  const currentScreenName = getCurrentScreenName(state);
  const currentTabName = getCurrentTabName(state);
  const slide = getCurrentSlide(state);
  const context = getContext(state);
  // $FlowFixMe overrided type
  const resources: Array<LessonType> = (slide && slide.lessons) || [];

  return {
    isFocused: currentScreenName === 'Slide',
    isSwitchDisabled: !['Context', 'Question'].includes(currentTabName),
    isLoading: !slide,
    hasClue: Boolean(slide && slide.clue),
    hasLesson: resources.length > 0,
    hasContext: context !== undefined,
    hasNewLesson: !hasSeenLesson(state)
  };
};

export default connect(mapStateToProps)(TabBarSlide);
