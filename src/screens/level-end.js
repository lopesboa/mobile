// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {NavigationEvents} from 'react-navigation';
import type {ContentType} from '@coorpacademy/progression-engine';
import {getCurrentContent, getNextContent, getCurrentProgression} from '@coorpacademy/player-store';
import type {LevelAPI, ChapterAPI} from '@coorpacademy/player-services';

import Screen from '../components/screen';
import LevelEnd, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/level-end';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {compareCards} from '../utils/content';
import {CONTENT_TYPE} from '../const';
import translations from '../translations';
import {createNextProgression} from '../redux/actions/progressions/create-next-progression';
import {selectCard} from '../redux/actions/catalog/cards/select';
import {getBestScore, getCards} from '../redux/utils/state-extract';

type ConnectedDispatchProps = {|
  createNextProgression: typeof createNextProgression,
  selectCard: typeof selectCard
|};

export type ConnectedStateProps = {|
  contentType?: ContentType,
  recommendation: DisciplineCard | ChapterCard,
  bestScore?: number,
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

  handleClose = () => {
    const {navigation} = this.props;
    return navigation.navigate('Home');
  };

  handleCardPress = (item: DisciplineCard | ChapterCard) => {
    const {navigation} = this.props;

    this.props.selectCard(item);
    navigation.navigate('Slide');
  };

  handleButtonPress = () => {
    const {navigation, currentContent, nextContent} = this.props;
    const {isCorrect} = navigation.state.params;

    const contentToStart = isCorrect ? nextContent : currentContent;

    if (contentToStart) {
      const nextContentType = this.getContentType(contentToStart);
      this.props.createNextProgression(nextContentType, contentToStart.universalRef);
      return navigation.navigate('Slide');
    }

    return navigation.navigate('Home');
  };

  handleDidFocus = () => this.setState({isFocused: true});

  getContentType = (content: LevelAPI | ChapterAPI): ContentType =>
    content.chapterIds ? CONTENT_TYPE.LEVEL : CONTENT_TYPE.CHAPTER;

  getContentLabel = (content: LevelAPI | ChapterAPI): string | void =>
    content.chapterIds ? content.levelTranslation : undefined;

  render() {
    const {contentType, navigation, recommendation, bestScore, nextContent} = this.props;
    const {isCorrect} = navigation.state.params;

    const backgroundColor = (isCorrect && POSITIVE_COLOR) || NEGATIVE_COLOR;

    const nextContentType = nextContent && this.getContentType(nextContent);
    const nextContentLabel = nextContent && this.getContentLabel(nextContent);

    return (
      <Screen testID="level-end-screen" noScroll noSafeArea style={{backgroundColor}}>
        <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
        <NavigationEvents onDidFocus={this.handleDidFocus} testID="level-end-navigation-events" />
        <LevelEnd
          contentType={contentType}
          recommendation={recommendation}
          isFocused={this.state.isFocused}
          isSuccess={isCorrect}
          bestScore={bestScore}
          nextContentType={nextContentType}
          nextContentLabel={nextContentLabel}
          onClose={this.handleClose}
          onCardPress={this.handleCardPress}
          onButtonPress={this.handleButtonPress}
          testID="level-end"
        />
      </Screen>
    );
  }
}

const getBestScoreState = createSelector(
  [getBestScore],
  bestScore => bestScore
);

const getCurrentContentState = createSelector(
  [getCurrentContent],
  currentContent => {
    // $FlowFixMe wrong type
    const _currentContent: LevelAPI | ChapterAPI | void = currentContent;

    return _currentContent;
  }
);

const getRecommendationState = createSelector(
  [getCurrentContent, getCards],
  (currentContent, cards) => {
    // $FlowFixMe wrong type
    const _currentContent: LevelAPI | ChapterAPI | void = currentContent;
    // $FlowFixMe Object.values returns mixed
    let _cards: Array<DisciplineCard | ChapterCard> = Object.values(cards);
    _cards = _cards
      .map(card => card[translations.getLanguage()])
      .filter(Boolean)
      .filter(
        card =>
          !card.modules ||
          !card.modules.find(mod =>
            [mod.ref, mod.universalRef].includes(_currentContent && _currentContent.universalRef)
          )
      )
      .sort(compareCards);

    return _cards[0];
  }
);

const getNextContentState = createSelector(
  [getNextContent],
  nextContent => {
    // $FlowFixMe wrong type
    const _nextContent: LevelAPI | void = nextContent;

    return _nextContent;
  }
);

const getContextTypeState: StoreState => void | ContentType = createSelector(
  [getCurrentProgression],
  progression => progression && progression.content.type
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  contentType: getContextTypeState(state),
  nextContent: getNextContentState(state),
  currentContent: getCurrentContentState(state),
  bestScore: getBestScoreState(state),
  recommendation: getRecommendationState(state)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  createNextProgression,
  selectCard
};

export {LevelEndScreen as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LevelEndScreen);
