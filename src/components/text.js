// @flow strict

import * as React from 'react';
import {Text as TextBase} from 'react-native';

type Props = {|
  // copied from node_modules/react-native/Libraries/Text/TextProps.js
  children: React.Node,
  style?: GenericStyleProp,
  testID?: string
|};

const Text = ({testID, children, style}: Props) => (
  <TextBase style={style} testID={testID}>
    {children}
  </TextBase>
);

export default Text;
