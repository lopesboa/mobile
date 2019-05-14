// @flow strict

import type {SyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationStateRoute
} from 'react-navigation';
import type {
  ____Styles_Internal,
  ____TextStyle_Internal
} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type {EdgeInsetsProp} from 'react-native/Libraries/StyleSheet/EdgeInsetsPropType';
import type {Dispatch as Redux$Dispatch} from 'redux';

import type {StoreState} from '../src/redux/store';

declare type File = number;

// React native types

declare type GenericStyleProp = ____Styles_Internal;
declare type FontWeight = $NonMaybeType<$PropertyType<____TextStyle_Internal, 'fontWeight'>>;
declare type FontSize = $NonMaybeType<$PropertyType<____TextStyle_Internal, 'fontSize'>>;
declare type LayoutEvent = SyntheticEvent<LayoutEvent>;
declare type HitSlop = EdgeInsetsProp;

// React navigation props, easier to use

declare type ReactNavigation$ScreenProps = $Exact<NavigationScreenConfig<*>>;
declare type ReactNavigation$ScreenPropsWithParams<P> = $Exact<NavigationScreenConfig<P>>;
declare type ReactNavigation$WithNavigationProps = $Exact<
  NavigationScreenProp<NavigationStateRoute>
>;

// Redux

declare type Dispatch = Redux$Dispatch<*>;
declare type GetState = () => StoreState;
