// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {getCurrentSlide} from '@coorpacademy/player-store';

import Screen from '../components/screen';
import Lesson from '../components/lesson';
import type {StoreState} from '../redux/store';

import type {Lesson as LessonType} from '../layer/data/_types';

export type ConnectedStateProps = {|
  header?: string,
  resources?: Array<LessonType>
|};

type Props = ReactNavigation$ScreenProps;
const LessonScreen = ({header, resources}: Props) => (
  <Screen testID="lesson-screen">
    {resources && <Lesson header={header} resources={resources} />}
  </Screen>
);

const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const slide = getCurrentSlide(state);

  return {
    // $FlowFixMe union type
    header: slide && slide.question && slide.question.header,
    // $FlowFixMe union type
    resources: slide && slide.lessons
  };
};

export default connect(mapStateToProps)(LessonScreen);
