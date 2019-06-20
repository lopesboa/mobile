// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {getProgressionContent, getLevel, getChapter} from '@coorpacademy/player-store';
import {getSlide} from '../redux/utils/state-extract';
import type {StoreState} from '../redux/store';
import {getCleanUri} from '../modules/uri';
import HeaderSlideTitleComponent from '../components/header-slide-title';

type ConnectedStateProps = {|
  image?: string,
  subtitle?: string,
  title?: string
|};

type Props = {|
  ...ConnectedStateProps
|};

// react-navigation needs this to be a class
// eslint-disable-next-line react/prefer-stateless-function
class HeaderSlideTitle extends React.Component<Props> {
  props: Props;

  render() {
    const {image = '', subtitle, title} = this.props;

    return <HeaderSlideTitleComponent image={{uri: image}} subtitle={subtitle} title={title} />;
  }
}

export const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const slide = getSlide(state);
  const content = getProgressionContent(state);

  if (!content || !slide) {
    return {
      image: undefined,
      subtitle: undefined,
      title: undefined
    };
  }

  const levelContent = getLevel(content.ref)(state);
  const chapterContent = getChapter(content.ref)(state);

  if (levelContent) {
    return {
      image: levelContent && levelContent.mediaUrl && getCleanUri(levelContent.mediaUrl),
      subtitle: levelContent && levelContent.levelTranslation,
      title: levelContent && levelContent.name
    };
  }
  return {
    image:
      chapterContent &&
      chapterContent.poster &&
      chapterContent.poster.mediaUrl &&
      getCleanUri(chapterContent.poster.mediaUrl),
    subtitle: undefined,
    title: chapterContent && chapterContent.name
  };
};

export default connect(mapStateToProps)(HeaderSlideTitle);
