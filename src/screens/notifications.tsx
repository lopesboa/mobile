import * as React from 'react';
import {StatusBar} from 'react-native';
import {createSelector} from 'reselect';
import {connect} from 'react-redux';

import Screen from '../components/screen';
import NotifyMe from '../components/notify-me';
import translations from '../translations';

import withPermissions from '../containers/with-permissions';
import type {WithPermissionsProps} from '../containers/with-permissions';

import theme from '../modules/theme';
import {PERMISSION_STATUS} from '../const';
import {getPermissionStatus} from '../redux/utils/state-extract';
import type {StoreState} from '../redux/store';

export type Params = {};

export interface ConnectedStateProps {
  hasPermission: boolean;
}

interface Props extends WithPermissionsProps, NavigationScreenProps<Params>, ConnectedStateProps {}

class NotifyMeScreen extends React.PureComponent<Props> {
  handleClose = (): void => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  handleOnLaterPress = (): void => {
    this.props.changeNotificationsPermission(PERMISSION_STATUS.MAYBE_LATER);
    this.handleClose();
  };

  handleNotifyMe = async (): Promise<void> => {
    await this.props.requestNotificationsPermission(
      translations.permissionNotificationDescription,
      this.handleClose,
    );
    this.handleClose();
  };

  render() {
    return (
      <Screen testID="notify-me-screen" noSafeArea noScroll>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.black} translucent />
        <NotifyMe onNotifyMePress={this.handleNotifyMe} onLaterPress={this.handleOnLaterPress} />
      </Screen>
    );
  }
}

const getHasPermissionState: (state: StoreState) => boolean = createSelector(
  [getPermissionStatus('notifications')],
  (permission) => permission === PERMISSION_STATUS.GRANTED,
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  hasPermission: getHasPermissionState(state),
});

export {NotifyMeScreen as Component};
export default connect(mapStateToProps)(withPermissions(NotifyMeScreen, ['notifications']));
