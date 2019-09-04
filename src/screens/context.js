// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import type {Media} from '@coorpacademy/progression-engine';
import {getCurrentSlide} from '@coorpacademy/player-store';

import Screen from '../components/screen';
import Context from '../components/context';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import type {Params as PdfScreenParams} from './pdf';

export type ConnectedStateProps = {|
  header?: string,
  description?: string,
  media?: Media
|};

type Props = $Exact<{|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateProps
|}>;

class ContextScreen extends React.PureComponent<Props> {
  props: Props;

  handleButtonPress = () => {
    this.props.navigation.navigate('Question');
  };

  handleLinkPress = (_, url) => {
    this.props.navigation.navigate('BrowserModal', {url});
  };

  handlePDFButtonPress = (url: string, description: string) => {
    const pdfParams: PdfScreenParams = {
      title: description,
      source: {uri: url}
    };

    this.props.navigation.navigate('PdfModal', pdfParams);
  };

  render() {
    const {header, description, media} = this.props;

    return (
      <Screen testID="context-screen">
        <StatusBar barStyle="dark-content" backgroundColor={HEADER_BACKGROUND_COLOR} />
        <Context
          header={header}
          description={description}
          media={media}
          onPress={this.handleButtonPress}
          onPDFButtonPress={this.handlePDFButtonPress}
          onLinkPress={this.handleLinkPress}
          testID="context"
        />
      </Screen>
    );
  }
}

export const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const slide = getCurrentSlide(state);
  const context = slide && slide.context;

  return {
    description: context && context.description,
    header: context && context.title,
    media: context && context.media
  };
};

export default connect(mapStateToProps)(ContextScreen);
