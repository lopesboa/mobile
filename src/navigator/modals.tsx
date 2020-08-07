import * as React from 'react';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import CorrectionScreen from '../screens/correction';
import LevelEndScreen from '../screens/level-end';
import NotifyMeScreen from '../screens/notifications';
import PdfHeader from '../containers/pdf-header';
import BrowserHeader from '../containers/browser-header';
import QRCodeScreen from '../screens/qr-code';
import theme from '../modules/theme';
import PdfScreen from '../screens/pdf';
import BrowserScreen from '../screens/browser';

import navigationOptions from './navigation-options';

const Stack = createStackNavigator();

export default function WithoutHeaderModalsNavigator(): React.ReactNode {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen name="Correction" component={CorrectionScreen} options={{headerShown: false}} />
      <Stack.Screen
        name="LevelEnd"
        component={LevelEndScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen name="QRCode" component={QRCodeScreen} options={{headerShown: false}} />
      <Stack.Screen
        name="Pdf"
        component={PdfScreen}
        options={{
          ...navigationOptions,
          headerTitleStyle: {
            ...navigationOptions.headerTitleStyle,
            color: theme.colors.gray.dark,
          },
          header: PdfHeader,
        }}
      />
      <Stack.Screen
        name="Browser"
        component={BrowserScreen}
        options={{
          ...navigationOptions,
          headerTitleStyle: {
            ...navigationOptions.headerTitleStyle,
            color: theme.colors.gray.dark,
          },
          header: BrowserHeader,
        }}
      />
      <Stack.Screen name="NotifyMe" component={NotifyMeScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}
