// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions, NavigationEvents} from 'react-navigation';
import type {ContentType} from '@coorpacademy/progression-engine';
import {getNextContent, getCurrentProgression} from '@coorpacademy/player-store';
import get from 'lodash/fp/get';
import {selectCard} from '../redux/actions/cards';
import LevelEnd, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/level-end';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import Screen from '../components/screen';
import {compareCards} from '../utils/content';
import {getCurrentContent, didUnlockLevel} from '../utils';
import {getBestScore} from '../redux/utils/state-extract';
import type {UnlockedLevelInfo} from '../types';
import translationUtil from '../translations';

type ConnectedDispatchProps = {|
  selectCard: typeof selectCard
|};

type ConnectedStateProps = {|
  contentType: ContentType | void,
  recommendation: DisciplineCard | ChapterCard,
  currentContent: DisciplineCard | ChapterCard | void,
  bestScore?: string,
  nextContent: DisciplineCard | ChapterCard | void,
  unlockedLevelInfo?: UnlockedLevelInfo,
  hasFinishedCourse?: boolean
|};

export type Params = {|
  isCorrect: boolean,
  progressionId: string
|};

type Props = $Exact<{|
  ...ReactNavigation$ScreenPropsWithParams<Params>,
  ...ConnectedStateProps
|}>;

type State = {|
  isFocused: boolean
|};

class LevelEndScreen extends React.PureComponent<Props, State> {
  props: Props;

  state: State;

  state = {
    isFocused: false
  };

  static navigationOptions = ({navigationOptions, navigation}: ReactNavigation$ScreenProps) => ({
    ...navigationOptions,
    headerStyle: {}
  });

  handleClosePress = () => {
    const {navigation} = this.props;
    navigation.dispatch(
      NavigationActions.navigate({
        routeName: 'Home'
      })
    );
  };

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    this.props.selectCard(this.props.recommendation);
    this.props.navigation.navigate('Slide');
  };

  handleButtonPress = () => {
    const {isCorrect} = this.props.navigation.state.params;
    if (this.props.currentContent) {
      if (this.props.hasFinishedCourse) {
        return this.props.navigation.navigate('Home');
      }
      if (this.props.nextContent && isCorrect) {
        this.props.selectCard(this.props.nextContent);
        return this.props.navigation.navigate('Slide');
      }
      this.props.selectCard(this.props.currentContent);
      return this.props.navigation.navigate('Slide');
    }
  };

  handleDidFocus = () => this.setState({isFocused: true});

  render() {
    const {
      contentType,
      navigation,
      recommendation,
      unlockedLevelInfo,
      bestScore = '',
      hasFinishedCourse = false
    } = this.props;
    const {isCorrect} = navigation.state.params;

    const backgroundColor = (isCorrect && POSITIVE_COLOR) || NEGATIVE_COLOR;
    const isLevelUnlocked = unlockedLevelInfo && unlockedLevelInfo.isUnlocked;
    const levelUnlockedName = unlockedLevelInfo && unlockedLevelInfo.levelName;

    return (
      <Screen testID="level-end-screen" noScroll noSafeArea style={{backgroundColor}}>
        <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
        <NavigationEvents onDidFocus={this.handleDidFocus} />
        <LevelEnd
          contentType={contentType}
          recommendation={recommendation}
          isFocused={this.state.isFocused}
          isSuccess={isCorrect}
          bestScore={bestScore}
          isLevelUnlocked={isLevelUnlocked}
          levelUnlockedName={levelUnlockedName}
          onClose={this.handleClosePress}
          onCardPress={this.handleCardPress}
          onButtonPress={this.handleButtonPress}
          hasFinishedCourse={hasFinishedCourse}
        />
      </Screen>
    );
  }
}

export const mapStateToProps = (state: StoreState, {navigation}: Props): ConnectedStateProps => {
  const language = translationUtil.getLanguage();
  const currentProgressionId = navigation.state.params.progressionId;
  const currentContentInfo = get(
    `data.progressions.entities.${currentProgressionId}.content`,
    state
  );

  const bestScore = getBestScore(state);
  const progression = getCurrentProgression(state);
  const contentType = progression && progression.content.type;

  // $FlowFixMe
  const nextContent: DisciplineCard | ChapterCard | void = getNextContent(state);
  const currentContent: DisciplineCard | ChapterCard | void =
    currentContentInfo && getCurrentContent(state.cards, currentContentInfo, language);

  const unlockedLevelInfo =
    currentContentInfo && currentContent && didUnlockLevel(currentContentInfo, currentContent);

  const hasFinishedCourse = currentContent && currentContent.completion === 1;

  return {
    contentType,
    currentContent,
    nextContent,
    bestScore,
    unlockedLevelInfo,
    hasFinishedCourse,
    recommendation: Object.keys(state.cards.entities)
      .map(key => state.cards.entities[key][language])
      .filter(item => item !== undefined)
      .filter(item => item !== currentContent)
      .sort(compareCards)[0]
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LevelEndScreen);
