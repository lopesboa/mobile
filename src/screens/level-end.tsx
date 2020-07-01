/* eslint-disable import/max-dependencies*/

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {NavigationEvents, NavigationScreenProps} from 'react-navigation';
import type {ContentType, Media} from '@coorpacademy/progression-engine';
import {
  getCurrentContent,
  getNextContent,
  getCurrentProgression,
  getCurrentExitNode,
} from '@coorpacademy/player-store';
import type {LevelAPI, ChapterAPI, ExitNodeAPI} from '@coorpacademy/player-services';

import Screen from '../components/screen';
import LevelEnd, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/level-end';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {compareCards} from '../utils/content';
import {CONTENT_TYPE} from '../const';
import translations from '../translations';
import {createNextProgression} from '../redux/actions/progressions/create-next-progression';
import {changeAnswerValidationStatus} from '../redux/actions/ui/answers';
import {selectCard} from '../redux/actions/catalog/cards/select';
import {getBestScore, getCards} from '../redux/utils/state-extract';
import {edit as editSearch} from '../redux/actions/ui/search';
import {getAllowedParamsForSearch} from '../utils/search';
import {getQueryParamsFromURL} from '../modules/uri';
import type {Params as PdfScreenParams} from './pdf';

interface ConnectedDispatchProps {
  createNextProgression: typeof createNextProgression;
  selectCard: typeof selectCard;
  editSearch: typeof editSearch;
  changeAnswerValidationStatus: typeof changeAnswerValidationStatus;
}

export interface ConnectedStateProps {
  contentType?: ContentType;
  recommendation: DisciplineCard | ChapterCard;
  bestScore?: number;
  currentContent?: LevelAPI | ChapterAPI;
  nextContent?: LevelAPI | ChapterAPI | ExitNodeAPI;
  feedbackTitle?: string;
  feedbackDescription?: string;
  feedbackMedia?: Media;
}

export type Params = {
  isCorrect: boolean;
  progressionId: string;
};

interface Props extends NavigationScreenProps, ConnectedStateProps, ConnectedDispatchProps {}

type State = {
  isFocused: boolean;
};

class LevelEndScreen extends React.PureComponent<Props, State> {
  state: State = {
    isFocused: false,
  };

  componentWillUnmount() {
    this.props.changeAnswerValidationStatus(false);
  }

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

  handlePDFButtonPress = (url: string, description?: string) => {
    const pdfParams: PdfScreenParams = {
      title: description,
      source: {uri: url},
    };

    this.props.navigation.navigate('PdfModal', pdfParams);
  };

  handleFeedbackLinkPress = (url: string) => {
    const params = getQueryParamsFromURL(url);
    const allowedSearchParams = getAllowedParamsForSearch(params);
    this.props.editSearch({params: allowedSearchParams});
    this.props.navigation.navigate('Search');
  };

  handleDidFocus = () => this.setState({isFocused: true});

  getContentType = (content: LevelAPI | ChapterAPI): ContentType =>
    content.chapterIds ? CONTENT_TYPE.LEVEL : CONTENT_TYPE.CHAPTER;

  getContentLabel = (content: LevelAPI | ChapterAPI): string | void =>
    content.chapterIds ? content.levelTranslation : undefined;

  render() {
    const {
      contentType,
      navigation,
      recommendation,
      bestScore,
      nextContent,
      feedbackTitle,
      feedbackDescription,
      feedbackMedia,
    } = this.props;
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
          feedbackTitle={feedbackTitle}
          feedbackDescription={feedbackDescription}
          feedbackMedia={feedbackMedia}
          onClose={this.handleClose}
          onCardPress={this.handleCardPress}
          onButtonPress={this.handleButtonPress}
          onPDFButtonPress={this.handlePDFButtonPress}
          onFeedbackLinkPress={this.handleFeedbackLinkPress}
          testID="level-end"
        />
      </Screen>
    );
  }
}

const getBestScoreState = createSelector([getBestScore], (bestScore) => bestScore);

const getCurrentContentState = createSelector([getCurrentContent], (currentContent) => {
  // @ts-ignore wrong type
  const _currentContent: LevelAPI | ChapterAPI | void = currentContent;

  return _currentContent;
});

const getRecommendationState = createSelector(
  [getCurrentContent, getCards],
  (currentContent, cards) => {
    // @ts-ignore wrong type
    const _currentContent: LevelAPI | ChapterAPI | void = currentContent;
    // @ts-ignore Object.values returns mixed
    let _cards: Array<DisciplineCard | ChapterCard> = Object.values(cards);
    _cards = _cards
      .map((card) => card[translations.getLanguage()])
      .filter(Boolean)
      .filter(
        (card) =>
          !card.modules ||
          !card.modules.find((mod) =>
            [mod.ref, mod.universalRef].includes(_currentContent && _currentContent.universalRef),
          ),
      )
      .sort(compareCards);

    return _cards[0];
  },
);

const getNextContentState = createSelector([getNextContent], (nextContent) => {
  // @ts-ignore wrong type
  const _nextContent: LevelAPI | void = nextContent;

  return _nextContent;
});

const getContextTypeState: (state: StoreState) => void | ContentType = createSelector(
  [getCurrentProgression],
  (progression) => progression && progression.content.type,
);

const getFeedbackTitleState = createSelector(
  [getCurrentExitNode],
  (exitNode) => exitNode && exitNode.title,
);

const getFeedbackDescriptionState = createSelector(
  [getCurrentExitNode],
  (exitNode) => exitNode && exitNode.description,
);

const getFeedbackMediaState = createSelector(
  [getCurrentExitNode],
  (exitNode) => exitNode && exitNode.media,
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  contentType: getContextTypeState(state),
  nextContent: getNextContentState(state),
  currentContent: getCurrentContentState(state),
  bestScore: getBestScoreState(state),
  recommendation: getRecommendationState(state),
  feedbackTitle: getFeedbackTitleState(state),
  feedbackDescription: getFeedbackDescriptionState(state),
  feedbackMedia: getFeedbackMediaState(state),
});

const mapDispatchToProps: ConnectedDispatchProps = {
  createNextProgression,
  selectCard,
  editSearch,
  changeAnswerValidationStatus,
};

export {LevelEndScreen as Component};
export default connect(mapStateToProps, mapDispatchToProps)(LevelEndScreen);
