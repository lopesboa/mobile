// @flow

import * as React from 'react';
import {ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {
  editAnswer,
  getAnswerValues,
  getChoices,
  getCurrentProgression,
  getCurrentSlide,
  getLives,
  getCurrentCorrection,
  getPreviousSlide,
  getStepContent,
  getQuestionMedia,
  getQuestionType,
  getRoute,
  validateAnswer
} from '@coorpacademy/player-store';
import type {Choice, Media, QuestionType} from '@coorpacademy/progression-engine';

import Question from '../components/question';
import Screen from '../components/screen';
import translations from '../translations';
import {CONTENT_TYPE, SPECIFIC_CONTENT_REF} from '../const';
import type {StoreState} from '../redux/store';
import type {Params as CorrectionScreenParams} from './correction';

type ConnectedStateProps = {|
  type?: QuestionType,
  header?: string,
  explanation?: string,
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

  handleButtonPress = () => {
    this.props.validateAnswer();
  };

  render() {
    const {choices, type, header, explanation, isValidating, media, userChoices = []} = this.props;

    return (
      <Screen testID="question-screen" onRef={this.handleRef}>
        {type &&
          header &&
          explanation &&
          choices && (
            <Question
              type={type}
              choices={choices}
              header={header}
              explanation={explanation}
              media={media}
              userChoices={userChoices}
              onChoicePress={this.handleChoicePress}
              onButtonPress={this.handleButtonPress}
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
  const progression = getCurrentProgression(state);
  const {hide: hideLives, count: livesCount} = getLives(state);
  const lives = hideLives ? undefined : livesCount;
  const correction = getCurrentCorrection(state);
  const media = getQuestionMedia(state);
  const currentRoute = getRoute(state);
  const isValidating = currentRoute === 'correction';

  const answers: Array<string> = correction && correction.correctAnswer[0];
  const userAnswers: Array<string> =
    correction &&
    correction.corrections.reduce((result, item) => {
      if (item.answer) {
        result.push(item.answer);
      }
      return result;
    }, []);

  const isCorrect =
    progression && progression.state && progression.state.isCorrect !== null
      ? progression.state.isCorrect
      : undefined;

  const openingCorrection = isValidating && isCorrect !== undefined;

  const isExtraLife = nextContent.ref === SPECIFIC_CONTENT_REF.EXTRA_LIFE;
  const isFinished =
    isExtraLife || [CONTENT_TYPE.SUCCESS, CONTENT_TYPE.FAILURE].includes(nextContent.type);
  const hasLives = !hideLives;
  const slide = isFinished || openingCorrection ? getPreviousSlide(state) : getCurrentSlide(state);

  if (!slide) {
    return {
      type: undefined,
      header: undefined,
      explanation: undefined,
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
  const userChoices = getAnswerValues(slide, state);
  // $FlowFixMe union type
  const header = slide.question.header;
  // $FlowFixMe union type
  const explanation = slide.question.explanation;

  return {
    type,
    header,
    explanation,
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
