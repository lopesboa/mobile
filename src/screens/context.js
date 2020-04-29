// @flow

import * as React from 'react';
import {StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import type {Media} from '@coorpacademy/progression-engine';
import {getCurrentSlide, getContextMedia} from '@coorpacademy/player-store';

import Screen from '../components/screen';
import Context from '../components/context';
import {HEADER_BACKGROUND_COLOR} from '../navigator/navigation-options';
import type {Params as PdfScreenParams} from './pdf';
import type {Params as BrowserScreenParams} from './browser';

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

  handleLinkPress = (url: string) => {
    const params: BrowserScreenParams = {
      url
    };
    this.props.navigation.navigate('BrowserModal', params);
  };

  handlePDFButtonPress = (url: string, description?: string) => {
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

const getContextDescriptionState: StoreState => string | void = createSelector(
  [getCurrentSlide],
  slide => slide && slide.context && slide.context.description
);

const getContextHeaderState: StoreState => string | void = createSelector(
  [getCurrentSlide],
  slide => slide && slide.context && slide.context.title
);

const getContextMediaState: StoreState => Media | void = createSelector(
  [getContextMedia],
  media => media
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  description: getContextDescriptionState(state),
  header: getContextHeaderState(state),
  media: getContextMediaState(state)
});

export {ContextScreen as Component};
export default connect(mapStateToProps)(ContextScreen);
