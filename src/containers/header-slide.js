// @flow

import * as React from 'react';
import {connect} from 'react-redux';

// @todo remove
import imageLandscape from '../__fixtures__/image-landscape-1.jpg';
import HeaderSlideComponent from '../components/header-slide';
import type {LevelType} from '../types';
import {LEVEL_TYPE} from '../const';

type ConnectedProps = {|
  image?: File,
  level?: LevelType,
  discipline?: string
|};

type Props = {|
  ...ConnectedProps
|};

// react-navigation needs this to be a class
// eslint-disable-next-line react/prefer-stateless-function
class HeaderSlide extends React.Component<Props> {
  props: Props;

  render() {
    const {image, level, discipline} = this.props;

    if (!image || !level || !discipline) {
      return null;
    }

    return <HeaderSlideComponent image={image} level={level} discipline={discipline} />;
  }
}

const mapStateToProps = (): ConnectedProps => ({
  // @todo make it dynamic
  image: imageLandscape,
  level: LEVEL_TYPE.BASE,
  discipline: 'Big Data'
});

export default connect(mapStateToProps)(HeaderSlide);
