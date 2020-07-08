import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {NavigationScreenProps} from 'react-navigation';

import {checkNotifications} from 'react-native-permissions';
import Home from '../components/home';
import Screen from '../components/screen';
import {selectCard} from '../redux/actions/catalog/cards/select';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {getToken, getCurrentScreenName} from '../redux/utils/state-extract';
import theme from '../modules/theme';
import {BackHandler} from '../modules/back-handler';
import {PERMISSION_STATUS, PERMISSION_RECURENCE} from '../const';
import {StoreState} from '../redux/store';

export interface ConnectedStateProps {
  isFetching: boolean;
  isFocused: boolean;
  appSession: number;
  notificationStatus: string;
}

interface ConnectedDispatchProps {
  selectCard: typeof selectCard;
}

interface Props extends NavigationScreenProps, ConnectedStateProps, ConnectedDispatchProps {}

class HomeScreen extends React.PureComponent<Props> {
  componentDidMount() {
    BackHandler?.addEventListener('hardwareBackPress', this.handleBackButton);
    this.showNotifyMe();
  }

  componentWillUnmount() {
    BackHandler?.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  showNotifyMe() {
    const {notificationStatus, appSession, navigation} = this.props;

    if (
      notificationStatus === PERMISSION_STATUS.UNDETERMINED ||
      (notificationStatus === PERMISSION_STATUS.MAYBE_LATER &&
        (appSession === PERMISSION_RECURENCE.SECOND || appSession === PERMISSION_RECURENCE.THIRD))
    ) {
      navigation.navigate('NotifyMeModal');
      return;
    }
  }

  handleBackButton = () => {
    BackHandler?.exitApp();
    return true;
  };

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.navigation.navigate('Slide');
    this.props.selectCard(item);
  };

  handleSearchPress = () => {
    this.props.navigation.navigate('Search');
  };

  handleSettingsPress = () => {
    this.props.navigation.navigate('Settings');
  };

  render() {
    const {isFetching, isFocused} = this.props;

    return (
      <Screen testID="home-screen" noScroll>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
        <Home
          onCardPress={this.handleCardPress}
          onSearchPress={this.handleSearchPress}
          onSettingsPress={this.handleSettingsPress}
          isFetching={isFetching}
          isFocused={isFocused}
          testID="home"
        />
      </Screen>
    );
  }
}

const getIsFetchingState: (state: StoreState) => boolean = createSelector(
  [getToken],
  (token) => !token,
);

const getIsFocusedState: (state: StoreState) => boolean = createSelector(
  [getCurrentScreenName],
  (name) => name === 'Home',
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  isFetching: getIsFetchingState(state),
  isFocused: getIsFocusedState(state),
  appSession: state.appSession,
  notificationStatus: state.permissions.notifications,
});

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard,
};

export {HomeScreen as Component};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
