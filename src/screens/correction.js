// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import get from 'lodash/fp/get';
import {NavigationEvents} from 'react-navigation';
import {
  acceptExtraLife,
  refuseExtraLife,
  hasViewedAResourceAtThisStep as checkHasViewedAResourceAtThisStep,
  getLives,
  getRoute,
  selectProgression,
  selectRoute,
  getCurrentProgression,
  getCurrentProgressionId,
  hasSeenLesson as checkHasSeenLesson,
  play
} from '@coorpacademy/player-store';

import {SPECIFIC_CONTENT_REF} from '../const';
import type {Resource} from '../types';
import Correction, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/correction';
import Screen from '../components/screen';
import {checkIsCorrect, checkIsExitNode} from '../redux/utils/state-extract';
import type {Params as LevelEndScreenParams} from './level-end';
import type {Params as PdfScreenParams} from './pdf';

export type Params = {|
  tip: string,
  answers: Array<string>,
  question: string,
  userAnswers: Array<string>,
  keyPoint: string,
  resources: Array<Resource>
|};

type ConnectedStateProps = {|
  nextScreen?: string,
  isCorrect?: boolean,
  isFinished?: boolean,
  lives?: number,
  consumedExtraLife?: boolean,
  showResourcesFirst?: boolean,
  canGoNext?: boolean,
  progressionId: string,
  isResourceViewed: boolean,
  offeringExtraLife?: boolean
|};

type ConnectedDispatchProps = {|
  play: typeof play,
  selectProgression: () => (dispatch: Dispatch, getState: GetState) => void,
  selectRoute: typeof selectRoute,
  acceptExtraLife: typeof acceptExtraLife,
  refuseExtraLife: typeof refuseExtraLife
|};

type Props = {|
  ...ReactNavigation$ScreenPropsWithParams<Params>,
  ...ConnectedStateProps,
  ...ConnectedDispatchProps
|};

type State = {|
  lives?: number,
  isLoading: boolean,
  hasLivesBeenAnimated: boolean,
  isResourceViewed: boolean
|};

// @todo move it in class
export const goNext = async (getProps: () => Props): Promise<void> => {
  const props = getProps();
  if (props.consumedExtraLife) {
    await props.acceptExtraLife();
  } else if (props.offeringExtraLife) {
    await props.refuseExtraLife();
  } else {
    await props.selectProgression();
  }

  const {isFinished, lives, progressionId} = getProps();

  if (isFinished) {
    const levelEndParams: LevelEndScreenParams = {
      isCorrect: lives === undefined || lives > 0,
      progressionId
    };

    props.navigation.navigate('LevelEnd', levelEndParams);
  }
};

