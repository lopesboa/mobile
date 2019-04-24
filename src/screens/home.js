// @flow

import * as React from 'react';
import {Alert, StatusBar, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import Home from '../components/home';
import Screen from '../components/screen';
import {selectCard, fetchCards} from '../redux/actions/cards';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {signOut} from '../redux/actions/authentication';
import translations from '../translations';
import theme from '../modules/theme';

type ConnectedDispatchProps = {|
  selectCard: typeof selectCard,
  fetchCards: typeof fetchCards,
  signOut: typeof signOut
|};

type ConnectedStateProps = {|
  items: Array<DisciplineCard | ChapterCard>
|};

type Props = {|
  ...ConnectedStateProps,
  ...ReactNavigation$ScreenProps,
  ...ConnectedDispatchProps
|};

type State = {|
  isRefreshing: boolean
|};

class HomeScreen extends React.PureComponent<Props, State> {
  props: Props;

  state: State;

  state = {
    isRefreshing: false
  };

  componentDidMount() {
    this.fetchContent();
  }

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.selectCard(item);
    this.props.navigation.navigate('Slide');
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

  fetchContent = async () => {
    await this.props.fetchCards(translations.getLanguage());
  };

  handleRefresh = () => {
    this.setState({isRefreshing: true});
    this.fetchContent()
      .then(() => this.setState({isRefreshing: false}))
      .catch(e => {
        this.setState({isRefreshing: false});
        // eslint-disable-next-line no-console
        console.error(e);
      });
  };

  render() {
    const {items} = this.props;
    const {isRefreshing} = this.state;
    const refreshingStyle = (isRefreshing && {top: getStatusBarHeight()}) || {};
    return (
      <Screen
        testID="home-screen"
        noSafeArea
        style={refreshingStyle}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={this.handleRefresh} />}
      >
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
        <Home
          onCardPress={this.handleCardPress}
          // $FlowFixMe
          onLogoLongPress={this.handleLogoLongPress}
          isFetching={items.length === 0}
        />
      </Screen>
    );
  }
}

const mapStateToProps = ({cards, brands, ...state}: StoreState): ConnectedStateProps => ({
  items: Object.keys(cards.entities)
    .map(key => cards.entities[key][translations.getLanguage()])
    .filter(item => item !== undefined)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard,
  fetchCards,
  signOut
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
