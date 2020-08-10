import * as React from 'react';
import {NavigationProp, useFocusEffect, useIsFocused} from '@react-navigation/native';

type Params = Record<string, unknown>;

export const navigatorRef = React.createRef();
export const isReadyRef = React.createRef();

export function navigate(name: string, params?: Params) {
  if (isReadyRef.current && navigatorRef.current) {
    // Perform navigation if the app has mounted
    navigatorRef.current.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}
export interface Props {
  isFocused: boolean;
  navigation?: NavigationProp<{App: undefined}, 'App'>;
}

export const withNavigation = <P extends {}>(
  Component: React.ComponentType<P>,
): ((props: P & Props) => React.ReactNode) => {
  function WithNavigation(props: P & Props): React.ReactNode {
    const isFocused = useIsFocused();
    return <Component {...props} navigation={navigatorRef?.current} isFocused={isFocused} />;
  }
  return React.memo(WithNavigation);
};
