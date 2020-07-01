import * as React from 'react';
import {AppState as AppStateBase} from 'react-native';
import {connect} from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import {APP_STATE} from '../const';
import type {AppState} from '../types';
import {check as checkPermission, request as requestPermission} from '../redux/actions/permissions';
import type {PermissionType} from '../redux/actions/permissions';

export interface WithPermissionsProps {
  requestPermission: (type: PermissionType, description: string, onDeny?: () => void) => void;
}

interface ConnectedDispatchProps {
  checkPermission: typeof checkPermission;
  requestPermission: typeof requestPermission;
}

function withPermissions(WrappedComponent: React.ElementType<any>, types: Array<PermissionType>) {
  interface Props extends WithPermissionsProps, ConnectedDispatchProps {}

  type State = {
    appState?: AppState;
  };

  class ComponentWithPermissions extends React.PureComponent<Props, State> {
    state: State = {
      // @ts-ignore the base type is weak
      appState: AppStateBase.currentState,
    };

    componentDidMount() {
      this.checkPermissions();
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
        this.checkPermissions();
      }
      this.setState({
        appState,
      });
    };

    checkPermissions = () => types.forEach((type) => this.props.checkPermission(type));

    requestPermission: Pick<WithPermissionsProps, 'requestPermission'> = (
      type,
      description,
      onDeny,
    ) => {
      this.props.requestPermission(type, description, onDeny);
    };

    render() {
      return <WrappedComponent {...this.props} requestPermission={this.requestPermission} />;
    }
  }

  const mapDispatchToProps: ConnectedDispatchProps = {
    checkPermission,
    requestPermission,
  };

  return hoistNonReactStatic(
    connect(null, mapDispatchToProps)(ComponentWithPermissions),
    WrappedComponent,
  );
}

export default withPermissions;
