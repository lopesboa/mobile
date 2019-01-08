// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';

import Correction, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/correction';
import Screen from '../components/screen';
import type {Answer} from '../types';
import {nextProgression} from '../redux/actions/progression';
import type {StoreState} from '../redux';
import type {Params as LevelEndScreenParams} from './level-end';

export type Params = {|
  title: string,
  subtitle: string,
  tip: string,
  answers: Array<Answer>,
  question: string,
  userAnswers: Array<Answer>,
  isCorrect: boolean,
  keyPoint: string
|};

type ConnectedStateProps = {|
  isFinished: boolean
|};

type ConnectedDispatchProps = {|
  nextProgression: typeof nextProgression
|};

type Props = {|
  ...ReactNavigation$ScreenPropsWithParams<Params>,
  ...ConnectedStateProps,
  ...ConnectedDispatchProps
|};

class CorrectionScreen extends React.PureComponent<Props> {
  props: Props;

  static navigationOptions = ({navigationOptions, navigation}: ReactNavigation$ScreenProps) => ({
    ...navigationOptions,
    headerStyle: {
      ...navigationOptions.headerStyle,
      backgroundColor: navigation.state.params.isCorrect ? POSITIVE_COLOR : NEGATIVE_COLOR
    }
  });

  handleButtonPress = () => {
    const {navigation, isFinished} = this.props;
    const {isCorrect} = navigation.state.params;

    if (isFinished) {
      const levelEndParams: LevelEndScreenParams = {
        isCorrect
      };
      navigation.navigate('LevelEnd', levelEndParams);
    } else {
      navigation.dispatch(NavigationActions.back());
      // @todo remove it once connected to redux
      if (isCorrect) {
        this.props.nextProgression();
      }
    }
  };

  render() {
    const {isFinished} = this.props;
    const {
      title,
      subtitle,
      tip,
      answers,
      question,
      userAnswers,
      isCorrect,
      keyPoint
    } = this.props.navigation.state.params;
    const backgroundColor = (isCorrect && POSITIVE_COLOR) || NEGATIVE_COLOR;

    return (
      <Screen testID="correction-screen" noScroll style={{backgroundColor}}>
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
        />
      </Screen>
    );
  }
}

const mapStateToProps = ({progression}: StoreState): ConnectedStateProps => ({
  isFinished: progression.current === progression.count
});

const mapDispatchToProps: ConnectedDispatchProps = {
  nextProgression
};

export default connect(mapStateToProps, mapDispatchToProps)(CorrectionScreen);
