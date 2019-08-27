// @flow strict

import type {SyntheticEvent, LayoutEvent as _LayoutEvent, ScrollEvent as _ScrollEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationStateRoute
} from 'react-navigation';
import type {
  ____ViewStyleProp_Internal,
  ____TextStyleProp_Internal,
  ____ImageStyleProp_Internal
} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type {EdgeInsetsProp} from 'react-native/Libraries/StyleSheet/EdgeInsetsPropType';
import type {Dispatch as Redux$Dispatch} from 'redux';

import type {StoreState} from '../src/redux/store';

declare type File = number;

// Helper

declare type $ExtractPropType = <T, R>(props: R) => R;
type _ExtractReturn<B, F: (...args: any[]) => B> = B;
declare type $ExtractReturn<F> = _ExtractReturn<*, F>;

// React native types

declare type ViewStyleProp = ____ViewStyleProp_Internal;
declare type TextStyleProp = ____TextStyleProp_Internal;
declare type ImageStyleProp = ____ImageStyleProp_Internal;
declare type AnimationStyleProp = {|
  ...$PropertyType<ViewStyleProp, 'transform'>
|};
declare type FontWeight = $NonMaybeType<$PropertyType<TextStyleProp, 'fontWeight'>>;
declare type FontSize = $NonMaybeType<$PropertyType<TextStyleProp, 'fontSize'>>;
declare type LayoutEvent = SyntheticEvent<LayoutEvent>;
declare type HitSlop = EdgeInsetsProp;
declare type ScrollEvent = _ScrollEvent;

// React navigation props, easier to use

declare type ReactNavigation$ScreenProps = $Exact<NavigationScreenConfig<*>>;
declare type ReactNavigation$ScreenPropsWithParams<P> = $Exact<NavigationScreenConfig<P>>;
declare type ReactNavigation$WithNavigationProps = $Exact<
  NavigationScreenProp<NavigationStateRoute>
>;

// Redux

declare type Dispatch = Redux$Dispatch<*>;
declare type GetState = () => StoreState;
