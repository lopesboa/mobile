// @flow

import * as React from 'react';
import {ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {
  editAnswer,
  getAnswerValues,
  getChoices,
  getLives,
  getCurrentCorrection,
  getStepContent,
  getQuestionMedia,
  getQuestionType,
  validateAnswer
} from '@coorpacademy/player-store';
import type {Media, QuestionType, Choice} from '@coorpacademy/progression-engine';

import Question from '../components/question';
import Screen from '../components/screen';
import translations from '../translations';
import type {StoreState} from '../redux/store';
import {
  checkIsCorrect,
  checkIsFinished,
  checkIsValidating,
  getSlide
} from '../redux/utils/state-extract';
import type {Params as CorrectionScreenParams} from './correction';

type ConnectedStateProps = {|
  type?: QuestionType,
  header?: string,
  explanation?: string,
  template?: string,
  choices?: Array<Choice>,
  userChoices?: Array<string>,
  answers?: Array<string>,
  userAnswers?: Array<string>,
  media?: Media,
  isCorrect?: boolean,
  tip?: string,
  keyPoint?: string,
  lives?: number,
  isFinished?: boolean,
  hasLives: boolean,
  isValidating: boolean
|};

type ConnectedDispatchProps = {|
  editAnswer: typeof editAnswer,
  validateAnswer: typeof validateAnswer
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateProps,
  ...ConnectedDispatchProps
|};

class QuestionScreen extends React.PureComponent<Props> {
  props: Props;

  scrollView: ScrollView;

  componentDidUpdate(prevProps: Props) {
    const {
      answers,
      header,
      isCorrect,
      isFinished,
      isValidating,
      keyPoint,
      tip,
      userAnswers
    } = this.props;

    if (
      isValidating &&
      isCorrect !== undefined &&
      header &&
      tip &&
      keyPoint &&
      answers &&
      userAnswers &&
      isFinished !== undefined
    ) {
      this.handleCorrectionNavigation();
    }
  }

  handleCorrectionNavigation = () => {
    const {
      navigation,
      header,
      isCorrect,
      tip,
      keyPoint,
      lives,
      answers,
      userAnswers,
      isFinished,
      hasLives
    } = this.props;

    const correctionParams: CorrectionScreenParams = {
      title: (isCorrect && translations.goodJob) || translations.ouch,
      subtitle: (isCorrect && translations.goodAnswer) || translations.wrongAnswer,
      question: header,
      isCorrect,
      answers,
      userAnswers,
      tip,
      keyPoint,
      lives,
      isFinished,
      hasLives
    };

    navigation.navigate('Correction', correctionParams);
    this.scrollView.scrollTo({x: 0, y: 0, animated: true});
  };

  handleRef = (element: ScrollView) => {
    this.scrollView = element;
  };

  handleChoicePress = (item: Choice) => {
    this.props.editAnswer(item);
  };

  handleInputValueChange = (value: string) => {
    this.props.editAnswer([value]);
  };

  handleChoiceInputChange = (item: Choice, value: string) => {
    const {choices, userChoices = []} = this.props;
    const values = choices.map((choice, index) => {
      const currentValue = userChoices[index] !== undefined ? userChoices[index] : '';

      return choice._id === item._id ? value : currentValue;
    });

    this.props.editAnswer(values);
  };

  handleButtonPress = () => {
    this.props.validateAnswer();
  };

  render() {
    const {
      choices = [],
      type,
      header,
      explanation,
      template,
      isValidating,
      media,
      userChoices = []
    } = this.props;

    return (
      <Screen testID="question-screen" onRef={this.handleRef}>
        {type &&
          header &&
          explanation && (
            <Question
              type={type}
              choices={choices}
              header={header}
              explanation={explanation}
              template={template}
              media={media}
              userChoices={userChoices}
              onChoicePress={this.handleChoicePress}
              onButtonPress={this.handleButtonPress}
              onChoiceInputChange={this.handleChoiceInputChange}
              onInputValueChange={this.handleInputValueChange}
              isValidating={isValidating}
            />
          )}
      </Screen>
    );
  }
}

const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const nextContent = getStepContent(state);

  if (!nextContent) {
    return {
      type: undefined,
      header: undefined,
      explanation: undefined,
      template: undefined,
      choices: undefined,
      userChoices: undefined,
      answers: undefined,
      userAnswers: undefined,
      media: undefined,
      isCorrect: undefined,
      tip: undefined,
      keyPoint: undefined,
      lives: undefined,
      hasLives: false,
      isFinished: undefined,
      isValidating: false
    };
  }
  const {hide: hideLives, count: livesCount} = getLives(state);
  const lives = hideLives ? undefined : livesCount;
  const correction = getCurrentCorrection(state);
  const media = getQuestionMedia(state);

  const answers: Array<string> = correction && correction.correctAnswer[0];
  const userAnswers: Array<string> =
    correction &&
    correction.corrections.reduce((result, item) => {
      if (item.answer) {
        result.push(item.answer);
      }
      return result;
    }, []);

  const hasLives = !hideLives;
  const slide = getSlide(state);
  const isCorrect = checkIsCorrect(state);
  const isFinished = checkIsFinished(state);
  const isValidating = checkIsValidating(state);

  if (!slide) {
    return {
      type: undefined,
      header: undefined,
      explanation: undefined,
      template: undefined,
      choices: undefined,
      userChoices: undefined,
      answers,
      userAnswers,
      media,
      isCorrect,
      isValidating,
      tip: undefined,
      keyPoint: undefined,
      lives,
      hasLives,
      isFinished
    };
  }

  const type = getQuestionType(slide);

  const choices = getChoices(slide);
  const userChoices = getAnswerValues(slide, state) || [];

  // $FlowFixMe union type
  const header = slide.question.header;
  // $FlowFixMe union type
  const explanation = slide.question.explanation;
  // $FlowFixMe union type
  const template = slide.question.content.template;

  return {
    type,
    header,
    explanation,
    template,
    choices,
    userChoices,
    answers,
    userAnswers,
    media,
    isCorrect,
    isFinished,
    hasLives,
    isValidating,
    tip: slide && slide.tips,
    keyPoint: slide && slide.klf,
    lives
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  editAnswer,
  validateAnswer
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionScreen);
