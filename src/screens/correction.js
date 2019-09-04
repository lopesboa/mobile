// @flow

import * as React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {
  acceptExtraLife,
  refuseExtraLife,
  hasViewedAResourceAtThisStep as _hasViewedAResourceAtThisStep,
  getLives,
  getCurrentProgressionId,
  hasSeenLesson as _hasSeenLesson,
  play,
  getCurrentCorrection,
  getPreviousSlide
} from '@coorpacademy/player-store';
import type {Lesson} from '@coorpacademy/progression-engine';

import {SPECIFIC_CONTENT_REF} from '../const';
import type {Resource} from '../types';
import Correction, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/correction';
import Screen from '../components/screen';
import {selectCurrentProgression} from '../redux/actions/progressions/select-progression';
import {
  isCorrect as _isCorrect,
  isExitNode as _isExitNode,
  getNextContentRef,
  getContext,
  isGodModeEnabled as _isGodModeEnabled,
  isFastSlideEnabled as _isFastSlideEnabled
} from '../redux/utils/state-extract';
import {reduceToResources} from '../layer/data/mappers';
import type {Params as LevelEndScreenParams} from './level-end';
import type {Params as PdfScreenParams} from './pdf';

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1
  }
});

export type Params = {|
  slideId: string
|};

export type ConnectedStateProps = {|
  isCorrect?: boolean,
  isFinished?: boolean,
  lives?: number,
  isGodModeEnabled?: boolean,
  isFastSlideEnabled?: boolean,
  progressionId?: string,
  isResourceViewed?: boolean,
  offeringExtraLife?: boolean,
  hasConsumedExtraLife?: boolean,
  hasContext?: boolean,
  question: string,
  answers: Array<string>,
  userAnswers: Array<string>,
  tip: string,
  keyPoint: string,
  resources?: Array<Resource>
|};

type ConnectedDispatchProps = {|
  play: typeof play,
  selectCurrentProgression: typeof selectCurrentProgression,
  acceptExtraLife: typeof acceptExtraLife,
  refuseExtraLife: typeof refuseExtraLife
|};

export type OwnProps = {|
  ...ReactNavigation$ScreenPropsWithParams<Params>
|};

type Props = {|
  ...OwnProps,
  ...ConnectedStateProps,
  ...ConnectedDispatchProps
|};

class CorrectionScreen extends React.PureComponent<Props> {
  props: Props;

  handlePDFButtonPress = (url: string, description: string) => {
    const pdfParams: PdfScreenParams = {
      title: description,
      source: {uri: url}
    };

    this.props.play();
    this.props.navigation.navigate('PdfModal', pdfParams);
  };

  handleVideoPlay = () => this.props.play();

  handleButtonPress = () => {
    const {
      offeringExtraLife,
      hasConsumedExtraLife,
      isFinished,
      lives,
      progressionId = '',
      navigation,
      hasContext
    } = this.props;

    if (hasConsumedExtraLife) {
      this.props.acceptExtraLife();
    } else if (offeringExtraLife) {
      this.props.refuseExtraLife();
    } else {
      this.props.selectCurrentProgression();
    }

    if (isFinished) {
      const levelEndParams: LevelEndScreenParams = {
        isCorrect: lives === undefined || lives > 0,
        progressionId
      };

      return navigation.navigate('LevelEnd', levelEndParams);
    }

    return navigation.navigate(hasContext ? 'Context' : 'Question');
  };

  render() {
    const {
      isCorrect,
      isResourceViewed,
      offeringExtraLife,
      hasConsumedExtraLife,
      tip,
      answers,
      question,
      userAnswers,
      keyPoint,
      resources,
      lives,
      isGodModeEnabled,
      isFastSlideEnabled
    } = this.props;

    const isValidating = isCorrect === undefined;
    const backgroundColor = (isCorrect && POSITIVE_COLOR) || NEGATIVE_COLOR;

    return (
      <Screen
        testID="correction-screen"
        noScroll
        style={{backgroundColor: !isValidating && backgroundColor}}
      >
        {!isValidating && <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />}
        <Correction
          containerStyle={styles.layoutContainer}
          tip={tip}
          answers={answers}
          question={question}
          userAnswers={userAnswers}
          isCorrect={isCorrect}
          keyPoint={keyPoint}
          onButtonPress={this.handleButtonPress}
          offeringExtraLife={offeringExtraLife}
          hasConsumedExtraLife={hasConsumedExtraLife}
          isResourceViewed={isResourceViewed}
          resources={resources}
          lives={lives}
          isGodModeEnabled={isGodModeEnabled}
          isFastSlideEnabled={isFastSlideEnabled}
          onPDFButtonPress={this.handlePDFButtonPress}
          onVideoPlay={this.handleVideoPlay}
        />
      </Screen>
    );
  }
}

export const mapStateToProps = (state: StoreState, {navigation}: OwnProps): ConnectedStateProps => {
  const defaultState: ConnectedStateProps = {
    question: '',
    tip: '',
    keyPoint: '',
    answers: [],
    userAnswers: []
  };
  const previousSlide = getPreviousSlide(state);

  if (!previousSlide || previousSlide._id !== navigation.state.params.slideId) {
    return defaultState;
  }

  const progressionId = getCurrentProgressionId(state);
  const nextContentRef = getNextContentRef(state);
  const isCorrect = _isCorrect(state);
  const correction = getCurrentCorrection(state);

  if (isCorrect === undefined || !nextContentRef || !correction) {
    return defaultState;
  }

  const {hide: hideLives, count: livesCount} = getLives(state);
  const lives = hideLives ? undefined : livesCount;

  const hasViewedAResource = _hasSeenLesson(state, true);
  const hasViewedAResourceAtThisStep = _hasViewedAResourceAtThisStep(state);
  const stateExtraLife = nextContentRef === SPECIFIC_CONTENT_REF.EXTRA_LIFE;
  const offeringExtraLife = stateExtraLife && !hasViewedAResourceAtThisStep;
  const hasConsumedExtraLife = stateExtraLife && hasViewedAResourceAtThisStep;
  const isResourceViewed = hasViewedAResource && !hasViewedAResourceAtThisStep;

  const isExitNode = _isExitNode(state);
  const isOfferingExtraLife = lives === 0 && offeringExtraLife;

  const isFinished = isExitNode || isOfferingExtraLife;

  const answers: Array<string> = (correction && correction.correctAnswer[0]) || [];
  const userAnswers: Array<string> = ((correction && correction.corrections) || []).reduce(
    (result, item) => {
      if (item.answer) {
        result.push(item.answer);
      }
      return result;
    },
    []
  );

  const lessons: Array<Lesson> = (previousSlide && previousSlide.lessons) || [];
  const resources: Array<Resource> = reduceToResources(lessons);
  const context = getContext(state);

  return {
    isFinished,
    isCorrect,
    isResourceViewed,
    offeringExtraLife,
    hasConsumedExtraLife,
    hasContext: context !== undefined,
    progressionId,
    lives,
    isGodModeEnabled: _isGodModeEnabled(state),
    isFastSlideEnabled: _isFastSlideEnabled(state),
    question: previousSlide.question.header || '',
    answers,
    userAnswers,
    tip: previousSlide.tips,
    keyPoint: previousSlide.klf,
    resources
  };
};

export const mapDispatchToProps: ConnectedDispatchProps = {
  play,
  selectCurrentProgression,
  acceptExtraLife,
  refuseExtraLife
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CorrectionScreen);
