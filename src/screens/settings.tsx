import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';

import Screen from '../components/screen';
import Settings from '../components/settings';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import {BackHandler} from '../modules/back-handler';
import { NavigationScreenProps } from 'react-navigation';

interface Props extends NavigationScreenProps {}

const SettingsScreen = (props: Props) => {
  function handleBackButton() {
    props.navigation.navigate('Home');
    return true;
  }

  React.useEffect(() => {
    BackHandler?.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler?.removeEventListener('hardwareBackPress', handleBackButton);
    };
  });

  function handleBackPress() {
    props.navigation.navigate('Home');
  }

  return (
    <Screen noScroll testID="settings-screen">
      <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
      <Settings
        settings={[
          {
            type: 'authorize-notifications',
            label: 'Authorize notifications',
            onPress: () => {},
            isActive: true
          },
          {type: 'new-courses', label: 'New courses', onPress: () => {}, isActive: false},
          {type: 'new-battles', label: 'New battles', onPress: () => {}, isActive: true}
        ]}
      />
    </Screen>
  );
};

export {SettingsScreen as Component};
export default connect(null)(SettingsScreen);
