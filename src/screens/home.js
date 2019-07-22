// @flow

import * as React from 'react';
import {Alert, StatusBar} from 'react-native';
import {connect} from 'react-redux';

import Home from '../components/home';
import Screen from '../components/screen';
import {selectCard} from '../redux/actions/catalog/cards/select';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {signOut} from '../redux/actions/authentication';
import translations from '../translations';
import theme from '../modules/theme';

type ConnectedStateProps = {|
  isFetching: boolean
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

class HomeScreen extends React.PureComponent<Props> {
  props: Props;

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
    const {isFetching} = this.props;

    return (
      <Screen testID="home-screen" noScroll>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
        <Home
          onCardPress={this.handleCardPress}
          onLogoLongPress={this.handleLogoLongPress}
          isFetching={isFetching}
        />
      </Screen>
    );
  }
}

const mapStateToProps = ({authentication}: StoreState): ConnectedStateProps => ({
  isFetching: !authentication.user.token
});

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard,
  signOut
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
