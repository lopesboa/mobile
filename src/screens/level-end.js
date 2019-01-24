// @flow strict

import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationActions} from 'react-navigation';

import LevelEnd, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/level-end';
import Screen from '../components/screen';

export type Params = {|
  isCorrect: boolean
|};

type Props = ReactNavigation$ScreenPropsWithParams<Params>;

class LevelEndScreen extends React.PureComponent<Props> {
  props: Props;

  static navigationOptions = ({navigationOptions, navigation}: ReactNavigation$ScreenProps) => ({
    ...navigationOptions,
    headerStyle: {
      ...navigationOptions.headerStyle,
      backgroundColor: navigation.state.params.isCorrect ? POSITIVE_COLOR : NEGATIVE_COLOR
    }
  });

  handleButtonPress = () => {
    const {navigation} = this.props;
    navigation.dispatch(
      NavigationActions.navigate({
        routeName: 'Home'
      })
    );
  };

  render() {
    const {isCorrect} = this.props.navigation.state.params;
    const backgroundColor = (isCorrect && POSITIVE_COLOR) || NEGATIVE_COLOR;

    return (
      <Screen testID="level-end-screen" noScroll style={{backgroundColor}}>
        <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
        <LevelEnd isCorrect={isCorrect} onButtonPress={this.handleButtonPress} />
      </Screen>
    );
  }
}

export default LevelEndScreen;