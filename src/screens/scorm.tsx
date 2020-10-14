import * as React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import AsyncStorage from '@react-native-community/async-storage';
import {WebView} from 'react-native-webview';
import decode from 'jwt-decode';

import {buildUrlQueryParams} from '../modules/uri';
import {getBrand, getToken} from '../redux/utils/state-extract';
import fetch from '../modules/fetch';

import Screen from '../components/screen';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import {INJECTED_JAVASCRIPT} from './scorm-script';

export type Params = {
  url: string;
};

// TODO:
// 1 - On card click, if it's an external-content, directly send the progression to the server

// Just for the POC
// 2 - Get Redirection Url with login token
// 2.2 - Load this URL in the webview.
// 2.3 - Add UI (header / finish-course button)
// 3 - Map finish-course button
// 4 - fetch progression and exit node
// 5 - navigate to level-end with appropriate content

// type Props = NavigationScreenProps<Params>;

const styles = StyleSheet.create({
  browser: {
    flex: 1,
  },
});

async function getOneShotScormUrl(host, contentRef, userId, token) {
  const queryParams = buildUrlQueryParams({redirectTo: `/externalContent/${contentRef}`});
  const ONE_LOGIN_TOKEN_URL = `/api/v1/users/${userId}/login-token?${queryParams}`;
  const response = await fetch(host + ONE_LOGIN_TOKEN_URL, {
    headers: {
      authorization: token,
    },
    method: 'POST',
  });
  const url = await response.json();
  return url.loginUrl;
}

const Scorm = (props: Props) => {
  const {user: userId} = decode(props.token);
  const webView = React.useRef(null);
  const [url, updateUrl] = React.useState('');
  const {itemRef} = props.route.params;
  console.log({props, itemRef});

  React.useEffect(() => {
    getOneShotScormUrl(props.brand.host, itemRef, userId, props.token).then((loginUrl) =>
      updateUrl(loginUrl),
    );
  }, []);

  return (
    <Screen noSafeArea noScroll testID="browser-screen">
      <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
      <WebView
        ref={webView}
        style={{flex: 1, height: 300}}
        source={{uri: url}}
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        useWebKit
        style={styles.browser}
      />
    </Screen>
  );
};

const getBrandState = createSelector([getBrand], (brand) => brand);

export const mapStateToProps = (state) => ({
  brand: getBrandState(state),
  token: getToken(state),
});

export default connect(mapStateToProps, {})(React.memo(Scorm));
