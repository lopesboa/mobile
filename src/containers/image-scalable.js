// @flow strict

import * as React from 'react';
import {View} from 'react-native';

import Image from '../components/image';
import type {Props as ImageProps} from '../components/image';

type Props = ImageProps;

type State = {|
  width?: number,
|};

class ImageScalable extends React.PureComponent<Props, State> {
  props: Props;

  state: State;

  handleLayout = ({nativeEvent}: LayoutEvent) => {
    this.setState({
      width: nativeEvent.layout.width,
    });
  };

  render() {
    const {source, maxHeight, style, testID} = this.props;
    const width = this.state && this.state.width;

    return (
      <View onLayout={this.handleLayout}>
        {width && (
          <Image
            source={source}
            width={width}
            maxHeight={maxHeight}
            style={style}
            testID={testID}
          />
        )}
      </View>
    );
  }
}

export default ImageScalable;
