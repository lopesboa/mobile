// @flow

import _url from 'url';

import * as React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {withNavigation} from 'react-navigation';
import type {WithNavigationProps} from 'react-navigation';
import firebase from 'react-native-firebase';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {getToken} from '../redux/utils/state-extract';
import {AUTHENTICATION_TYPE} from '../const';
import {signIn, signOut} from '../redux/actions/authentication';
import type {State as TokenState} from '../redux/reducers/authentication/token';

type ConnectedStateProps = {|
  token: TokenState
|};

type ConnectedDispatchProps = {|
  signIn: typeof signIn,
  signOut: typeof signOut
|};

type Props<P> = P & ConnectedStateProps & ConnectedDispatchProps & WithNavigationProps;

const UNIVERSAL_LINKS_PATTERN = /(.*)\/open-app/;

function withUniversalLinks<P>(
  WrappedComponent: React$ComponentType<Props<P>>
): React$ComponentType<Props<P>> {
  class ComponentWithUniversalLinks extends React.PureComponent<$ReadOnly<Props<P>>> {
    props: $ReadOnly<Props<P>>;

    subscriber: (() => void) | void;

    async componentDidMount() {
      this.subscriber = firebase.links().onLink(this.handleOpenURL);

      const url = await firebase.links().getInitialLink();

      if (url) {
        await this.handleOpenURL(url);
      }
    }

    componentWillUnmount() {
      this.subscriber && this.subscriber();
    }

    handleOpenURL = async (url: string) => {
      const {pathname, query} = _url.parse(url, true);

      if (!query || !query.jwt || !pathname) {
        return;
      }

      if (pathname.match(UNIVERSAL_LINKS_PATTERN)) {
        const route = pathname.replace(UNIVERSAL_LINKS_PATTERN, '');

        if (query.jwt !== this.props.token) {
          if (this.props.token) {
            await this.props.signOut();
          }
          await this.props.signIn(AUTHENTICATION_TYPE.MAGIC_LINK, query.jwt);
        }

        return this.handleNavigate(route);
      }
    };

    handleNavigate = (route: string) => {
      switch (route) {
        default:
          return this.props.navigation.navigate('Home');
      }
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const getTokenState = createSelector(
    [getToken],
    token => token
  );

  const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
    token: getTokenState(state)
  });

  const mapDispatchToProps: ConnectedDispatchProps = {
    signIn,
    signOut
  };

  return hoistNonReactStatic(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withNavigation(ComponentWithUniversalLinks)),
    WrappedComponent
  );
}

export default withUniversalLinks;
