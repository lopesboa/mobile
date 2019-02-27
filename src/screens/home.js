// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import Home from '../components/home';
import Screen from '../components/screen';
import {selectCard} from '../redux/actions/cards';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';

type ConnectedDispatchProps = {|
  selectCard: typeof selectCard
|};

type Props = {|
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
    return (
      <Screen testID="home-screen">
        <Home onCardPress={this.handleCardPress} />
      </Screen>
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard
};

export default connect(null, mapDispatchToProps)(HomeScreen);
