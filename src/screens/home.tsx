import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import { NavigationScreenProps } from 'react-navigation';

import Home from '../components/home';
import Screen from '../components/screen';
import {selectCard} from '../redux/actions/catalog/cards/select';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {getToken, getCurrentScreenName} from '../redux/utils/state-extract';
import theme from '../modules/theme';
import {BackHandler} from '../modules/back-handler';

export interface ConnectedStateProps {
  isFetching: boolean;
  isFocused: boolean;
};

interface ConnectedDispatchProps {
  selectCard: typeof selectCard;
};


interface Props extends NavigationScreenProps, ConnectedStateProps, ConnectedDispatchProps {}

class HomeScreen extends React.PureComponent<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const {navigation} = this.props;
    const params: QRCodeScreenParams = { };
    navigation.navigate('NotifyMeModal', params);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.navigation.navigate('Slide');
    this.props.selectCard(item);
  };

  handleSearchPress = () => {
    this.props.navigation.navigate('Search');
  };

  render() {
    const {isFetching, isFocused} = this.props;

    return (
      <Screen testID="home-screen" noScroll>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
        <Home
          onCardPress={this.handleCardPress}
          onSearchPress={this.handleSearchPress}
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
  token => !token
);

const getIsFocusedState: (state: StoreState) => boolean = createSelector(
  [getCurrentScreenName],
  name => name === 'Home'
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  isFetching: getIsFetchingState(state),
  isFocused: getIsFocusedState(state)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard
};

export {HomeScreen as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
