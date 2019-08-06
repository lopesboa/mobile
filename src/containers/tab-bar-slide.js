// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import type {_BottomTabBarProps, TabScene} from 'react-navigation';
import {getRoute, selectRoute, hasSeenLesson} from '@coorpacademy/player-store';

import {checkIsValidating, getSlide} from '../redux/utils/state-extract';
import type {StoreState} from '../redux/store';
import theme from '../modules/theme';
import Text from '../components/text';
import PlaceholderCircle from '../components/placeholder-circle';
import PlaceholderLine from '../components/placeholder-line';
import translations from '../translations';
import TabBar from './tab-bar';
import Notification, {DEFAULT_HEIGHT} from './notification-animated';

type ConnectedStateToProps = {|
  isValidating: boolean,
  hasNoClue: boolean,
  isLoading: boolean,
  hasNoContext: boolean,
  hasNoLesson: boolean,
  hasNewLesson: boolean,
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

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.showContext && this.props.showContext) {
      this.props.navigation.navigate('Context');
    }
  }

  handleTabPress = (scene: TabScene) => {
    const {isValidating, onTabPress, hasNoClue, hasNoLesson} = this.props;
    if (isValidating) {
      return;
    }

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
    const {renderIcon, hasNoClue, hasNoLesson, isLoading} = this.props;

    if (isLoading) {
      return <PlaceholderCircle width={20} color={PLACEHOLDER_COLOR} />;
    }

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
    const HiddenView = () => <View style={styles.hidden} />;

    if (scene.route.key === 'Context' && hasNoContext) {
      // $FlowFixMe dont understand why it cries
      return HiddenView;
    }

    return getButtonComponent(scene);
  };

  getLabelText = (scene: TabScene) => ({tintColor}) => {
    const {getLabelText, labelStyle, hasNoClue, hasNoLesson, hasNewLesson, isLoading} = this.props;

    if (isLoading) {
      return <PlaceholderLine width={40} color={PLACEHOLDER_COLOR} size="small" />;
    }

    const labelKey = getLabelText(scene);

    if (!labelKey) {
      return null;
    }

    // $FlowFixMe Cannot access computed property
    const labelText = translations[labelKey];

    if (
      (scene.route.key === 'Clue' && hasNoClue) ||
      (scene.route.key === 'Lesson' && hasNoLesson)
    ) {
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
      hasNewLesson,
      isLoading,
      hasNoClue,
      hasNoContext,
      hasNoLesson,
      isValidating,
      selectRoute: _selectRoute,
      showContext,
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
  const slide = getSlide(state);
  // $FlowFixMe overrided type
  const resources: Array<LessonType> = (slide && slide.lessons) || [];

  const currentRoute = getRoute(state);
  const showContext = currentRoute === 'context';

  const isValidating = checkIsValidating(state);

  const isLoading = !slide;

  return {
    isValidating,
    isLoading,
    hasNoClue: !(slide && slide.clue),
    hasNoLesson: !resources.length,
    hasNoContext: !(slide && slide.context && slide.context.title),
    hasNewLesson: !hasSeenLesson(state),
    showContext
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  selectRoute
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabBarSlide);
