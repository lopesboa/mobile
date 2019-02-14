// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions, NavigationEvents} from 'react-navigation';
import {selectProgression, selectRoute, getCurrentProgressionId} from '@coorpacademy/player-store';

import Correction, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/correction';
import Screen from '../components/screen';
import type {Params as LevelEndScreenParams} from './level-end';

export type Params = {|
  title: string,
  subtitle: string,
  tip: string,
  answers: Array<string>,
  question: string,
  userAnswers: Array<string>,
  isCorrect: boolean,
  keyPoint: string,
  lives?: number,
  hasLives: boolean,
  isFinished: boolean
|};

type ConnectedDispatchProps = {|
  selectProgression: () => (dispatch: Dispatch, getState: GetState) => void,
  selectRoute: typeof selectRoute
|};

type Props = {|
  ...ReactNavigation$ScreenPropsWithParams<Params>,
  ...ConnectedDispatchProps
|};

type State = {|
  lives?: number
|};

class CorrectionScreen extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    lives:
      this.props.navigation.state.params.lives !== undefined &&
      !this.props.navigation.state.params.isCorrect
        ? this.props.navigation.state.params.lives + 1
        : this.props.navigation.state.params.lives
  };

  static navigationOptions = ({navigationOptions, navigation}: ReactNavigation$ScreenProps) => ({
    ...navigationOptions,
    headerStyle: {
      ...navigationOptions.headerStyle,
      backgroundColor: navigation.state.params.isCorrect ? POSITIVE_COLOR : NEGATIVE_COLOR
    }
  });

  handleButtonPress = () => {
    const {navigation} = this.props;
    const {isCorrect, isFinished, lives, hasLives} = navigation.state.params;

    this.props.selectProgression();

    if (isFinished) {
      const levelEndParams: LevelEndScreenParams = {
        isCorrect: isCorrect || (hasLives && lives > 0)
      };
      navigation.navigate('LevelEnd', levelEndParams);
    } else {
      navigation.dispatch(NavigationActions.back());
    }
  };

  handleDidFocus = () => {
    const {isCorrect} = this.props.navigation.state.params;
    if (!isCorrect && this.state.lives) {
      this.loseLife();
    }

    this.props.selectRoute('correction');
  };

  loseLife = () =>
    this.setState((state: State) => ({
      lives: state.lives !== undefined ? state.lives - 1 : state.lives
    }));

  render() {
    const {
      title,
      subtitle,
      tip,
      answers,
      question,
      userAnswers,
      isCorrect,
      keyPoint,
      isFinished
    } = this.props.navigation.state.params;
    const {lives} = this.state;
    const backgroundColor = (isCorrect && POSITIVE_COLOR) || NEGATIVE_COLOR;

    return (
      <Screen testID="correction-screen" noScroll style={{backgroundColor}}>
        <NavigationEvents onDidFocus={this.handleDidFocus} />
        <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
        <Correction
          title={title}
          subtitle={subtitle}
          tip={tip}
          answers={answers}
          question={question}
          userAnswers={userAnswers}
          isCorrect={isCorrect}
          keyPoint={keyPoint}
          onButtonPress={this.handleButtonPress}
          isFinished={isFinished}
          lives={lives}
        />
      </Screen>
    );
  }
}

const _selectProgression = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const progressionId = getCurrentProgressionId(state);

  if (progressionId) {
    dispatch(selectProgression(progressionId));
  }
};

const mapDispatchToProps: ConnectedDispatchProps = {
  selectProgression: _selectProgression,
  selectRoute
};

export default connect(null, mapDispatchToProps)(CorrectionScreen);
