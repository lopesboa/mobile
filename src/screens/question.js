// @flow

import * as React from 'react';
import {ScrollView, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {
  editAnswer,
  getAnswerValues,
  getChoices,
  getCurrentProgression,
  getStepContent,
  getQuestionMedia,
  getQuestionType,
  getCurrentSlide
} from '@coorpacademy/player-store';
import type {Media, QuestionType, Choice} from '@coorpacademy/progression-engine';

import Question from '../components/question';
import type {Props as QuestionProps} from '../components/question';
import Screen from '../components/screen';
import type {StoreState} from '../redux/store';
import {validateAnswer} from '../redux/actions/ui/answers';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import {QUESTION_TYPE} from '../const';
import type {Params as CorrectionParams} from './correction';

export type ConnectedStateProps = {|
  type?: QuestionType,
  header?: string,
  explanation?: string,
  template?: string,
  choices?: Array<Choice>,
  userChoices?: Array<string>,
  media?: Media,
  min?: $PropertyType<QuestionProps, 'min'>,
  max?: $PropertyType<QuestionProps, 'max'>,
  step?: $PropertyType<QuestionProps, 'step'>,
  value?: $PropertyType<QuestionProps, 'value'>,
  slideId?: string
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

  handleRef = (element: ScrollView) => {
    this.scrollView = element;
  };

  handleChoicePress = (item: Choice) => {
    this.props.editAnswer(item);
  };

  handleSliderChange = (newValue: number) => {
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
    const {slideId} = this.props;

    const params: CorrectionParams = {
      slideId
    };

    this.props.validateAnswer();
    this.props.navigation.navigate('Correction', params);
    this.scrollView.scrollTo({x: 0, y: 0, animated: true});
  };

  render() {
    const {
      choices = [],
      type,
      header,
      explanation,
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
          onSliderChange={this.handleSliderChange}
          onChoiceInputChange={this.handleChoiceInputChange}
          onInputValueChange={this.handleInputValueChange}
          min={min}
          max={max}
          step={step}
          value={value}
        />
      </Screen>
    );
  }
}

export const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const loadingProps: ConnectedStateProps = {
    type: undefined,
    header: undefined,
    explanation: undefined,
    template: undefined,
    choices: undefined,
    userChoices: undefined,
    media: undefined,
    min: undefined,
    max: undefined,
    step: undefined,
    value: undefined
  };

  const nextContent = getStepContent(state);
  const progression = getCurrentProgression(state);

  if (!nextContent || progression === undefined || progression.state === undefined) {
    return loadingProps;
  }

  const media = getQuestionMedia(state);
  const slide = getCurrentSlide(state);

  if (!slide) {
    return loadingProps;
  }

  const type = getQuestionType(slide);
  const choices = getChoices(slide);

  // SLIDER QUESTIONS
  const values = getAnswerValues(slide, state);
  const sliderDefaultValue = type === QUESTION_TYPE.SLIDER ? parseInt(values[0]) : 0;
  const userChoices = values || [];

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

  return {
    slideId: slide._id,
    type,
    header,
    explanation,
    template,
    choices,
    userChoices,
    media,
    min:
      (sliderMinValue && {
        label: `${sliderMinValue} ${sliderUnitLabel}`,
        value: sliderMinValue
      }) ||
      undefined,
    max:
      (sliderMaxValue && {
        label: `${sliderMaxValue} ${sliderUnitLabel}`,
        value: sliderMaxValue
      }) ||
      undefined,
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
