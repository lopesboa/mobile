/* eslint-disable import/max-dependencies */
import 'react-native-gesture-handler';
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
import Navigator from './navigator';
import BrandThemeProvider from './components/brand-theme-provider';
import UserProvider from './components/user-provider';
import Loader from './components/loader';
import VersionListener from './containers/version-listener';
import AppSessionListener from './containers/app-focus-listener';
import VideoFullscreenListener from './containers/video-fullscreen-listener';
import ConnectionListener from './containers/connection-listener';
import createDataLayer from './layer/data';
import createServices from './services';
import createStore from './redux';

const dataLayer = createDataLayer();

const services = createServices(dataLayer);

// @ts-ignore
const {store, persistor} = createStore(services);

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

class App extends React.PureComponent {
  constructor(props: any) {
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
    orientation.lockToPortrait();
    // @@todo wait for support tablet landscape orientation
    // if (DeviceInfo.isTablet()) {
    //   orientation.unlockAllOrientations();
    // }
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
