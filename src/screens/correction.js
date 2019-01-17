// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationActions, NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';

import Correction, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/correction';
import Screen from '../components/screen';
import type {Answer} from '../types';
import {nextProgression, loseLifeProgression} from '../redux/actions/progression';
import type {StoreState} from '../redux';
import type {Params as LevelEndScreenParams} from './level-end';

export type Params = {|
  title: string,
  subtitle: string,
  tip: string,
  answers: Array<Answer>,
  question: string,
  userAnswers: Array<Answer>,
  isCorrect: boolean,
  keyPoint: string
|};

type ConnectedStateProps = {|
  isLastStep: boolean,
  lives?: number
|};

type ConnectedDispatchProps = {|
  nextProgression: typeof nextProgression,
  loseLifeProgression: typeof loseLifeProgression
|};

type Props = {|
  ...ReactNavigation$ScreenPropsWithParams<Params>,
  ...ConnectedStateProps,
  ...ConnectedDispatchProps
|};

type State = {|
  isLastLife: boolean
|};

class CorrectionScreen extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    isLastLife: this.props.lives === 1
  };

  static navigationOptions = ({navigationOptions, navigation}: ReactNavigation$ScreenProps) => ({
    ...navigationOptions,
    headerStyle: {
      ...navigationOptions.headerStyle,
      backgroundColor: navigation.state.params.isCorrect ? POSITIVE_COLOR : NEGATIVE_COLOR
    }
  });

  isFinished = (): boolean =>
    (this.props.isLastStep && this.props.navigation.state.params.isCorrect) ||
    this.state.isLastLife;

  handleButtonPress = () => {
    const {navigation} = this.props;
    const {isCorrect} = navigation.state.params;

    if (this.isFinished()) {
      const levelEndParams: LevelEndScreenParams = {
        isCorrect
      };
      navigation.navigate('LevelEnd', levelEndParams);
    } else {
      navigation.dispatch(NavigationActions.back());
      // @todo remove it once connected to redux
      if (isCorrect) {
        this.props.nextProgression();
      }
    }
  };

  handleDidFocus = () => {
    const {isCorrect} = this.props.navigation.state.params;
    // @todo remove it once connected to redux
    if (!isCorrect) {
      this.props.loseLifeProgression();
    }
  };

  render() {
    const {lives} = this.props;
    const {
      title,
      subtitle,
      tip,
      answers,
      question,
      userAnswers,
      isCorrect,
      keyPoint
    } = this.props.navigation.state.params;
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
          isFinished={this.isFinished()}
          lives={lives}
        />
      </Screen>
    );
  }
}

const mapStateToProps = ({progression}: StoreState): ConnectedStateProps => ({
  isLastStep: progression.current === progression.count,
  lives: progression.lives
});

const mapDispatchToProps: ConnectedDispatchProps = {
  nextProgression,
  loseLifeProgression
};

export default connect(mapStateToProps, mapDispatchToProps)(CorrectionScreen);
