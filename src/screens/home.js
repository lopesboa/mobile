// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import Home from '../components/home';
import Screen from '../components/screen';
import {selectCard} from '../redux/actions/cards';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import translationUtil from '../translations';

type ConnectedDispatchProps = {|
  selectCard: typeof selectCard
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

  static navigationOptions = ({navigationOptions, navigation}: ReactNavigation$ScreenProps) => ({
    ...navigationOptions,
    headerMode: 'none',
    headerStyle: {
      ...navigationOptions.headerStyle,
      height: 0
    }
  });

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.selectCard(item);
    this.props.navigation.navigate('Slide');
  };

  render() {
    const {items} = this.props;
    return (
      <Screen testID="home-screen" noSafeArea>
        <Home onCardPress={this.handleCardPress} isFetching={items.length === 0} />
      </Screen>
    );
  }
}

const mapStateToProps = ({cards, brands, ...state}: StoreState): ConnectedStateProps => {
  // @todo use user language
  const language = translationUtil.getLanguage();

  return {
    items: Object.keys(cards.entities)
      .map(key => cards.entities[key][language])
      .filter(item => item !== undefined)
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
