import * as React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {WebView} from 'react-native-webview';

import Screen from '../components/screen';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';

export type Params = {
  url: string;
};

// type Props = NavigationScreenProps<Params>;

const styles = StyleSheet.create({
  browser: {
    flex: 1,
  },
});

const Browser = (props: Props) => {
  const {url} = props.route.params;
  return (
    <Screen noSafeArea noScroll testID="browser-screen">
      <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
      <WebView source={{uri: url}} originWhitelist={['*']} style={styles.browser} />
    </Screen>
  );
};

export default React.memo(Browser);
