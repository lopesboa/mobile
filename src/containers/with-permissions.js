// @flow

import * as React from 'react';
import {AppState as AppStateBase} from 'react-native';
import {connect} from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import {APP_STATE} from '../const';
import type {AppState} from '../types';
import {check as checkPermission, request as requestPermission} from '../redux/actions/permissions';
import type {PermissionType} from '../redux/actions/permissions';

export type WithPermissionsProps = {|
  requestPermission: (type: PermissionType, description: string, onDeny?: () => void) => void
|};

type ConnectedDispatchProps = {|
  checkPermission: typeof checkPermission,
  requestPermission: typeof requestPermission
|};

type Props<P> = P & WithPermissionsProps & ConnectedDispatchProps;

function withPermissions<P>(
  WrappedComponent: React$ComponentType<P>,
  types: Array<PermissionType>
): React$ComponentType<Props<P>> {
  type State = {|
    appState?: ?AppState
  |};

  class ComponentWithPermissions extends React.PureComponent<$ReadOnly<Props<P>>, State> {
    props: $ReadOnly<Props<P>>;

    state: State = {
      // $FlowFixMe the base type is weak
      appState: AppStateBase.currentState
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
        appState
      });
    };

    checkPermissions = () => types.forEach(type => this.props.checkPermission(type));

    requestPermission: $PropertyType<WithPermissionsProps, 'requestPermission'> = (
      type,
      description,
      onDeny
    ) => {
      this.props.requestPermission(type, description, onDeny);
    };

    render() {
      return <WrappedComponent {...this.props} requestPermission={this.requestPermission} />;
    }
  }

  const mapDispatchToProps: ConnectedDispatchProps = {
    checkPermission,
    requestPermission
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
