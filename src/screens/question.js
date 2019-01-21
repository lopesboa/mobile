// @flow strict

import * as React from 'react';
import {ScrollView} from 'react-native';

import translations from '../translations';
import type {QuestionType, QuestionChoiceItem, Media, Answer} from '../types';
import Question from '../components/question';
import Screen from '../components/screen';
import withSlides from '../containers/with-slides';
import type {Params as CorrectionScreenParams} from './correction';

export type Correction = {|
  userAnswers: Array<Answer>,
  answers: Array<Answer>,
  isCorrect: boolean,
  tip: string,
  keyPoint: string
|};

export type ConnectedProps = {|
  type: QuestionType,
  header: string,
  explanation: string,
  choices: Array<QuestionChoiceItem>,
  media?: Media,
  onChoicePress: (item: QuestionChoiceItem) => void,
  onCorrectAnswer: () => void,
  getCorrection: () => Correction
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedProps
|};

class QuestionScreen extends React.PureComponent<Props> {
  props: Props;

  scrollView: ScrollView;

  handleRef = (element: ScrollView) => {
    this.scrollView = element;
  };

  handleButtonPress = () => {
    const {onCorrectAnswer, getCorrection, header, navigation} = this.props;
    const correction = getCorrection();

    if (!correction) {
      return;
    }
    const {isCorrect, userAnswers, answers, tip, keyPoint} = correction;

    // @todo call the handler everytime
    if (isCorrect) {
      onCorrectAnswer();
    }
    const correctionParams: CorrectionScreenParams = {
      isCorrect,
      title: (isCorrect && translations.goodJob) || translations.ouch,
      subtitle: (isCorrect && translations.goodAnswer) || translations.wrongAnswer,
      tip,
      answers,
      question: header,
      userAnswers,
      keyPoint
    };
    navigation.navigate('Correction', correctionParams);
    this.scrollView.scrollTo({x: 0, y: 0, animated: true});
  };

  render() {
    const {type, header, explanation, choices, media, onChoicePress} = this.props;

    return (
      <Screen testID="question-screen" onRef={this.handleRef}>
        <Question
          type={type}
          header={header}
          explanation={explanation}
          choices={choices}
          media={media}
          onChoicePress={onChoicePress}
          onButtonPress={this.handleButtonPress}
        />
      </Screen>
    );
  }
}

// @todo temporary HOC until we have redux
export default withSlides(QuestionScreen);
