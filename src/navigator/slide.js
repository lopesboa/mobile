// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator, createStackNavigator} from 'react-navigation';
import type {NavigationStackRouterConfig} from 'react-navigation';
import {
  NovaCompositionCoorpacademyFilterVideo2 as LessonIcon,
  NovaCompositionCoorpacademyClue as ClueIcon,
  NovaCompositionCoorpacademyListBullets3 as QuestionIcon,
  NovaCompositionCoorpacademyMap as ContextIcon
} from '@coorpacademy/nova-icons';

import Progression from '../containers/progression';
import TabBarSlide from '../containers/tab-bar-slide';
import theme from '../modules/theme';
import translations from '../translations';
import CorrectionScreen from '../screens/correction';
import LevelEndScreen from '../screens/level-end';
import QuestionScreen from '../screens/question';
import LessonScreen from '../screens/lesson';
import ClueScreen from '../screens/clue';
import ContextScreen from '../screens/context';

import navigationOptions, {navigationOptionsWithoutHeader} from './navigation-options';

type NavigationTabBarIconArgs = {|tintColor: string|};

const styles = StyleSheet.create({
  questionIcon: {
    width: 23,
    height: 23
  },
  lessonIcon: {
    width: 20,
    height: 20
  },
  clueIcon: {
    width: 24,
    height: 24
  }
});

const slideTabsNavigator = createBottomTabNavigator(
  {
    Context: {
      screen: ContextScreen,
      navigationOptions: {
        tabBarLabel: translations.context,
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({tintColor}: NavigationTabBarIconArgs) => (
          <ContextIcon color={tintColor} style={styles.clueIcon} />
        )
      }
    },
    Question: {
      screen: QuestionScreen,
      navigationOptions: {
        tabBarLabel: translations.question,
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({tintColor}: NavigationTabBarIconArgs) => (
          <QuestionIcon color={tintColor} style={styles.questionIcon} />
        )
      }
    },
    Lesson: {
      screen: LessonScreen,
      navigationOptions: {
        tabBarLabel: translations.lesson,
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({tintColor}: NavigationTabBarIconArgs) => (
          <LessonIcon color={tintColor} style={styles.lessonIcon} />
        )
      }
    },
    Clue: {
      screen: ClueScreen,
      navigationOptions: {
        tabBarLabel: translations.clue,
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({tintColor}: NavigationTabBarIconArgs) => (
          <ClueIcon color={tintColor} style={styles.clueIcon} />
        )
      }
    }
  },
  {
    defaultNavigationOptions: {
      ...navigationOptions,
      tabBarTestID: 'slide-tab'
    },
    tabBarOptions: {
      inactiveTintColor: theme.colors.gray.dark,
      // this is dynamic and handled by our custom tab-bar component
      // activeTintColor: theme.color.primary,
      labelStyle: {
        fontWeight: theme.fontWeight.semiBold,
        fontSize: 12
      },
      style: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#B2B3B4',
        backgroundColor: '#FBFBFB',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        elevation: 2,
        height: 60,
        padding: theme.spacing.tiny
      },
      showIcon: true
    },
    initialRouteName: 'Question',
    // force to bottom (Android)
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarComponent: TabBarSlide
  }
);

const ProgressionHeader = ({defaultNavigationOptions}: NavigationStackRouterConfig) => (
  <View style={defaultNavigationOptions && defaultNavigationOptions.headerStyle}>
    <Progression />
  </View>
);

export const slideNavigator = createStackNavigator(
  {
    Tabs: {screen: slideTabsNavigator}
  },
  {
    defaultNavigationOptions: {
      ...navigationOptions,
      header: ProgressionHeader,
      headerStyle: {
        position: 'absolute',
        width: '100%',
        top: 0
      }
    }
  }
);

export const slideModalsNavigator = createStackNavigator(
  {
    Correction: {screen: CorrectionScreen},
    LevelEnd: {screen: LevelEndScreen}
  },
  {
    defaultNavigationOptions: navigationOptionsWithoutHeader
  }
);
