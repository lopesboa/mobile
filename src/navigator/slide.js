// @flow

import {StyleSheet} from 'react-native';
import {createBottomTabNavigator, createStackNavigator} from 'react-navigation';

import TabBar from '../containers/tab-bar';
import theme from '../modules/theme';
import CorrectionScreen from '../screens/correction';
import LevelEndScreen from '../screens/level-end';
import QuestionScreen from '../screens/question';
import LessonScreen from '../screens/lesson';
import ClueScreen from '../screens/clue';

import navigationOptions, {navigationOptionsWithoutHeader} from './navigation-options';

export const slideTabsNavigator = createBottomTabNavigator(
  {
    Question: {
      screen: QuestionScreen,
      navigationOptions: {
        tabBarLabel: 'Question'
      }
    },
    Lesson: {
      screen: LessonScreen,
      navigationOptions: {
        tabBarLabel: 'Lesson'
      }
    },
    Clue: {
      screen: ClueScreen,
      navigationOptions: {
        tabBarLabel: 'Clue'
      }
    }
  },
  {
    defaultNavigationOptions: navigationOptions,
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
        padding: 12
      },
      showIcon: true
    },
    // force to bottom (Android)
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarComponent: TabBar
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
