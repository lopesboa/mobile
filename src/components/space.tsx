import * as React from 'react';
import {View} from 'react-native';
import type {SpaceType} from '../types';
import theme from '../modules/theme';

interface Props {
  type?: SpaceType;
}

const Space = ({type = 'tiny'}: Props) => (
  <View style={{width: theme.spacing[type], height: theme.spacing[type]}} />
);

export default Space;
