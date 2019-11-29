// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {
  editAnswer,
  getAnswerValues,
  getQuestionMedia,
  getQuestionType,
  getCurrentSlide
} from '@coorpacademy/player-store';
import type {Media, QuestionType, Choice} from '@coorpacademy/progression-engine';

import Question from '../components/question';
import type {Props as QuestionProps} from '../components/question';
import Screen from '../components/screen';
import type {StoreState} from '../redux/store';
import {getQuestion} from '../redux/utils/state-extract';
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
  unit?: $PropertyType<QuestionProps, 'unit'>,
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

  scrollView: KeyboardAwareScrollView | void;

  componentDidUpdate(prevProps: Props) {
    if (this.scrollView && this.props.slideId && prevProps.slideId !== this.props.slideId) {
      this.scrollView.props.scrollToPosition(0, 0, true);
    }
  }

  handleRef = (element: KeyboardAwareScrollView) => {
    this.scrollView = element;
  };

  handleChoicePress = (item: Choice) => {
    this.props.editAnswer(item);
  };

  handleSliderChange = (newValue: number) => {
    this.props.editAnswer(String(newValue));
  };

  handleInputValueChange = (value: string) => {
    this.props.editAnswer(value);
  };

  handleChoiceInputChange = (item: Choice, value: string) => {
    const {choices = [], userChoices = []} = this.props;
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
      unit,
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
          unit={unit}
          step={step}
          value={value}
          testID="question"
        />
      </Screen>
    );
  }
}

const getSlideIdState = createSelector(
  [getCurrentSlide],
  slide => slide && slide._id
);

const getQuestionTypeState = createSelector(
  [getQuestion],
  question => question && question.type
);

const getQuestionHeaderState = createSelector(
  [getQuestion],
  question => question && question.header
);

const getQuestionExplanationState = createSelector(
  [getQuestion],
  question => question && question.explanation
);

const getQuestionTemplateState = createSelector(
  [getQuestion],
  // $FlowFixMe union type
  question => question && question.content.template
);

const getQuestionChoicesState = createSelector(
  [getQuestion],
  // $FlowFixMe union type
  question => question && question.content.choices
);

const getQuestionUserChoicesState = (state: StoreState) =>
  createSelector(
    [getCurrentSlide],
    slide => slide && getAnswerValues(slide, state)
  )(state);

const getQuestionMediaState = createSelector(
  [getQuestionMedia],
  media => media
);

const getSliderUnitState = createSelector(
  [getQuestion],
  // $FlowFixMe union type
  question => question && question.content.unitLabel
);

const getSliderMinState = createSelector(
  [getQuestion],
  // $FlowFixMe union type
  question => question && question.content.min
);

const getSliderMaxState = createSelector(
  [getQuestion],
  // $FlowFixMe union type
  question => question && question.content.max
);

const getSliderStepValueState = createSelector(
  [getQuestion],
  // $FlowFixMe union type
  question => question && question.content.step
);

const getSliderDefaultValueState = (state: StoreState) =>
  createSelector(
    [getCurrentSlide],
    slide => {
      const type = slide && getQuestionType(slide);
      const values = slide && getAnswerValues(slide, state);

      return type === QUESTION_TYPE.SLIDER && values ? parseInt(values[0]) : 0;
    }
  )(state);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  slideId: getSlideIdState(state),
  type: getQuestionTypeState(state),
  header: getQuestionHeaderState(state),
  explanation: getQuestionExplanationState(state),
  template: getQuestionTemplateState(state),
  choices: getQuestionChoicesState(state),
  userChoices: getQuestionUserChoicesState(state),
  media: getQuestionMediaState(state),
  min: getSliderMinState(state),
  max: getSliderMaxState(state),
  unit: getSliderUnitState(state),
  step: getSliderStepValueState(state),
  value: getSliderDefaultValueState(state)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  editAnswer,
  validateAnswer
};

export {QuestionScreen as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionScreen);
