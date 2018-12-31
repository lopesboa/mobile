// @flow

import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';

// This is a version fixed because the current version of this package is not correct
// Inspired from https://github.com/react-native-community/react-native-linear-gradient/blob/master/common.js

declare module 'react-native-linear-gradient' {
  declare type Point = {|
    x: number,
    y: number
  |};
  declare type Props = {|
    ...ViewProps,
    start?: Point,
    end?: Point,
    colors: Array<string>,
    locations?: Array<number>,
    useAngle?: boolean,
    angleCenter?: Point,
    angle?: number
  |};

  declare class LinearGradient extends React$Component<Props> {}

  declare export default typeof LinearGradient
}
