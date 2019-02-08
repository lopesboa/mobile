// @flow strict

import type {SyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import type {NavigationScreenConfig} from 'react-navigation';
import type {
  ____Styles_Internal,
  ____TextStyle_Internal
} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type {Dispatch as Redux$Dispatch} from 'redux';

import type {StoreState} from '../src/redux/store';

declare type File = number;

// React native types

declare type GenericStyleProp = ____Styles_Internal;
declare type FontWeight = ____TextStyle_Internal.fontWeight;
declare type LayoutEvent = SyntheticEvent<LayoutEvent>;

// React navigation props, easier to use

declare type ReactNavigation$ScreenProps = $Exact<NavigationScreenConfig<*>>;
declare type ReactNavigation$ScreenPropsWithParams<P> = $Exact<NavigationScreenConfig<P>>;

// Redux

declare type Dispatch = Redux$Dispatch<*>;
declare type GetState = () => StoreState;
