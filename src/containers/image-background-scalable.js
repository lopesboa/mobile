// @flow strict

import * as React from 'react';
import {View, ImageBackground} from 'react-native';

import witLayout from './with-layout';
import type {WithLayoutProps} from './with-layout';

type Props = {|
  ...WithLayoutProps,
  testID?: string,
  source: File,
  style?: GenericStyleProp,
  resizeMode: 'cover' | 'contain'
|};

const ImageBackroundScalable = ({source, style, testID, layout, resizeMode}: Props) => {
  return layout ? (
    <View style={{width: layout.width}}>
      <ImageBackground source={source} style={style} testID={testID} resizeMode={resizeMode} />
    </View>
  ) : null;
};

export default witLayout(ImageBackroundScalable);
