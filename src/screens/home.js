// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {createProgression} from '@coorpacademy/player-store';

import Button from '../components/button';
import Space from '../components/space';
import Screen from '../components/screen';
import theme from '../modules/theme';
// @todo remove it once we a catalog
import onboardingCourse from '../__fixtures__/onboarding-course';
import type {Level, Discipline} from '../layer/data';

type ConnectedDispatchProps = {|
  createProgression: typeof createProgression
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedDispatchProps
|};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.base,
    justifyContent: 'flex-end'
  }
});

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

  handlePress = lives => () => {
    // @todo selectCourse action to dispatch
    // $FlowFixMe onboardingCourse.disciplines is not mixed
    const disciplines: Array<Discipline> = Object.values(onboardingCourse.disciplines);
    const firstModule: Level = disciplines && disciplines[0].modules[0];
    this.props.createProgression(
      {ref: 'learner'},
      {type: 'level', ref: firstModule.universalRef},
      {lives}
    );

    this.props.navigation.navigate('Slide');
  };

  render() {
    return (
      <Screen testID="home-screen" noScroll>
        <View style={styles.container} testID="home">
          <Button onPress={this.handlePress(3)} testID="button-start-course-with-lives">
            Start a course
          </Button>
          <Space />
          <Button onPress={this.handlePress()} testID="button-start-course-without-lives">
            Start a course without lives
          </Button>
        </View>
      </Screen>
    );
  }
}

const mapDispatchToProps: ConnectedDispatchProps = {
  createProgression
};

export default connect(null, mapDispatchToProps)(HomeScreen);
