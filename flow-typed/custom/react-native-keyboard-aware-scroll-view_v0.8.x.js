// @flow

// Inspired from https://github.com/APSL/react-native-keyboard-aware-scroll-view/blob/master/index.d.ts

import * as React from 'react'
import {
  ScrollViewProperties,
  FlatListProperties,
  SectionListProperties
} from 'react-native'

declare module 'react-native-keyboard-aware-scroll-view' {
  declare export type KeyboardAwareProps = {|
    innerRef?: (ref: React$Node) => void,
    viewIsInsideTabBar?: boolean,
    resetScrollToCoords?: {
      x: number,
      y: number
    },
    enableResetScrollToCoords?: boolean,
    enableAutomaticScroll?: boolean,
    enableOnAndroid?: boolean,
    extraHeight?: number,
    extraScrollHeight?: number,
    keyboardOpeningTime?: number,
    onKeyboardWillShow?: (frames: Object) => void,
    onKeyboardDidShow?: (frames: Object) => void,
    onKeyboardWillHide?: (frames: Object) => void,
    onKeyboardDidHide?: (frames: Object) => void,
    onKeyboardWillChangeFrame?: (frames: Object) => void,
    onKeyboardDidChangeFrame?: (frames: Object) => void
  |};

  declare export type KeyboardAwareScrollViewProps = {|
    ...KeyboardAwareProps,
    ...ScrollViewProperties
  |};

  declare export type KeyboardAwareFlatListProps<T> = {|
    ...KeyboardAwareProps,
    ...FlatListProperties<T>
  |};

  declare export type KeyboardAwareSectionListProps<T> = {|
    ...KeyboardAwareProps,
    ...SectionListProperties<T>
  |};

  declare export type KeyboardAwareState = {|
    keyboardSpace: number
  |};

  declare class ScrollableComponent<Props, State> extends React$Component<Props, State> {
    getScrollResponder(): void;
    scrollToPosition(x: number, y: number, animated?: boolean): void;
    scrollToEnd(animated?: boolean): void;
    scrollForExtraHeightOnAndroid(extraHeight: number): void;
    scrollToFocusedInput(
      reactNode: Object,
      extraHeight?: number,
      keyboardOpeningTime?: number
    ): void;
  }

  declare export class KeyboardAwareMixin {}

  declare export class KeyboardAwareScrollView extends ScrollableComponent<
    KeyboardAwareScrollViewProps,
    KeyboardAwareState
  > {}
  declare export class KeyboardAwareFlatList extends ScrollableComponent<
    KeyboardAwareFlatListProps<any>,
    KeyboardAwareState
  > {}
  declare export class KeyboardAwareSectionList extends ScrollableComponent<
    KeyboardAwareSectionListProps<any>,
    KeyboardAwareState
  > {}
}
