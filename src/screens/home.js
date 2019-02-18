// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import Home from '../components/home';
import Screen from '../components/screen';
import {createLevelProgression, createChapterProgression} from '../redux/actions/progression';
import type {Level, Chapter, Discipline} from '../layer/data/_types';

type ConnectedDispatchProps = {|
  createLevelProgression: typeof createLevelProgression,
  createChapterProgression: typeof createChapterProgression
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

  handleDisciplinePress = (discipline: Discipline) => {
    // @todo redirect to discipline page once developed
    const level: Level = discipline.modules[0];
    this.props.createLevelProgression(level);
    this.props.navigation.navigate('Slide');
  };

  handleChapterPress = (chapter: Chapter) => {
    this.props.createChapterProgression(chapter);
    this.props.navigation.navigate('Slide');
  };

  render() {
    return (
      <Screen testID="home-screen">
        <Home
          onDisciplinePress={this.handleDisciplinePress}
          onChapterPress={this.handleChapterPress}
        />
      </Screen>
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  createLevelProgression,
  createChapterProgression
};

export default connect(null, mapDispatchToProps)(HomeScreen);
