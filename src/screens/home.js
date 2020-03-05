// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import Home from '../components/home';
import Screen from '../components/screen';
import {selectCard} from '../redux/actions/catalog/cards/select';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {
  getToken,
  getCurrentScreenName,
  isSearchVisible as _isSearchVisible
} from '../redux/utils/state-extract';
import theme from '../modules/theme';

export type ConnectedStateProps = {|
  isFetching: boolean,
  isFocused: boolean,
  isSearchVisible: boolean
|};

type ConnectedDispatchProps = {|
  selectCard: typeof selectCard
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateProps,
  ...ConnectedDispatchProps
|};

class HomeScreen extends React.PureComponent<Props> {
  props: Props;

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.navigation.navigate('Slide');
    this.props.selectCard(item);
  };

  render() {
    const {isFetching, isFocused, isSearchVisible} = this.props;

    return (
      <Screen testID="home-screen" noScroll>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
        <Home
          onCardPress={this.handleCardPress}
          isFetching={isFetching}
          isFocused={isFocused}
          isSearchVisible={isSearchVisible}
          testID="home"
        />
      </Screen>
    );
  }
}

const getIsFetchingState: StoreState => boolean = createSelector(
  [getToken],
  token => !token
);

const getIsFocusedState: StoreState => boolean = createSelector(
  [getCurrentScreenName],
  name => name === 'Home'
);

const getIsSearchVisible: StoreState => boolean = createSelector(
  [_isSearchVisible],
  isVisible => isVisible
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  isFetching: getIsFetchingState(state),
  isFocused: getIsFocusedState(state),
  isSearchVisible: getIsSearchVisible(state)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard
};

export {HomeScreen as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
