// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import type {ContentType} from '@coorpacademy/progression-engine';
import {getCurrentContent, getNextContent, getCurrentProgression} from '@coorpacademy/player-store';
import type {LevelAPI, ChapterAPI} from '@coorpacademy/player-services';

import translations from '../translations';
import {createNextProgression} from '../redux/actions/progressions/create-next-progression';
import {selectCard} from '../redux/actions/catalog/cards/select';
import LevelEnd, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/level-end';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import Screen from '../components/screen';
import {compareCards} from '../utils/content';
import {getBestScore} from '../redux/utils/state-extract';
import {CONTENT_TYPE} from '../const';

type ConnectedDispatchProps = {|
  createNextProgression: typeof createNextProgression,
  selectCard: typeof selectCard
|};

export type ConnectedStateProps = {|
  contentType: ContentType | void,
  recommendation: DisciplineCard | ChapterCard,
  bestScore?: string,
  currentContent?: LevelAPI | ChapterAPI,
  nextContent?: LevelAPI | ChapterAPI
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
    return navigation.navigate('Home');
  };

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    const {navigation, recommendation} = this.props;

    this.props.selectCard(recommendation);
    navigation.navigate('Slide');
  };

  handleButtonPress = () => {
    const {navigation, contentType: currentContentType, currentContent, nextContent} = this.props;
    const {isCorrect} = navigation.state.params;

    const contentToStart = isCorrect ? nextContent : currentContent;

    if (contentToStart) {
      this.props.createNextProgression(currentContentType, contentToStart.universalRef);
      return navigation.navigate('Slide');
    }

    return navigation.navigate('Home');
  };

  handleDidFocus = () => this.setState({isFocused: true});

  render() {
    const {contentType, navigation, recommendation, bestScore = '', nextContent} = this.props;
    const {isCorrect} = navigation.state.params;

    const nextContentType =
      nextContent && ((nextContent.chaptersIds && CONTENT_TYPE.LEVEL) || CONTENT_TYPE.CHAPTER);

    const backgroundColor = (isCorrect && POSITIVE_COLOR) || NEGATIVE_COLOR;

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
          nextContentType={nextContentType}
          nextContentLabel={nextContent && nextContent.label}
          onClose={this.handleClosePress}
          onCardPress={this.handleCardPress}
          onButtonPress={this.handleButtonPress}
        />
      </Screen>
    );
  }
}

export const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const language = translations.getLanguage();
  const bestScore = getBestScore(state);
  const progression = getCurrentProgression(state);
  const contentType = progression && progression.content.type;

  // $FlowFixMe union type
  const nextContent: LevelAPI | void = getNextContent(state);

  // $FlowFixMe union type
  const currentContent: LevelAPI | ChapterAPI | void = getCurrentContent(state);

  const cards = Object.keys(state.catalog.entities.cards)
    .map(key => state.catalog.entities.cards[key][language])
    .filter(card => card !== undefined)
    .filter(
      card =>
        !card.modules ||
        !card.modules.find(mod =>
          [mod.ref, mod.universalRef].includes(currentContent && currentContent.universalRef)
        )
    );

  return {
    contentType,
    nextContent,
    currentContent,
    bestScore,
    recommendation: cards.sort(compareCards)[0]
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  createNextProgression,
  selectCard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LevelEndScreen);
