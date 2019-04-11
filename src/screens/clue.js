// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {getCurrentClue, getClue, getEngineConfig} from '@coorpacademy/player-store';

import {getSlide} from '../redux/utils/state-extract';
import Screen from '../components/screen';
import Clue from '../components/clue';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';

export type ConnectedStateProps = {|
  header?: string,
  clue: string,
  slideId?: string,
  starsDiff?: number
|};

export type ConnectedDispatchProps = {|
  getClue: () => typeof getClue
|};

type Props = $Exact<{|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateProps,
  ...ConnectedDispatchProps
|}>;

class ClueScreen extends React.PureComponent<Props> {
  props: Props;

  handlePress = () => {
    this.props.getClue();
  };

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

const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const clue = getCurrentClue(state);
  const slide = getSlide(state);
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClueScreen);
