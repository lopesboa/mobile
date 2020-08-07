import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {getCurrentClue, getEngineConfig, getCurrentSlide} from '@coorpacademy/player-store';
import Screen from '../components/screen';
import Clue from '../components/clue';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import {fetchClue} from '../redux/actions/clues';

export interface ConnectedStateProps {
  header?: string;
  clue: string;
  slideId?: string;
  starsDiff?: number;
}

export interface ConnectedDispatchProps {
  fetchClue: typeof fetchClue;
}

interface Props extends NavigationScreenProps, ConnectedStateProps, ConnectedDispatchProps {}

class ClueScreen extends React.PureComponent<Props> {
  handlePress = () => this.props.fetchClue();

  render() {
    const {header, clue, slideId, starsDiff} = this.props;

    return (
      <Screen testID="clue-screen">
        <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
        <Clue
          header={header}
          clue={clue}
          slideId={slideId}
          testID="clue"
          onPress={this.handlePress}
          starsDiff={starsDiff}
        />
      </Screen>
    );
  }
}

const getClueState: typeof getCurrentClue = createSelector([getCurrentClue], (clue) => clue);

const getSlideIdState: (state: StoreState) => string | void = createSelector(
  [getCurrentSlide],
  (slide) => slide && slide._id,
);

const getSlideHeaderState: (state: StoreState) => string | void = createSelector(
  [getCurrentSlide],
  (slide) => slide && slide.question.header,
);

const getStarsDiffState: (state: StoreState) => number | void = createSelector(
  [getEngineConfig],
  (engineConfig) => engineConfig && engineConfig.starsPerAskingClue,
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  clue: getClueState(state),
  slideId: getSlideIdState(state),
  header: getSlideHeaderState(state),
  starsDiff: getStarsDiffState(state),
});

const mapDispatchToProps: ConnectedDispatchProps = {
  fetchClue,
};

export {ClueScreen as Component};
export default connect(mapStateToProps, mapDispatchToProps)(ClueScreen);
