// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {play, getEngineConfig, getResourceToPlay, selectResource} from '@coorpacademy/player-store';
import type {Lesson as LessonType} from '@coorpacademy/progression-engine';

import type {Resource} from '../types';
import type {StoreState} from '../redux/store';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import Screen from '../components/screen';
import Lesson from '../components/lesson';
import {reduceToResources} from '../layer/data/mappers';
import {getSlide} from '../redux/utils/state-extract';
import type {Params as PdfScreenParams} from './pdf';

export type ConnectedStateProps = {|
  header?: string,
  resources?: Array<Resource>,
  selected?: string,
  starsGranted: number
|};

type ConnectedDispatchProps = {|
  play: typeof play,
  selectResource: typeof selectResource
|};

type Props = $Exact<{|
  ...ReactNavigation$ScreenProps,
  ...ConnectedDispatchProps,
  ...ConnectedStateProps
|}>;

class LessonScreen extends React.PureComponent<Props> {
  props: Props;

  handlePDFButtonPress = (url: string, description: string) => {
    const pdfParams: PdfScreenParams = {
      title: description,
      source: {uri: url}
    };

    this.props.play();
    this.props.navigation.navigate('PdfModal', pdfParams);
  };

  handleVideoPlay = () => {
    this.props.play();
  };

  handleChange = (id: string) => {
    this.props.selectResource(id);
  };

  render() {
    const {header, resources, starsGranted, selected} = this.props;

    return (
      <Screen testID="lesson-screen" noScroll>
        <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
        {resources && (
          <Lesson
            header={header}
            resources={resources}
            starsGranted={starsGranted}
            onChange={this.handleChange}
            selected={selected}
            onPDFButtonPress={this.handlePDFButtonPress}
            onVideoPlay={this.handleVideoPlay}
          />
        )}
      </Screen>
    );
  }
}

const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const slide = getSlide(state);
  const header = (slide && slide.question && slide.question.header) || undefined;
  // $FlowFixMe overrided type

  const lessons: Array<LessonType> = (slide && slide.lessons) || [];
  const resources: Array<Resource> = reduceToResources(lessons);

  const currentResource = getResourceToPlay(state);
  const selected = currentResource || (resources[0] && resources[0]._id);

  const engineConfig = getEngineConfig(state);
  const starsGranted = (engineConfig && engineConfig.starsPerResourceViewed) || 0;

  return {
    header,
    resources,
    selected,
    starsGranted
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  play,
  selectResource
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LessonScreen);
