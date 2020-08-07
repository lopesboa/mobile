import _url from 'url';
import * as React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {StackScreenProps} from '@react-navigation/stack';
import {getToken} from '../redux/utils/state-extract';
import {AUTHENTICATION_TYPE} from '../const';
import {signIn, signOut} from '../redux/actions/authentication';
import type {State as TokenState} from '../redux/reducers/authentication/token';

interface ConnectedStateProps {
  token: TokenState;
}

interface ConnectedDispatchProps {
  signIn: typeof signIn;
  signOut: typeof signOut;
}

const UNIVERSAL_LINKS_PATTERN = /(.*)\/open-app/;
interface Props
  extends StackScreenProps<{Home: undefined}, 'Home'>,
    ConnectedStateProps,
    ConnectedDispatchProps {}

class DynamicLinks extends React.PureComponent<Props> {
  subscriber: (() => void) | void;

  async componentDidMount() {
    this.subscriber = await dynamicLinks().onLink((l) => this.handleOpenURL(l.url));

    const link = await dynamicLinks().getInitialLink();
    if (link) {
      await this.handleOpenURL(link.url);
    }
  }

  componentWillUnmount() {
    this.subscriber && this.subscriber();
  }

  handleOpenURL = async (link: string) => {
    const {pathname, query} = _url.parse(link, true);

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
    return this.props.children;
  }
}

const getTokenState = createSelector([getToken], (token) => token);

const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  token: getTokenState(state),
});

const mapDispatchToProps: ConnectedDispatchProps = {
  signIn,
  signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(DynamicLinks);
