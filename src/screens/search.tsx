import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';

import {NavigationScreenProps} from 'react-navigation';
import Screen from '../components/screen';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {selectCard} from '../redux/actions/catalog/cards/select';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import Search from '../containers/search';
import {BackHandler} from '../modules/back-handler';

interface ConnectedDispatchProps {
  selectCard: typeof selectCard;
}

interface Props extends NavigationScreenProps, ConnectedDispatchProps {}

class SearchScreen extends React.PureComponent<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.navigate('Home');
    return true;
  };

  // TODO:
  // Correctly manage the navigation in order to make it
  // go back to the Slide if we're coming from LevelEnd
  // or Make it just go back if we're coming from Home
  handleBackPress = () => this.props.navigation.navigate('Home');

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.navigation.navigate('Slide');
    this.props.selectCard(item);
  };

  render() {
    return (
      <Screen noScroll testID="search-screen">
        <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
        <Search onCardPress={this.handleCardPress} onBackPress={this.handleBackPress} />
      </Screen>
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard,
};

export {SearchScreen as Component};
export default connect(null, mapDispatchToProps)(SearchScreen);
