// @flow

import * as React from 'react';
import {Alert, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import Home from '../components/home';
import Screen from '../components/screen';
import {selectCard} from '../redux/actions/catalog/cards/select';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {signOut} from '../redux/actions/authentication';
import {getToken, getCurrentScreenName} from '../redux/utils/state-extract';
import translations from '../translations';
import theme from '../modules/theme';

export type ConnectedStateProps = {|
  isFetching: boolean,
  isFocused: boolean
|};

type ConnectedDispatchProps = {|
  selectCard: typeof selectCard,
  signOut: typeof signOut
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateProps,
  ...ConnectedDispatchProps
|};

class HomeScreen extends React.PureComponent<$ReadOnly<Props>> {
  props: $ReadOnly<Props>;

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.navigation.navigate('Slide');
    this.props.selectCard(item);
  };

  handleLogoLongPress = () =>
    Alert.alert(translations.logOut, null, [
      {
        text: translations.cancel
      },
      {
        text: translations.ok,
        onPress: () => this.props.signOut()
      }
    ]);

  render() {
    const {isFetching, isFocused} = this.props;

    return (
      <Screen testID="home-screen" noScroll>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
        <Home
          onCardPress={this.handleCardPress}
          onLogoLongPress={this.handleLogoLongPress}
          isFetching={isFetching}
          isFocused={isFocused}
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

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  isFetching: getIsFetchingState(state),
  isFocused: getIsFocusedState(state)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard,
  signOut
};

export {HomeScreen as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
