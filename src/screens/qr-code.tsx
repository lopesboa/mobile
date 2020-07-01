import * as React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {createSelector} from 'reselect';
import {NavigationActions, NavigationEvents, NavigationScreenProps} from 'react-navigation';
import {connect} from 'react-redux';

import QRCodeScanner from '../components/qr-code-scanner';
import type {Props as QRCodeScannerProps} from '../components/qr-code-scanner';
import Screen from '../components/screen';
import Touchable from '../components/touchable';
import HeaderBackButton from '../components/header-back-button';
import theme from '../modules/theme';
import {PERMISSION_STATUS} from '../const';
import withPermissions from '../containers/with-permissions';
import {getPermissionStatus} from '../redux/utils/state-extract';
import type {WithPermissionsProps} from '../containers/with-permissions';
import translations from '../translations';
import {__DEV__, __E2E__, __TEST__} from '../modules/environment';
import {devToken} from '../../app';

export type Params = {
  onScan: Pick<QRCodeScannerProps, 'onScan'>;
};

export interface ConnectedStateProps {
  hasPermission: boolean;
}

interface Props extends NavigationScreenProps<Params>, ConnectedStateProps, WithPermissionsProps {}

const styles = StyleSheet.create({
  fakeScanArea: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

class QRCodeScreen extends React.PureComponent<Props> {
  handleClose = () => {
    const {navigation} = this.props;
    navigation.dispatch(NavigationActions.back());
  };

  handleDidFocus = () =>
    this.props.requestCameraPermission(translations.permissionCamera, this.handleClose);

  handleFakeScan = () => {
    const {onScan} = this.props.navigation.state.params;
    onScan(devToken);
  };

  render() {
    const {hasPermission} = this.props;
    const {onScan} = this.props.navigation.state.params;

    return (
      <Screen testID="qr-code-screen" noSafeArea noScroll>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.black} translucent />
        <NavigationEvents onDidFocus={this.handleDidFocus} testID="qr-code-navigation-events" />
        <QRCodeScanner onScan={onScan} hasPermission={hasPermission} testID="qr-code-scanner" />
        {__DEV__ || __E2E__ || __TEST__ ? (
          <Touchable
            onLongPress={this.handleFakeScan}
            style={styles.fakeScanArea}
            analyticsID="qr-code-area"
            testID="qr-code-area"
          />
        ) : null}
        <HeaderBackButton type="close" onPress={this.handleClose} testID="qr-code-button-close" />
      </Screen>
    );
  }
}

const getHasPermissionState: (state: StoreState) => boolean = createSelector(
  [getPermissionStatus('camera')],
  (permission) => permission === PERMISSION_STATUS.GRANTED,
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  hasPermission: getHasPermissionState(state),
});

export {QRCodeScreen as Component};
export default connect(mapStateToProps)(withPermissions(QRCodeScreen, ['camera']));
