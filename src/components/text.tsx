import * as React from 'react';
import {Text as TextBase, Platform, StyleSheet, TextStyle} from 'react-native';

interface Props {
  // copied from node_modules/react-native/Libraries/Text/TextProps.js
  children: React.ReactNode;
  style?: TextStyle;
  testID?: string;
  numberOfLines?: number;
}

export const DEFAULT_STYLE = {
  ...Platform.select({
    android: {
      fontFamily: 'Roboto',
    },
  }),
};

const styles = StyleSheet.create({
  text: {
    ...DEFAULT_STYLE,
  },
});

const Text = ({testID, children, style, numberOfLines}: Props) => (
  <TextBase style={[styles.text, style]} testID={testID} numberOfLines={numberOfLines}>
    {children}
  </TextBase>
);

export default Text;
