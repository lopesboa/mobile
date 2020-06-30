import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationEvents, NavigationScreenProps} from 'react-navigation';
import {connect} from 'react-redux';

import Screen from '../components/screen';
import NotifyMe from '../components/notify-me';

import theme from '../modules/theme';

export type Params = {};

export interface ConnectedStateProps {
  hasPermission: boolean;
};

interface Props extends NavigationScreenProps<Params>, ConnectedStateProps {}


class NotifyMeScreen extends React.PureComponent<Props> {

  handleClose = () => {
    // const {navigation} = this.props;
    // navigation.dispatch(NavigationActions.back());
  };

  handleNotifyMe = () => {};

  handleDidFocus = () => {};

  render() {
    return (
      <Screen testID="notify-me-screen" noSafeArea noScroll>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.black} translucent />
        <NavigationEvents onDidFocus={this.handleDidFocus} testID="notify-me-navigation-events" />
        <NotifyMe onNotifyMePress={this.handleNotifyMe} onLaterPress={this.handleClose} />
      </Screen>
    );
  }
}

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  hasPermission: false
});

export {NotifyMeScreen as Component};
export default connect(mapStateToProps)(NotifyMeScreen);
