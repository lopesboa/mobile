// @flow

import * as React from 'react';
import {StatusBar, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import Home from '../components/home';
import Screen from '../components/screen';
import {selectCard, fetchCards} from '../redux/actions/cards';
import {fetchBrand} from '../redux/actions/brands';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import localToken from '../utils/local-token';
import {signIn, signOut} from '../redux/actions/authentication';
import translationUtil from '../translations';
import theme from '../modules/theme';

type ConnectedDispatchProps = {|
  selectCard: typeof selectCard,
  fetchCards: typeof fetchCards,
  fetchBrand: typeof fetchBrand,
  signIn: typeof signIn,
  onLogoLongPress: typeof signOut
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

  async componentDidMount() {
    const token = await localToken.get();
    await this.props.signIn(token);

    await this.fetchContent();
  }

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.selectCard(item);
    this.props.navigation.navigate('Slide');
  };

  handleLogoLongPress = async () => {
    const action = this.props.onLogoLongPress && (await this.props.onLogoLongPress());
    // When we log out, we reset the entirely stack
    // To avoid router directions and other stuffs
    if (action)
      this.props.navigation.reset([NavigationActions.navigate({routeName: 'Authentication'})], 0);
  };

  fetchContent = async () => {
    await this.props.fetchBrand();
    await this.props.fetchCards(translationUtil.getLanguage());
  };

  handleRefresh = () => {
    this.setState({isRefreshing: true});
    this.fetchContent()
      .then(() => this.setState({isRefreshing: false}))
      .catch(err => {
        this.setState({isRefreshing: false});
        // eslint-disable-next-line no-console
        console.error(err);
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

const mapStateToProps = ({cards, brands, ...state}: StoreState): ConnectedStateProps => {
  const language = translationUtil.getLanguage();

  return {
    items: Object.keys(cards.entities)
      .map(key => cards.entities[key][language])
      .filter(item => item !== undefined)
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard,
  fetchCards,
  fetchBrand,
  signIn,
  onLogoLongPress: signOut
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
