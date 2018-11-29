// @flow strict

import type {NavigationScreenConfig} from 'react-navigation';

// This is a bastardization of the true GenericStyleProp type located in
// react-native/Libraries/StyleSheet/StyleSheetTypes. We unfortunately can't
// import that here, and it's too lengthy (and consequently too brittle) to
// copy-paste here either.
declare type GenericStyleProp =
  | null
  | void
  | number
  | false
  | ''
  | $ReadOnlyArray<GenericStyleProp>
  | { [name: string]: any };

// React navigation props, easier to use

declare type ReactNavigation$ScreenProps = $Exact<NavigationScreenConfig<*>>;
declare type ReactNavigation$ScreenPropsWithParams<P> = $Exact<NavigationScreenConfig<P>>
