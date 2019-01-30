// @flow

import * as React from 'react';
import {connect} from 'react-redux';

// @todo remove
import imageLandscape from '../__fixtures__/image-landscape-1.jpg';
import HeaderSlideTitleComponent from '../components/header-slide-title';
import type {LevelType} from '../types';
import {LEVEL_TYPE} from '../const';

type ConnectedStateProps = {|
  image?: File,
  level?: LevelType,
  discipline?: string
|};

type Props = {|
  ...ConnectedStateProps
|};

// react-navigation needs this to be a class
// eslint-disable-next-line react/prefer-stateless-function
class HeaderSlideTitle extends React.Component<Props> {
  props: Props;

  render() {
    const {image, level, discipline} = this.props;

    if (!image || !level || !discipline) {
      return null;
    }

    return <HeaderSlideTitleComponent image={image} level={level} discipline={discipline} />;
  }
}

const mapStateToProps = (): ConnectedStateProps => ({
  // @todo make it dynamic
  image: imageLandscape,
  level: LEVEL_TYPE.BASE,
  discipline: 'Big Data'
});

export default connect(mapStateToProps)(HeaderSlideTitle);
