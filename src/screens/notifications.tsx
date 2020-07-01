import * as React from 'react';
import {StatusBar} from 'react-native';
import { createSelector } from 'reselect';
import {NavigationEvents, NavigationActions, NavigationScreenProps} from 'react-navigation';
import {connect} from 'react-redux';

import Screen from '../components/screen';
import NotifyMe from '../components/notify-me';
import translations from '../translations';

import withPermissions from '../containers/with-permissions';
import type {WithPermissionsProps} from '../containers/with-permissions';

import theme from '../modules/theme';
import { PERMISSION_STATUS } from '../const';
import { getPermissionStatus } from '../redux/utils/state-extract';

export type Params = {};

export interface ConnectedStateProps {
  hasPermission: boolean;
};

interface Props extends WithPermissionsProps, NavigationScreenProps<Params>, ConnectedStateProps {}


class NotifyMeScreen extends React.PureComponent<Props> {

  handleClose = () => {
    const {navigation} = this.props;
    navigation.dispatch(NavigationActions.back());
  };
  
  handleOnLaterPress = () => {
    this.props.changeNotificationsPermission(PERMISSION_STATUS.MAYBE_LATER);
    this.handleClose();
  }

  handleNotifyMe = () => {
    this.props.requestNotificationsPermission(translations.permissionCamera, this.handleClose);
  };

  handleDidFocus = () => {};

  render() {
    return (
      <Screen testID="notify-me-screen" noSafeArea noScroll>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.black} translucent />
        <NavigationEvents onDidFocus={this.handleDidFocus} testID="notify-me-navigation-events" />
        <NotifyMe onNotifyMePress={this.handleNotifyMe} onLaterPress={this.handleOnLaterPress} />
      </Screen>
    );
  }
}

const getHasPermissionState: (state: StoreState) => boolean = createSelector(
  [getPermissionStatus('notifications')],
  permission => permission === PERMISSION_STATUS.GRANTED
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  hasPermission: getHasPermissionState(state)
});

export {NotifyMeScreen as Component};
export default connect(mapStateToProps)(withPermissions(NotifyMeScreen, ['notifications']));
