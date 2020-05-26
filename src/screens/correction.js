// @flow

import * as React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {
  acceptExtraLife,
  refuseExtraLife,
  hasViewedAResourceAtThisStep as _hasViewedAResourceAtThisStep,
  getLives as _getLives,
  getCurrentProgressionId,
  hasSeenLesson as _hasSeenLesson,
  play,
  getCurrentCorrection,
  getPreviousSlide
} from '@coorpacademy/player-store';

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
import {mapToResource} from '../layer/data/mappers';
import type {Params as LevelEndScreenParams} from './level-end';
import type {Params as PdfScreenParams} from './pdf';
import type {Params as BrowserScreenParams} from './browser';

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

type State = {|
  needRerender: boolean
|};

class CorrectionScreen extends React.Component<Props, State> {
  props: Props;

  state: State = {
    needRerender: true
  };

  shouldComponentUpdate() {
    if (this.state.needRerender) return true;
    else return false;
  }

  handlePDFButtonPress = (url: string, description?: string) => {
    const pdfParams: PdfScreenParams = {
      title: description,
      source: {uri: url}
    };

    this.setState({needRerender: false});
    this.props.play();
    this.props.navigation.navigate('PdfModal', pdfParams);
  };

  handleVideoPlay = () => {
    this.setState({needRerender: false});
    this.props.play();
  };

  handleLinkPress = (url: string): void => {
    const {
      navigation: {navigate}
    } = this.props;
    const params: BrowserScreenParams = {
      url
    };
    navigate('BrowserModal', params);
  };

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
        {!isValidating ? (
          <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
        ) : null}
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
          onLinkPress={this.handleLinkPress}
          testID="correction"
        />
      </Screen>
    );
  }
}

const getIsLoading = (state: StoreState, {navigation}: OwnProps): boolean => {
  const slide = getPreviousSlide(state);
  const nextContentRef = getNextContentRef(state);
  const correction = getCurrentCorrection(state);
  const isCorrect = _isCorrect(state);

  return (
    !nextContentRef ||
    !correction ||
    isCorrect === undefined ||
    !slide ||
    slide._id !== navigation.state.params.slideId
  );
};

const getLives = (state: StoreState): number | void => {
  const {hide, count} = _getLives(state);

  return hide ? undefined : count;
};

const getLivesState = createSelector(
  [getLives],
  lives => lives
);

const getIsCorrectState = createSelector(
  [getIsLoading, _isCorrect],
  (isLoading, isCorrect) => (isLoading ? undefined : isCorrect)
);

const getIsGodModeEnabledState = createSelector(
  [_isGodModeEnabled],
  isEnabled => isEnabled
);

const getIsFastSlideEnabledState = createSelector(
  [_isFastSlideEnabled],
  isEnabled => isEnabled
);

const getProgressionIdState = createSelector(
  [getCurrentProgressionId],
  progressionId => progressionId
);

const getAnswersState = createSelector(
  [getCurrentCorrection],
  correction => correction.correctAnswer[0] || []
);

const getUserAnswersState = createSelector(
  [getCurrentCorrection],
  correction => {
    const userAnswers: Array<string> = correction.corrections
      .filter(item => item.answer)
      // $FlowFixMe item.answer is filtered if undefined
      .map(item => item.answer);

    return userAnswers;
  }
);

const getTipState = createSelector(
  [getPreviousSlide],
  previousSlide => (previousSlide && previousSlide.tips) || ''
);

const getKeyPointState = createSelector(
  [getPreviousSlide],
  previousSlide => (previousSlide && previousSlide.klf) || ''
);

const getQuestionHeaderState = createSelector(
  [getPreviousSlide],
  previousSlide => (previousSlide && previousSlide.question.header) || ''
);

const getHasContextState = createSelector(
  [getContext],
  context => context !== undefined
);

const getResourcesState = createSelector(
  [getPreviousSlide],
  previousSlide => {
    const lessons = (previousSlide && previousSlide.lessons) || [];
    return lessons.map(mapToResource).filter(lesson => lesson.url);
  }
);

const getIsResourceViewedState = createSelector(
  [_hasSeenLesson, _hasViewedAResourceAtThisStep],
  (hasSeenLesson, hasViewedAResourceAtThisStep) => hasSeenLesson && !hasViewedAResourceAtThisStep
);

const getIsExtraLife = (state: StoreState): boolean => {
  const nextContentRef = getNextContentRef(state);
  return nextContentRef === SPECIFIC_CONTENT_REF.EXTRA_LIFE;
};

const getOfferingExtraLife = (state: StoreState): boolean => {
  const isExtraLife = getIsExtraLife(state);
  const hasViewedAResourceAtThisStep = _hasViewedAResourceAtThisStep(state);

  return isExtraLife && !hasViewedAResourceAtThisStep;
};

const getOfferingExtraLifeState = createSelector(
  [getOfferingExtraLife],
  offeringExtraLife => offeringExtraLife
);

const getConsumedExtraLifeState = createSelector(
  [getIsExtraLife, _hasViewedAResourceAtThisStep],
  (isExtraLife, hasViewedAResourceAtThisStep) => isExtraLife && hasViewedAResourceAtThisStep
);

const getIsFinishedState = createSelector(
  [_isExitNode, getLives, getOfferingExtraLife],
  (isExitNode, lives, offeringExtraLife) => isExitNode || (lives === 0 && offeringExtraLife)
);

export const mapStateToProps = (state: StoreState, ownProps: OwnProps): ConnectedStateProps => ({
  isFinished: getIsFinishedState(state, ownProps),
  isCorrect: getIsCorrectState(state, ownProps),
  isResourceViewed: getIsResourceViewedState(state, ownProps),
  offeringExtraLife: getOfferingExtraLifeState(state, ownProps),
  hasConsumedExtraLife: getConsumedExtraLifeState(state, ownProps),
  hasContext: getHasContextState(state, ownProps),
  progressionId: getProgressionIdState(state, ownProps),
  lives: getLivesState(state, ownProps),
  isGodModeEnabled: getIsGodModeEnabledState(state, ownProps),
  isFastSlideEnabled: getIsFastSlideEnabledState(state, ownProps),
  question: getQuestionHeaderState(state, ownProps),
  answers: getAnswersState(state, ownProps),
  userAnswers: getUserAnswersState(state, ownProps),
  tip: getTipState(state, ownProps),
  keyPoint: getKeyPointState(state, ownProps),
  resources: getResourcesState(state, ownProps)
});

export const mapDispatchToProps: ConnectedDispatchProps = {
  play,
  selectCurrentProgression,
  acceptExtraLife,
  refuseExtraLife
};

export {CorrectionScreen as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CorrectionScreen);
