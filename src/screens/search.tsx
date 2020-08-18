import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';

import {StackScreenProps} from '@react-navigation/stack';
import Screen from '../components/screen';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {selectCard} from '../redux/actions/catalog/cards/select';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import Search from '../containers/search';
import {withBackHandler} from '../containers/with-backhandler';

interface ConnectedDispatchProps {
  selectCard: typeof selectCard;
}

type Params = {
  Search: undefined;
  Home: undefined;
  Slide: undefined;
};

type Props = StackScreenProps<Params, 'Search'> & ConnectedDispatchProps;

class SearchScreen extends React.PureComponent<Props> {
  static handleBackButton = (navigator): boolean => {
    // TODO:
    // Correctly manage the navigation in order to make it
    // go back to the Slide if we're coming from LevelEnd
    // or Make it just go back if we're coming from Home
    navigator.navigate('Home');
    return true;
  };

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.navigation.navigate('Slide');
    this.props.selectCard(item);
  };

  handleOnBackPress = () => SearchScreen.handleBackButton(this.props.navigation);

  render() {
    return (
      <Screen noScroll testID="search-screen">
        <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
        <Search onCardPress={this.handleCardPress} onBackPress={this.handleOnBackPress} />
      </Screen>
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard,
};

export {SearchScreen as Component};
export default connect(
  null,
  mapDispatchToProps,
)(withBackHandler(SearchScreen, SearchScreen.handleBackButton));
