// @flow strict

import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationActions} from 'react-navigation';

import Correction, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/correction';
import Screen from '../components/screen';
import type {Answer} from '../types';
import type {Params as LevelEndScreenParams} from './level-end';

export type Params = {|
  title: string,
  subtitle: string,
  tip: string,
  answers: Array<Answer>,
  question: string,
  userAnswers: Array<Answer>,
  isCorrect: boolean,
  keyPoint: string,
  isFinished: boolean
|};

type Props = ReactNavigation$ScreenPropsWithParams<Params>;

class CorrectionScreen extends React.PureComponent<Props> {
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
    const {isFinished, isCorrect} = navigation.state.params;

    if (isFinished) {
      const levelEndParams: LevelEndScreenParams = {
        isCorrect
      };
      navigation.navigate('LevelEnd', levelEndParams);
    } else {
      navigation.dispatch(NavigationActions.back());
    }
  };

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
    const backgroundColor = (isCorrect && POSITIVE_COLOR) || NEGATIVE_COLOR;

    return (
      <Screen testID="correction-screen" noScroll style={{backgroundColor}}>
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
        />
      </Screen>
    );
  }
}

export default CorrectionScreen;
