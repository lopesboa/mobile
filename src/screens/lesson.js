// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {
  getCurrentSlide,
  getEngineConfig,
  getResourceToPlay,
  selectResource
} from '@coorpacademy/player-store';

import Screen from '../components/screen';
import Lesson from '../components/lesson';
import type {StoreState} from '../redux/store';
import type {Lesson as LessonType} from '../layer/data/_types';
import type {Params as PdfScreenParams} from './pdf';

export type ConnectedStateProps = {|
  header?: string,
  resources?: Array<LessonType>,
  selected?: string,
  starsGranted: number
|};

type ConnectedDispatchProps = {|
  selectResource: typeof selectResource
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedDispatchProps,
  ...ConnectedStateProps
|};

class LessonScreen extends React.PureComponent<Props> {
  props: Props;

  handlePDFButtonPress = (url: string, description: string) => {
    const pdfParams: PdfScreenParams = {
      title: description,
      source: {uri: url}
    };

    this.props.navigation.navigate('PdfModal', pdfParams);
  };

  handleChange = (id: string) => {
    this.props.selectResource(id);
  };

  render() {
    const {header, resources, starsGranted, selected} = this.props;

    return (
      <Screen testID="lesson-screen" noScroll>
        {resources && (
          <Lesson
            header={header}
            resources={resources}
            starsGranted={starsGranted}
            onChange={this.handleChange}
            selected={selected}
            onPDFButtonPress={this.handlePDFButtonPress}
          />
        )}
      </Screen>
    );
  }
}

const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const slide = getCurrentSlide(state);
  const header = (slide && slide.question && slide.question.header) || undefined;
  // $FlowFixMe overrided type
  const resources: Array<LessonType> = (slide && slide.lessons) || [];
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
  selectResource
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen);