class CorrectionScreen extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    hasLivesBeenAnimated: false,
    isLoading: false,
    lives:
      this.props.lives !== undefined && !this.props.isCorrect
        ? this.props.lives + 1
        : this.props.lives,
    isResourceViewed: this.props.isResourceViewed
  };

  static navigationOptions = ({navigationOptions, navigation}: ReactNavigation$ScreenProps) => ({
    ...navigationOptions,
    headerStyle: {
      ...navigationOptions.headerStyle,
      backgroundColor: navigation.state.params.isCorrect ? POSITIVE_COLOR : NEGATIVE_COLOR
    }
  });

  componentDidUpdate = (prevProps: Props) => {
    const {nextScreen} = this.props;

    switch (nextScreen) {
      case 'context':
        this.props.navigation.navigate('Context');
        break;
      case 'answer':
        this.props.navigation.navigate('Question');
        break;
    }
  };

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
    this.setState({isLoading: true});
    goNext(() => this.props);
  };

  handleDidFocus = () => {
    const {isCorrect} = this.props;
    if (!this.state.hasLivesBeenAnimated && !isCorrect && this.state.lives) {
      this.loseLife();
    }

    this.props.selectRoute('correction');
  };

  loseLife = () =>
    this.setState((state: State) => ({
      lives: state.lives !== undefined ? state.lives - 1 : state.lives,
      hasLivesBeenAnimated: true
    }));

  render() {
    const {
      tip,
      answers,
      question,
      userAnswers,
      keyPoint,
      resources
    } = this.props.navigation.state.params;

    const {
      isCorrect,
      lives: realLives,
      canGoNext,
      showResourcesFirst,
      offeringExtraLife
    } = this.props;
    const {isResourceViewed} = this.state;

    const {lives: livesToAnimate, isLoading} = this.state;
    const backgroundColor = (isCorrect && POSITIVE_COLOR) || NEGATIVE_COLOR;

    return (
      <Screen testID="correction-screen" noScroll style={{backgroundColor}}>
        <NavigationEvents onDidFocus={this.handleDidFocus} />
        <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
        <Correction
          tip={tip}
          answers={answers}
          question={question}
          userAnswers={userAnswers}
          isCorrect={isCorrect}
          keyPoint={keyPoint}
          onButtonPress={this.handleButtonPress}
          isLoading={isLoading}
          offeringExtraLife={offeringExtraLife}
          showResourcesFirst={showResourcesFirst}
          canGoNext={canGoNext}
          isResourceViewed={isResourceViewed}
          resources={resources}
          lives={this.state.hasLivesBeenAnimated ? realLives : livesToAnimate}
          onPDFButtonPress={this.handlePDFButtonPress}
          onVideoPlay={this.handleVideoPlay}
        />
      </Screen>
    );
  }
}

const _selectProgression = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const progressionId = getCurrentProgressionId(state);

  if (progressionId) {
    dispatch(selectProgression(progressionId));
  }
};

export const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const progression = getCurrentProgression(state);
  const progressionState = get('state', progression);
  if (progression === undefined || progressionState === undefined) {
    return {
      nextScreen: undefined,
      showResourcesFirst: false,
      isFinished: false,
      isCorrect: false,
      offeringExtraLife: false,
      canGoNext: false,
      progressionId: '',
      isResourceViewed: false
    };
  }

  const {hide: hideLives, count: livesCount} = getLives(state);
  const lives = hideLives ? undefined : livesCount;

  const isCorrect = checkIsCorrect(state);
  const progressionId = getCurrentProgressionId(state);
  const hasViewedAResource = checkHasSeenLesson(state, true);
  const hasViewedAResourceAtThisStep = checkHasViewedAResourceAtThisStep(state);
  const nextContentRef = get('state.nextContent.ref', progression);
  const contentRef = get('state.content.ref', progression);
  const stateExtraLife = nextContentRef === SPECIFIC_CONTENT_REF.EXTRA_LIFE;
  const justAcceptedExtraLife = contentRef === SPECIFIC_CONTENT_REF.EXTRA_LIFE;
  const offeringExtraLife = stateExtraLife && !hasViewedAResourceAtThisStep;
  const consumedExtraLife = stateExtraLife && hasViewedAResourceAtThisStep;
  const isResourceViewed = hasViewedAResource && !hasViewedAResourceAtThisStep;

  const isExitNode = checkIsExitNode(state);
  const isOfferingExtraLife = lives === 0 && offeringExtraLife;

  const isFinished = isExitNode || isOfferingExtraLife;

  const hasLivesRemaining = lives === undefined || lives > 0;
  const canGoNext = (hasLivesRemaining && !offeringExtraLife) || consumedExtraLife;

  const showResourcesFirst =
    !isCorrect && (offeringExtraLife || consumedExtraLife || justAcceptedExtraLife);

  return {
    nextScreen: getRoute(state),
    isFinished,
    isCorrect,
    isResourceViewed,
    consumedExtraLife,
    offeringExtraLife,
    progressionId,
    lives: consumedExtraLife ? lives + 1 : lives,
    canGoNext,
    showResourcesFirst
  };
};

export const mapDispatchToProps: ConnectedDispatchProps = {
  play,
  selectProgression: _selectProgression,
  acceptExtraLife,
  refuseExtraLife,
  selectRoute
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CorrectionScreen);
