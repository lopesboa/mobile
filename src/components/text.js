// @flow

import * as React from 'react';
import {Text as TextBase} from 'react-native';
import type {TextProps} from 'react-native/Libraries/Text/TextProps';

type Props = TextProps;

const Text = ({children, style}: Props) => <TextBase style={style}>{children}</TextBase>;

export default Text;
