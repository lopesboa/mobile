// @flow strict

import * as React from 'react';

import Text from '../components/text';
import Screen from '../components/screen';

type Props = ReactNavigation$ScreenProps;

const LessonScreen = (props: Props) => (
  <Screen testID="lesson-screen">
    <Text>@todo</Text>
  </Screen>
);

export default LessonScreen;
