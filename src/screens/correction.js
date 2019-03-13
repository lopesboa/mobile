// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import {
  getRoute,
  selectProgression,
  selectRoute,
  getCurrentProgressionId,
  play
} from '@coorpacademy/player-store';

import type {Resource} from '../types';
import Correction, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/correction';
import Screen from '../components/screen';
import type {Params as LevelEndScreenParams} from './level-end';
import type {Params as PdfScreenParams} from './pdf';

export type Params = {|
  title: string,
  subtitle: string,
  tip: string,
  answers: Array<string>,
  question: string,
  userAnswers: Array<string>,
  isCorrect: boolean,
  keyPoint: string,
  lives?: number,
  hasLives: boolean,
  hasViewedAResource: boolean,
  resources: Array<Resource>,
  isFinished: boolean
|};

type ConnectedStateProps = {|
  nextScreen: string
|};

type ConnectedDispatchProps = {|
  play: typeof play,
  selectProgression: () => (dispatch: Dispatch, getState: GetState) => void,
  selectRoute: typeof selectRoute
|};

type Props = {|
  ...ReactNavigation$ScreenPropsWithParams<Params>,
  ...ConnectedStateProps,
  ...ConnectedDispatchProps
|};

type State = {|
  lives?: number,
  isLoading: boolean,
  hasLivesBeenAnimated: boolean
|};

class CorrectionScreen extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    hasLivesBeenAnimated: false,
    isLoading: false,
    lives:
      this.props.navigation.state.params.lives !== undefined &&
      !this.props.navigation.state.params.isCorrect
        ? this.props.navigation.state.params.lives + 1
        : this.props.navigation.state.params.lives
  };

  static navigationOptions = ({navigationOptions, navigation}: ReactNavigation$ScreenProps) => ({
    ...navigationOptions,
    headerStyle: {
      ...navigationOptions.headerStyle,
      backgroundColor: navigation.state.params.isCorrect ? POSITIVE_COLOR : NEGATIVE_COLOR
    }
  });

  componentDidUpdate(prevProps: Props) {
    const {nextScreen} = this.props;

    switch (nextScreen) {
      case 'context':
        this.props.navigation.navigate('Context');
        break;
      case 'answer':
        this.props.navigation.navigate('Question');
        break;
    }
  }

  handlePDFButtonPress = (url: string, description: string) => {
    const pdfParams: PdfScreenParams = {
      title: description,
      source: {uri: url}
    };

    this.props.play();
    this.props.navigation.navigate('PdfModal', pdfParams);
  };

  handleButtonPress = () => {
    const {lives} = this.state;
    const {navigation} = this.props;
    const {isCorrect, isFinished, hasLives} = navigation.state.params;

    this.props.selectProgression();
    this.setState({isLoading: true});

    if (isFinished) {
      const levelEndParams: LevelEndScreenParams = {
        isCorrect: isCorrect || (hasLives && lives !== undefined && lives > 0)
      };
      navigation.navigate('LevelEnd', levelEndParams);
    }
  };

  handleDidFocus = () => {
    const {isCorrect} = this.props.navigation.state.params;

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
      title,
      subtitle,
      tip,
      answers,
      question,
      userAnswers,
      isCorrect,
      keyPoint,
      isFinished,
      hasViewedAResource,
      resources
    } = this.props.navigation.state.params;

    const {lives, isLoading} = this.state;
    const backgroundColor = (isCorrect && POSITIVE_COLOR) || NEGATIVE_COLOR;

    return (
      <Screen testID="correction-screen" noScroll style={{backgroundColor}}>
        <NavigationEvents onDidFocus={this.handleDidFocus} />
        <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
        <Correction
          title={title}
          subtitle={subtitle}
          tip={tip}
          answers={answers}
          question={question}
          userAnswers={userAnswers}
          isCorrect={isCorrect}
          keyPoint={keyPoint}
          onButtonPress={this.handleButtonPress}
          isFinished={isFinished}
          isLoading={isLoading}
          hasViewedAResource={hasViewedAResource}
          resources={resources}
          lives={lives}
          onPDFButtonPress={this.handlePDFButtonPress}
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

const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  nextScreen: getRoute(state)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  play,
  selectProgression: _selectProgression,
  selectRoute
};

export default connect(mapStateToProps, mapDispatchToProps)(CorrectionScreen);
