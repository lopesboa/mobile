// @flow

import * as React from 'react';
import {ScrollView, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {
  editAnswer,
  getAnswerValues,
  getChoices,
  getCurrentCorrection,
  getCurrentProgression,
  getPreviousSlide,
  getStepContent,
  getQuestionMedia,
  getQuestionType,
  getRoute
} from '@coorpacademy/player-store';
import type {Lesson, Media, QuestionType, Choice} from '@coorpacademy/progression-engine';

import Question from '../components/question';
import type {Props as QuestionProps} from '../components/question';
import Screen from '../components/screen';
import type {Resource} from '../types';
import type {StoreState} from '../redux/store';
import {validateAnswer} from '../redux/actions/ui/answers';
import {checkIsValidating, getSlide} from '../redux/utils/state-extract';
import {reduceToResources} from '../layer/data/mappers';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
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
  tip?: string,
  isFocused?: boolean,
  keyPoint?: string,
  hasViewedAResource?: boolean,
  hasViewedAResourceAtThisStep?: boolean,
  resourcesForCorrection?: Array<Resource>,
  isValidating: boolean,
  min?: $PropertyType<QuestionProps, 'min'>,
  max?: $PropertyType<QuestionProps, 'max'>,
  step?: $PropertyType<QuestionProps, 'step'>,
  value?: $PropertyType<QuestionProps, 'value'>
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
    const {answers, header, isValidating, keyPoint, tip, userAnswers} = this.props;

    if (isValidating && header && tip && keyPoint && answers && userAnswers) {
      this.handleCorrectionNavigation();
    }
  }

  handleCorrectionNavigation = () => {
    const {
      isFocused,
      navigation,
      header,
      tip,
      keyPoint,
      answers,
      userAnswers,
      resourcesForCorrection: resources
    } = this.props;

    // not to trigger navigate('Correction') on other screen than question
    if (!isFocused) {
      return;
    }

    const correctionParams: CorrectionScreenParams = {
      question: header,
      answers,
      userAnswers,
      tip,
      keyPoint,
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
      min,
      max,
      step,
      value,
      template,
      userChoices = []
    } = this.props;

    return (
      <Screen testID="question-screen" onRef={this.handleRef}>
        <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
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
          min={min}
          max={max}
          step={step}
          value={value}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state: StoreState, {dispatch}: Props): ConnectedStateProps => {
  const isFocused = state.navigation.currentScreenName === 'Slide';
  const emptySlide = {
    isFocused,
    type: undefined,
    header: undefined,
    explanation: undefined,
    template: undefined,
    choices: undefined,
    userChoices: undefined,
    answers: undefined,
    userAnswers: undefined,
    media: undefined,
    tip: undefined,
    keyPoint: undefined,
    resourcesForCorrection: undefined,
    isValidating: false,
    min: undefined,
    max: undefined,
    step: undefined,
    value: undefined
  };

  const nextContent = getStepContent(state);
  const progression = getCurrentProgression(state);

  if (!nextContent || progression === undefined || progression.state === undefined) {
    return emptySlide;
  }

  const currentRoute = getRoute(state);
  const showQuestionOrCorrection = currentRoute === 'answer' || currentRoute === 'correction';
  if (!showQuestionOrCorrection) {
    return emptySlide;
  }

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

  const slide = getSlide(state);
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
      isValidating,
      isFocused,
      tip: undefined,
      keyPoint: undefined,
      min: undefined,
      max: undefined,
      step: undefined,
      value: undefined
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
    isFocused,
    resourcesForCorrection,
    isValidating,
    tip: slide && slide.tips,
    keyPoint: slide && slide.klf,
    min: {
      label: `${sliderMinValue} ${sliderUnitLabel}`,
      value: sliderMinValue
    },
    max: {
      label: `${sliderMaxValue} ${sliderUnitLabel}`,
      value: sliderMaxValue
    },
    step: sliderStepValue,
    value: sliderDefaultValue
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  editAnswer,
  validateAnswer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionScreen);
