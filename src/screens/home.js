// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import Button from '../components/button';
import Screen from '../components/screen';
import theme from '../modules/theme';

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

  handlePress = () => {
    const {navigation} = this.props;
    navigation.navigate('Slide');
  };

  render() {
    return (
      <Screen testID="home-screen" noScroll>
        <View style={styles.container} testID="home">
          <Button onPress={this.handlePress} testID="button-start-course">
            Start the course
          </Button>
        </View>
      </Screen>
    );
  }
}

export default HomeScreen;
