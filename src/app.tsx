/* eslint-disable import/max-dependencies */
import * as React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {PortalProvider} from 'react-native-portal';
// @@todo wait for support tablet landscape orientation
// import DeviceInfo from 'react-native-device-info';
import orientation from 'react-native-orientation-locker';
import {ReduxNetworkProvider} from 'react-native-offline';
// @todo remove this lib once on react-native-firebase 6.x
import {setJSExceptionHandler, getJSExceptionHandler} from 'react-native-exception-handler';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotifications from 'react-native-push-notification';
import Navigator from './navigator';
import NavigationService from './navigator/helper';
import {selectCard} from './redux/actions/catalog/cards/select';
import BrandThemeProvider from './components/brand-theme-provider';
import UserProvider from './components/user-provider';
import Loader from './components/loader';
import VersionListener from './containers/version-listener';
import AppSessionListener from './containers/app-session-listener';
import VideoFullscreenListener from './containers/video-fullscreen-listener';
import ConnectionListener from './containers/connection-listener';
import createDataLayer from './layer/data';
import createServices from './services';
import createStore from './redux';
import type {ReduxDevTools} from './redux/_types';
import {ChapterCard, DisciplineCard} from './layer/data/_types';

const reduxDevTools: ReduxDevTools | void =
  // @ts-ignore
  window && window.__REDUX_DEVTOOLS_EXTENSION__
    ? // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

const dataLayer = createDataLayer();

const services = createServices(dataLayer);

// @ts-ignore
const {store, persistor} = createStore(services, reduxDevTools);

PushNotifications.configure({
  onRegister: function (token: string): void {
    // if you need to handle things while registering, do it here
  },

  onNotification: function (notification: {
    data: {id: string; content?: string};
    finish: (arg: unknown) => void;
  }) {
    const {data} = notification;
    const content: DisciplineCard | ChapterCard = JSON.parse(data?.content ?? '{}');
    if (!content || !content.universalRef) {
      // we do not want to do anything in here FTM
    } else {
      NavigationService.navigate('Slide');
      store.dispatch(selectCard(content));

      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: false,
  requestPermissions: false,
});

interface Props {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ENABLE_ERROR_DEBUG = false;

class App extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    const currentHandler = getJSExceptionHandler();
    setJSExceptionHandler((error, isFatal) => {
      if (!error) {
        return;
      }

      services.Logger.error(error);
      currentHandler(error, isFatal);
    }, ENABLE_ERROR_DEBUG);
  }

  componentDidMount() {
    // console.log({servicesN: services.Notifications});
    orientation.lockToPortrait();

    // Configure Notifications
    // @@todo wait for support tablet landscape orientation
    // if (DeviceInfo.isTablet()) {
    //   orientation.unlockAllOrientations();
    // }
    // PushNotifications.localNotificationSchedule({
    //   title: 'My Notification Title', // (optional)
    //   message: 'My Notification Message', // (required)});
    //   date: new Date(Date.now() + 10 * 1000), // in 60 secs
    // });
  }

  renderLoader = () => {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={this.renderLoader()} persistor={persistor}>
          <ReduxNetworkProvider pingInterval={30000} pingOnlyIfOffline>
            <PortalProvider>
              <VersionListener />
              <AppSessionListener />
              <UserProvider>
                <BrandThemeProvider>
                  <View style={styles.container}>
                    <Navigator />
                  </View>
                </BrandThemeProvider>
              </UserProvider>
              <ConnectionListener />
              {Platform.OS === 'android' ? <VideoFullscreenListener /> : null}
            </PortalProvider>
          </ReduxNetworkProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
