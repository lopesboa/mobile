// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import {getCurrentProgression} from '@coorpacademy/player-store';
import {selectCard} from '../redux/actions/cards';
import LevelEnd, {POSITIVE_COLOR, NEGATIVE_COLOR} from '../components/level-end';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import Screen from '../components/screen';
import {compareCards} from '../utils/content';
import {getCurrentContent} from '../utils';
import translationUtil from '../translations';

type ConnectedDispatchProps = {|
  selectCard: typeof selectCard
|};
type ConnectedStateProps = {|
  recommendedContent: DisciplineCard | ChapterCard,
  currentContent: DisciplineCard | ChapterCard | void
|};
export type Params = {|
  isCorrect: boolean
|};

type Props = ReactNavigation$ScreenPropsWithParams<Params>;

class LevelEndScreen extends React.PureComponent<Props> {
  props: Props;

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
    this.props.selectCard(item);
    this.props.navigation.navigate('Slide');
  };

  handleButtonPress = () => {
    if (this.props.currentContent) {
      this.props.selectCard(this.props.currentContent);
      this.props.navigation.navigate('Slide');
    }
  };

  render() {
    const {navigation, recommendedContent} = this.props;
    const {isCorrect} = navigation.state.params;

    const backgroundColor = (isCorrect && POSITIVE_COLOR) || NEGATIVE_COLOR;
    return (
      <Screen testID="level-end-screen" noScroll noSafeArea style={{backgroundColor}}>
        <LevelEnd
          recommendedContent={recommendedContent}
          isSuccess={isCorrect}
          onClose={this.handleClosePress}
          onCardPress={this.handleCardPress}
          onButtonPress={this.handleButtonPress}
        />
      </Screen>
    );
  }
}

export const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const language = translationUtil.getLanguage();
  const currentProgression = getCurrentProgression(state);
  const currentContentInfo = currentProgression && currentProgression.content;

  const currentContent =
    // $FlowFixMe
    currentContentInfo && getCurrentContent(state.cards, currentContentInfo, language);
  return {
    currentContent,
    recommendedContent: Object.keys(state.cards.entities)
      .map(key => state.cards.entities[key][language])
      .filter(item => item !== undefined)
      .filter(item => item !== currentContent)
      .sort(compareCards)[0]
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  selectCard
};

export default connect(mapStateToProps, mapDispatchToProps)(LevelEndScreen);
