// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import Screen from '../components/screen';
import Lesson from '../components/lesson';
import type {StoreState} from '../redux';
import type {Lesson as LessonType} from '../services/content/types';
// @todo remove below once connected to redux
import {lessonWithVideo, lessonWithPdf} from '../__fixtures__/lesson';
import {slide as mockSlide} from '../__mocks__/slides';

export type ConnectedStateProps = {|
  header: string,
  resources: Array<LessonType>
|};

type Props = ReactNavigation$ScreenProps;

const LessonScreen = ({header, resources}: Props) => (
  <Screen testID="lesson-screen">
    <Lesson header={header} resources={resources} />
  </Screen>
);

const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  // @todo remove once connected to redux
  header: mockSlide.question.header,
  resources: [lessonWithVideo, lessonWithPdf]
});

export default connect(mapStateToProps)(LessonScreen);
