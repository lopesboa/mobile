// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {
  getCurrentSlide,
  getCurrentClue,
  getClue,
  getEngineConfig
} from '@coorpacademy/player-store';
import Screen from '../components/screen';
import Clue from '../components/clue';

export type ConnectedStateProps = {|
  header?: string,
  clue: string,
  slideId?: string,
  starsDiff?: number
|};

export type ConnectedDispatchProps = {|
  getClue: () => typeof getClue
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateProps,
  ...ConnectedDispatchProps
|};

class ClueScreen extends React.PureComponent<Props> {
  props: Props;

  handlePress = () => {
    this.props.getClue();
  };

  render() {
    const {header, clue, slideId, starsDiff} = this.props;

    return (
      <Screen testID="clue-screen">
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

const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const clue = getCurrentClue(state);
  const slide = getCurrentSlide(state);
  const engineConfig = getEngineConfig(state);
  const slideId = slide && slide._id;
  // $FlowFixMe union type
  const header = slide && slide.question.header;
  const starsDiff = engineConfig && engineConfig.starsPerAskingClue;
  return {
    clue,
    slideId,
    header,
    starsDiff
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  getClue: () => getClue
};

export default connect(mapStateToProps, mapDispatchToProps)(ClueScreen);
