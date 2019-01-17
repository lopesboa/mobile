// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import Button from '../components/button';
import Space from '../components/space';
import Screen from '../components/screen';
import theme from '../modules/theme';
import {setLivesProgression} from '../redux/actions/progression';

type ConnectedDispatchProps = {|
  setLivesProgression: typeof setLivesProgression
|};

type Props = ReactNavigation$ScreenProps;

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

  handlePress = (lives?: number) => () => {
    this.props.setLivesProgression(lives);
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
  setLivesProgression
};

export default connect(null, mapDispatchToProps)(HomeScreen);
