// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import Home from '../components/home';
import Screen from '../components/screen';
import {selectCard, fetchCards} from '../redux/actions/cards';
import {fetchBrand} from '../redux/actions/brands';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import localToken from '../utils/local-token';
import {signIn, signOut} from '../redux/actions/authentication';
import translationUtil from '../translations';

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

class HomeScreen extends React.PureComponent<Props> {
  props: Props;

  async componentDidMount() {
    const token = await localToken.get();
    await this.props.signIn(token);

    await this.props.fetchBrand();

    await this.props.fetchCards(translationUtil.getLanguage());
  }

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.selectCard(item);
    this.props.navigation.navigate('Slide');
  };

  handleLogoLongPress = async () => {
    const action = this.props.onLogoLongPress && (await this.props.onLogoLongPress());
    // When we log out, we reset the entirely stack
    // To avoid router directions and other stuffs
    if (action) this.props.navigation.reset([NavigationActions.navigate({routeName: 'Splash'})], 0);
  };

  render() {
    const {items} = this.props;
    return (
      <Screen testID="home-screen" noSafeArea>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
