import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {hasSeenLesson, getCurrentSlide} from '@coorpacademy/player-store';

import {
  getCurrentScreenName,
  getCurrentTabName,
  getContext,
  getValidationStatus,
} from '../redux/utils/state-extract';
import type {StoreState} from '../redux/store';
import theme from '../modules/theme';
import Text from '../components/text';
import PlaceholderCircle from '../components/placeholder-circle';
import PlaceholderLine from '../components/placeholder-line';
import Touchable from '../components/touchable';
import Space from '../components/space';
import translations from '../translations';
import {BrandThemeContext} from '../components/brand-theme-provider';
import {getStatusBarHeight} from '../modules/status-bar';
import type {WithVibrationProps} from './with-vibration';
import Notification, {DEFAULT_HEIGHT} from './notification-animated';

interface ConnectedStateToProps {
  isFocused: boolean;
  isSwitchDisabled: boolean;
  isLoading: boolean;
  hasClue: boolean;
  hasContext: boolean;
  hasLesson: boolean;
  hasNewLesson: boolean;
}

interface Props extends ConnectedStateToProps, WithVibrationProps {}

const INACTIVE_COLOR = theme.colors.gray.lightMedium;
const PLACEHOLDER_COLOR = theme.colors.gray.light;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    backgroundColor: '#FBFBFB',
    height: 40 + getStatusBarHeight(),
    paddingHorizontal: 8,
  },
  touchable: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inactiveText: {
    color: INACTIVE_COLOR,
    textAlign: 'center',
  },
  notification: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: '50%',
    bottom: 0,
    paddingHorizontal: DEFAULT_HEIGHT / 2,
  },
  hidden: {
    display: 'none',
  },
});

function LabelText({style, isActive, isLoading, hasNewLesson, label, Icon, color}) {
  return (
    <React.Fragment>
      {!isLoading ? (
        <Icon color={color} />
      ) : (
        <PlaceholderCircle width={20} color={PLACEHOLDER_COLOR} />
      )}
      <Space type="tiny" />
      {!isLoading ? (
        <Text style={[style, isActive && styles.inactiveText, {color}]}>{label}</Text>
      ) : (
        <PlaceholderLine width={40} color={PLACEHOLDER_COLOR} size="small" />
      )}
      {hasNewLesson ? (
        <Notification testID="lesson-notification" style={styles.notification} />
      ) : null}
    </React.Fragment>
  );
}

function TabBBar({
  state,
  descriptors,
  navigation,
  isLoading,
  hasContext,
  hasNewLesson,
  hasClue,
  hasLesson,
}: Props) {
  const brandTheme = React.useContext(BrandThemeContext);

  React.useEffect(() => {
    if (hasContext) {
      navigation.navigate('Context');
    } else {
      navigation.navigate('Question');
    }
  }, [hasContext]);

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = options?.tabBarLabel ?? options?.title ?? route.name;
        const translatedLabel = translations[options?.tabBarLabel ?? options?.title ?? route.name];
        const Icon = options?.tabBarIcon;
        const labelStyle = options?.tabBarOptions.labelStyle;

        const isFocused = state.index === index;

        const isDisabled = (label === 'clue' && !hasClue) || (label === 'lesson' && !hasLesson);
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // const onLongPress = () => {
        //   navigation.emit({
        //     type: 'tabLongPress',
        //     target: route.key,
        //   });
        // };

        // eslint-disable-next-line no-nested-ternary
        const tintColor = isDisabled
          ? INACTIVE_COLOR
          : isFocused
          ? brandTheme?.colors.primary
          : theme.colors.gray.dark;

        if (label === 'context' && !hasContext) return null;

        return (
          <Touchable
            disabled={isDisabled}
            key={label}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            // onLongPress={onLongPress}
            style={styles.touchable}
          >
            <LabelText
              isLoading={isLoading}
              isActive={(label === 'clue' && !hasClue) || (label === 'lesson' && !hasLesson)}
              hasNewLesson={label === 'lesson' && hasNewLesson}
              label={translatedLabel}
              Icon={Icon}
              color={tintColor}
              style={labelStyle}
            />
          </Touchable>
        );
      })}
    </View>
  );
}

const mapStateToProps = (state: StoreState): ConnectedStateToProps => {
  const currentScreenName = getCurrentScreenName(state);
  const currentTabName = getCurrentTabName(state);
  const slide = getCurrentSlide(state);
  const context = getContext(state);
  const isLoading = getValidationStatus(state);
  // @ts-ignore overrided type
  const resources: Array<LessonType> = (slide && slide.lessons) || [];

  return {
    isFocused: currentScreenName === 'Slide',
    isSwitchDisabled: !['Context', 'Question'].includes(currentTabName),
    isLoading: !slide || isLoading,
    hasClue: Boolean(slide && slide.clue),
    hasLesson: resources.length > 0,
    hasContext: context !== undefined,
    hasNewLesson: !hasSeenLesson(state),
  };
};

export default connect(mapStateToProps)(TabBBar);
