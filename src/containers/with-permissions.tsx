import * as React from 'react';
import {AppState as AppStateBase} from 'react-native';
import {connect} from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import {APP_STATE} from '../const';
import type {AppState} from '../types';
import {check as checkCameraPermission, request as requestCameraPermission} from '../redux/actions/permissions/camera';
import {check as checkNotificationsPermission, request as requestNotificationsPermission, change as changeNotificationsPermission} from '../redux/actions/permissions/notifications';
import type {PermissionType} from '../types';

export interface WithPermissionsProps {
  requestCameraPermission: (description: string, onDeny?: () => void) => void;
  requestNotificationsPermission: (description: string, onDeny?: () => void) => void;
  changeNotificationsPermission: (status: PermissionStatus) => void;
};

interface ConnectedDispatchProps {
  checkCameraPermission: typeof checkCameraPermission;
  requestCameraPermission: typeof requestCameraPermission;
  checkNotificationsPermission: typeof checkNotificationsPermission;
  requestNotificationsPermission: typeof requestNotificationsPermission;
  changeNotificationsPermission: typeof changeNotificationsPermission;
};

function withPermissions(
  WrappedComponent: React.ElementType<any>,
  types: Array<PermissionType>
) {
  interface Props extends WithPermissionsProps, ConnectedDispatchProps {}

  type State = {
    appState?: AppState
  };

  class ComponentWithPermissions extends React.PureComponent<Props, State> {
    state: State = {
      // @ts-ignore the base type is weak
      appState: AppStateBase.currentState
    };

    componentDidMount() {
      this.checkCameraPermissions();
      this.checkNotificationsPermissions();
      AppStateBase.addEventListener('change', this.handleAppStateChange);
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
        this.checkCameraPermissions();
        this.checkNotificationsPermissions();
      }
      this.setState({
        appState
      });
    };

    checkCameraPermissions = () => this.props.checkCameraPermission();
    
    checkNotificationsPermissions = () => this.props.checkNotificationsPermission();

    requestCameraPermission: Pick<WithPermissionsProps, 'requestCameraPermission'> = (
      description,
      onDeny
    ) => {
      this.props.requestCameraPermission(description, onDeny);
    };

    requestNotificationsPermission: Pick<WithPermissionsProps, 'requestNotificationsPermission'> = (
      description,
      onDeny
    ) => {
      this.props.requestNotificationsPermission(description, onDeny);
    };

    changeNotificationsPermission: Pick<WithPermissionsProps, 'changeNotificationsPermission'> = (
      status: PermissionStatus
    ) => {
      this.props.changeNotificationsPermission(status);
    };

    render() {
      return (
        <WrappedComponent 
          {...this.props} 
          requestCameraPermission={this.requestCameraPermission} 
          requestNotificationsPermission={this.requestNotificationsPermission}
          changeNotificationsPermission={this.changeNotificationsPermission}
        />
      );
    }
  }

  const mapDispatchToProps: ConnectedDispatchProps = {
    checkCameraPermission,
    requestCameraPermission,
    checkNotificationsPermission,
    requestNotificationsPermission,
    changeNotificationsPermission
  };

  return hoistNonReactStatic(
    connect(
      null,
      mapDispatchToProps
    )(ComponentWithPermissions),
    WrappedComponent
  );
}

export default withPermissions;
