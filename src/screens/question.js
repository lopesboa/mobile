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
  getPreviousSlide,
  getStepContent,
  getQuestionMedia,
  getQuestionType,
  hasSeenLesson as checkHasSeenLesson,
  validateAnswer
} from '@coorpacademy/player-store';
import type {Lesson, Media, QuestionType, Choice} from '@coorpacademy/progression-engine';

import Question from '../components/question';
import Screen from '../components/screen';
import translations from '../translations';
import type {Resource, SliderProps} from '../types';
import type {StoreState} from '../redux/store';
import {
  checkIsCorrect,
  checkIsFinished,
  checkIsValidating,
  getSlide
} from '../redux/utils/state-extract';
import {reduceToResources} from '../layer/data/mappers';
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
  isCurrentScreen?: boolean,
  keyPoint?: string,
  lives?: number,
  isFinished?: boolean,
  hasViewedAResource?: boolean,
  resourcesForCorrection?: Array<Resource>,
  hasLives: boolean,
  isValidating: boolean,
  slider: SliderProps
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
      isCurrentScreen,
      navigation,
      header,
      isCorrect,
      tip,
      keyPoint,
      lives,
      answers,
      userAnswers,
      isFinished,
      hasLives,
      hasViewedAResource,
      resourcesForCorrection: resources
    } = this.props;

    // not to trigger navigate('Correction') on resourceViewed on a correction card
    if (!isCurrentScreen) {
      return;
    }

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
      hasLives,
      hasViewedAResource,
      resources
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

  handleOnSliderChange = (newValue: number) => {
    this.props.editAnswer(String(newValue));
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
      isValidating,
      media,
      slider,
      template,
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
              onSliderChange={this.handleOnSliderChange}
              onChoiceInputChange={this.handleChoiceInputChange}
              onInputValueChange={this.handleInputValueChange}
              isValidating={isValidating}
              slider={slider}
            />
          )}
      </Screen>
    );
  }
}

const mapStateToProps = (state: StoreState, {dispatch}: Props): ConnectedStateProps => {
  const nextContent = getStepContent(state);
  const isCurrentScreen = state.navigation.currentScreenName === 'Slide';

  if (!nextContent) {
    return {
      isCurrentScreen,
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
      hasViewedAResource: undefined,
      resourcesForCorrection: undefined,
      isFinished: undefined,
      isValidating: false,
      slider: {
        minLabel: undefined,
        minValue: undefined,
        maxLabel: undefined,
        maxValue: undefined,
        step: undefined,
        value: undefined
      }
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
  const hasViewedAResource = checkHasSeenLesson(state, true);

  if (!slide) {
    return {
      type: undefined,
      header: undefined,
      explanation: undefined,
      template: undefined,
      choices: undefined,
      userChoices: undefined,
      hasViewedAResource,
      answers,
      userAnswers,
      media,
      isCorrect,
      isValidating,
      isCurrentScreen,
      tip: undefined,
      keyPoint: undefined,
      lives,
      hasLives,
      isFinished,
      slider: {
        minLabel: undefined,
        minValue: undefined,
        maxLabel: undefined,
        maxValue: undefined,
        step: undefined,
        value: undefined
      }
    };
  }

  const type = getQuestionType(slide);

  const choices = getChoices(slide);

  // SLIDER QUESTIONS
  const stateValue = getAnswerValues(slide, state);
  const sliderDefaultValue = type === 'slider' ? parseInt(stateValue[0]) : 0;
  const userChoices = getAnswerValues(slide, state) || [];

  // $FlowFixMe union type
  const header = slide.question.header;
  // $FlowFixMe union type
  const explanation = slide.question.explanation;
  // $FlowFixMe union type
  const template = slide.question.content.template;

  // $FlowFixMe union type
  const sliderUnitLabel = slide.question.content.unitLabel;
  // $FlowFixMe union type
  const sliderMaxValue = slide.question.content.max;
  // $FlowFixMe union type
  const sliderMinValue = slide.question.content.min;
  // $FlowFixMe union type
  const sliderStepValue = slide.question.content.step;

  const slideForCorrection = getPreviousSlide(state);
  const lessons: Array<Lesson> = (slideForCorrection && slideForCorrection.lessons) || [];

  const resourcesForCorrection: Array<Resource> = reduceToResources(lessons);

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
    isCurrentScreen,
    hasLives,
    hasViewedAResource,
    resourcesForCorrection,
    isValidating,
    tip: slide && slide.tips,
    keyPoint: slide && slide.klf,
    lives,
    slider: {
      minLabel: `${sliderMinValue} ${sliderUnitLabel}`,
      maxLabel: `${sliderMaxValue} ${sliderUnitLabel}`,
      minValue: sliderMinValue,
      maxValue: sliderMaxValue,
      step: sliderStepValue,
      value: sliderDefaultValue
    }
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  editAnswer,
  validateAnswer
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionScreen);
