// @flow

import * as React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {NavigationActions, NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';

import QRCodeScanner from '../components/qr-code-scanner';
import type {Props as QRCodeScannerProps} from '../components/qr-code-scanner';
import Screen from '../components/screen';
import Touchable from '../components/touchable';
import HeaderBackButton from '../components/header-back-button';
import theme from '../modules/theme';
import withPermissions from '../containers/with-permissions';
import {hasPermission} from '../redux/utils/state-extract';
import type {WithPermissionsProps} from '../containers/with-permissions';
import translations from '../translations';
import {__DEV__, __E2E__, DEV_TOKEN} from '../modules/environment';

export type Params = {|
  onScan: $PropertyType<QRCodeScannerProps, 'onScan'>
|};

type ConnectedStateProps = {|
  hasPermission: boolean
|};

type Props = $Exact<{|
  ...ReactNavigation$ScreenPropsWithParams<Params>,
  ...WithPermissionsProps,
  ...ConnectedStateProps
|}>;

const styles = StyleSheet.create({
  fakeScanArea: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
});

class QRCodeScreen extends React.PureComponent<Props> {
  props: Props;

  handleClose = () => {
    const {navigation} = this.props;
    navigation.dispatch(NavigationActions.back());
  };

  handleDidFocus = () =>
    this.props.requestPermission('camera', translations.permissionCamera, this.handleClose);

  handleFakeScan = () => {
    const {onScan} = this.props.navigation.state.params;
    onScan(DEV_TOKEN);
  };

  render() {
    const {onScan} = this.props.navigation.state.params;

    return (
      <Screen testID="qr-code-screen" noSafeArea noScroll>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.black} translucent />
        <NavigationEvents onDidFocus={this.handleDidFocus} />
        <QRCodeScanner onScan={onScan} hasPermission={this.props.hasPermission} />
        {(__DEV__ || __E2E__) && (
          <Touchable
            onLongPress={this.handleFakeScan}
            style={styles.fakeScanArea}
            analyticsID="qr-code-area"
          />
        )}
        <HeaderBackButton type="close" onPress={this.handleClose} testID="qr-code-button-close" />
      </Screen>
    );
  }
}

const mapStateToProps = ({permissions}: StoreState): ConnectedStateProps => ({
  hasPermission: hasPermission(permissions, 'camera')
});

export default connect(mapStateToProps)(withPermissions(QRCodeScreen, ['camera']));
