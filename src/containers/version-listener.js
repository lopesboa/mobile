// @flow

import * as React from 'react';
import {Alert, AppState as AppStateBase, Linking} from 'react-native';

import {APP_STATE} from '../const';
import type {AppState} from '../types';
import translations from '../translations';
import {needUpgrade, getStoreUri} from '../modules/store';

type Props = {||};

type State = {|
  appState?: ?AppState
|};

class VersionListener extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    // $FlowFixMe the base type is weak
    appState: AppStateBase.currentState
  };

  needUpgrade: boolean;

  alertVisible: boolean;

  async componentDidMount() {
    AppStateBase.addEventListener('change', this.handleAppStateChange);
    await this.checkUpgrade();
  }

  componentWillUnmount() {
    AppStateBase.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (appState: AppState) => {
    if (
      this.state.appState &&
      [APP_STATE.BACKGROUND].includes(this.state.appState) &&
      appState === APP_STATE.ACTIVE
    ) {
      this.checkUpgrade();
    }
    this.setState({
      appState
    });
  };

  checkUpgrade = async () => {
    if (this.needUpgrade === undefined) {
      this.needUpgrade = await needUpgrade();
    }

    if (this.needUpgrade && !this.alertVisible) {
      const uri = await getStoreUri();
      this.alertVisible = true;
      Alert.alert(translations.upgrade, translations.upgradeDescription, [
        {
          text: translations.ok,
          onPress: () => {
            this.alertVisible = false;
            Linking.openURL(uri);
          }
        }
      ]);
    }
  };

  render() {
    return null;
  }
}

export default VersionListener;
