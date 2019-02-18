// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {getCurrentSlide} from '@coorpacademy/player-store';

import Screen from '../components/screen';
import Lesson from '../components/lesson';
import type {StoreState} from '../redux/store';

import type {Lesson as LessonType} from '../layer/data/_types';
import type {Params as PdfScreenParams} from './pdf';

export type ConnectedStateProps = {|
  header?: string,
  resources?: Array<LessonType>
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
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

  render() {
    const {header, resources} = this.props;

    return (
      <Screen testID="lesson-screen">
        {resources && (
          <Lesson
            header={header}
            resources={resources}
            onPDFButtonPress={this.handlePDFButtonPress}
          />
        )}
      </Screen>
    );
  }
}

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
