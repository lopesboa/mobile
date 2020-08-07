import * as React from 'react';
import {StatusBar} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {
  play,
  getEngineConfig,
  getResourceToPlay,
  selectResource,
  getCurrentSlide,
} from '@coorpacademy/player-store';

import type {Resource} from '../types';
import type {StoreState} from '../redux/store';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import Screen from '../components/screen';
import Lesson from '../components/lesson';
import {mapToResource} from '../layer/data/mappers';
import type {Params as PdfScreenParams} from './pdf';

export interface ConnectedStateProps {
  header?: string;
  resources: Array<Resource>;
  currentResource?: string;
  starsGranted: number;
}

interface ConnectedDispatchProps {
  play: typeof play;
  selectResource: typeof selectResource;
}

type Params = {
  Modals: {screen: string; params: PdfScreenParams};
};

interface Props
  extends StackScreenProps<Params, 'Modals'>,
    ConnectedStateProps,
    ConnectedDispatchProps {}

class LessonScreen extends React.PureComponent<Props> {
  handlePDFButtonPress = (url: string, description?: string) => {
    const params: PdfScreenParams = {
      title: description,
      source: {uri: url},
    };

    this.props.play();
    this.props.navigation.navigate('Modals', {screen: 'Pdf', params});
  };

  handleVideoPlay = () => {
    this.props.play();
  };

  handleChange = (id: string) => {
    this.props.selectResource(id);
  };

  render() {
    const {header, resources, starsGranted, currentResource} = this.props;
    const selected = currentResource || (resources[0] && resources[0]._id);

    return (
      <Screen testID="lesson-screen" noScroll>
        <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
        <Lesson
          header={header}
          resources={resources}
          starsGranted={starsGranted}
          onChange={this.handleChange}
          selected={selected}
          onPDFButtonPress={this.handlePDFButtonPress}
          onVideoPlay={this.handleVideoPlay}
          testID="lesson"
        />
      </Screen>
    );
  }
}

const getHeaderState: (state: StoreState) => string | void = createSelector(
  [getCurrentSlide],
  (slide) => slide && slide.question && slide.question.header,
);

const getResourcesState: (state: StoreState) => Array<Resource> = createSelector(
  [getCurrentSlide],
  (slide) => {
    const lessons = (slide && slide.lessons) || [];

    return lessons.map(mapToResource).filter((lesson) => lesson.url);
  },
);

const getCurrentResourceState: typeof getResourceToPlay = createSelector(
  [getResourceToPlay],
  (resource) => resource,
);

const getStarsGrantedState: (state: StoreState) => number = createSelector(
  [getEngineConfig],
  (engineConfig) => (engineConfig && engineConfig.starsPerResourceViewed) || 0,
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  header: getHeaderState(state),
  resources: getResourcesState(state),
  currentResource: getCurrentResourceState(state),
  starsGranted: getStarsGrantedState(state),
});

const mapDispatchToProps: ConnectedDispatchProps = {
  play,
  selectResource,
};

export {LessonScreen as Component};
export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen);
