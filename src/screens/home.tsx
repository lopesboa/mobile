import * as React from 'react';
import {StatusBar, Platform, BackHandler} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import {StackScreenProps} from '@react-navigation/stack';
import {withBackHandler} from '../containers/with-backhandler';
import Home from '../components/home';
import Screen from '../components/screen';
import {selectCard} from '../redux/actions/catalog/cards/select';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {getToken, getCurrentScreenName} from '../redux/utils/state-extract';
import theme from '../modules/theme';
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

type ScreenParams = {
  Modals: {screen: string};
  Slide: undefined;
  Search: undefined;
  Settings: undefined;
};

interface Props
  extends StackScreenProps<ScreenParams, 'Slide'>,
    ConnectedStateProps,
    ConnectedDispatchProps {}

class HomeScreen extends React.PureComponent<Props> {
  static handleBackButton = (): boolean => {
    BackHandler.exitApp();
    return true;
  };

  componentDidMount() {
    this.showNotifyMe();
  }

  componentDidUpdate() {
    this.showNotifyMe();
  }

  showNotifyMe() {
    const {notificationStatus, appSession, navigation} = this.props;
    if (Platform.OS === 'android') return false;
    if (
      notificationStatus === PERMISSION_STATUS.UNDETERMINED ||
      (notificationStatus === PERMISSION_STATUS.MAYBE_LATER &&
        (appSession === PERMISSION_RECURENCE.SECOND || appSession === PERMISSION_RECURENCE.THIRD))
    ) {
      return navigation.navigate('Modals', {screen: 'NotifyMe'});
    }
  }

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
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withBackHandler(HomeScreen, HomeScreen.handleBackButton));
