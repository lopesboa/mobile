import * as React from 'react';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NovaCompositionCoorpacademyFilterVideo2 as LessonIcon,
  NovaCompositionCoorpacademyClue as ClueIcon,
  NovaCompositionCoorpacademyListBullets3 as QuestionIcon,
  NovaCompositionCoorpacademyMap as ContextIcon,
} from '@coorpacademy/nova-icons';
import DeviceInfo from 'react-native-device-info';

import TabBarSlide from '../containers/tab-bar-slide';
import theme from '../modules/theme';
import QuestionScreen from '../screens/question';
import LessonScreen from '../screens/lesson';
import ClueScreen from '../screens/clue';
import ContextScreen from '../screens/context';
import {getContext} from '../redux/utils/state-extract';

import navigationOptions from './navigation-options';

interface NavigationTabBarIconArgs {
  tintColor: string;
}

const styles = StyleSheet.create({
  contextIcon: {
    width: 24,
    height: 24,
  },
  questionIcon: {
    width: 23,
    height: 23,
  },
  lessonIcon: {
    width: 20,
    height: 20,
  },
  clueIcon: {
    width: 24,
    height: 24,
  },
});

const Stack = createStackNavigator();
const BottomTabs = createBottomTabNavigator();

function SlideTabsNavigator({hasContext}) {
  return (
    <BottomTabs.Navigator
      initialRouteName={hasContext ? 'Context' : 'Question'}
      tabBar={(props) => <TabBarSlide {...props} />}
      screenOptions={{
        ...navigationOptions,
        tabBarTestID: 'slide-tab',
        gestureEnabled: true,
        tabBarOptions: {
          inactiveTintColor: theme.colors.gray.dark,
          // this is dynamic and handled by our custom tab-bar component
          // activeTintColor: theme.color.primary,
          labelStyle: {
            fontWeight: theme.fontWeight.semiBold,
            fontSize: 12,
            // specific style on tablet to not break style on small devices (ex: iphone 5s)
            paddingHorizontal: DeviceInfo.isTablet() ? theme.spacing.small : 0,
          },
          tabStyle: {
            alignItems: 'center',
            paddingTop: theme.spacing.tiny,
          },
          style: {
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.colors.border,
            backgroundColor: '#FBFBFB',
            height: 60,
            paddingHorizontal: theme.spacing.tiny,
            paddingBottom: theme.spacing.tiny,
          },
          showIcon: true,
        },
        // force to bottom (Android)
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        tabBarComponent: TabBarSlide,
      }}
    >
      <BottomTabs.Screen
        name="Context"
        component={ContextScreen}
        options={{
          tabBarLabel: 'context',
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({color}: NavigationTabBarIconArgs) => (
            <ContextIcon color={color} style={styles.contextIcon} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Question"
        component={QuestionScreen}
        options={{
          tabBarLabel: 'question',
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({color}: NavigationTabBarIconArgs) => (
            <QuestionIcon color={color} style={styles.questionIcon} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Lesson"
        component={LessonScreen}
        options={{
          tabBarLabel: 'lesson',
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({color}: NavigationTabBarIconArgs) => (
            <LessonIcon color={color} style={styles.lessonIcon} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Clue"
        component={ClueScreen}
        options={{
          tabBarLabel: 'clue',
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({color}: NavigationTabBarIconArgs) => (
            <ClueIcon color={color} style={styles.clueIcon} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

const mapStateToProps = (state: StoreState): ConnectedStateToProps => {
  const context = getContext(state);

  return {
    hasContext: context !== undefined,
  };
};

const SlideTabsNavigator_ = connect(mapStateToProps)(SlideTabsNavigator);

function SlidesNavigator(): React.ReactNode {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen name="Tabs" component={SlideTabsNavigator_} />
    </Stack.Navigator>
  );
}

export default SlidesNavigator;
