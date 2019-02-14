// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {getProgressionContent, getLevel} from '@coorpacademy/player-store';

import type {StoreState} from '../redux/store';
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
    const {image, subtitle, title} = this.props;

    if (!image || !subtitle || !title) {
      return null;
    }

    return <HeaderSlideTitleComponent image={{uri: image}} subtitle={subtitle} title={title} />;
  }
}

export const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const defaultProps = {
    image: undefined,
    subtitle: undefined,
    title: undefined
  };

  const content = getProgressionContent(state);
  if (!content) return defaultProps;
  const levelContent = getLevel(content.ref)(state);
  return {
    image: levelContent && levelContent.mediaUrl,
    subtitle: levelContent && levelContent.levelTranslation,
    title: levelContent && levelContent.name
  };
};

export default connect(mapStateToProps)(HeaderSlideTitle);
