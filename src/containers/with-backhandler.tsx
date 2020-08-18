import * as React from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BackHandler} from 'react-native';

export function useBackHandler(callback: (navigation) => boolean): void {
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      function handler() {
        return callback(navigation);
      }
      BackHandler.addEventListener('hardwareBackPress', handler);
      return () => BackHandler.removeEventListener('hardwareBackPress', handler);
    }, [navigation, callback]),
  );
}

export const withBackHandler = <P extends never>(
  Component: React.ComponentType<P>,
  callback: (navigation) => boolean,
): ((props: P) => React.ReactNode) => {
  function WithBackHandler(props: P): React.ReactNode {
    useBackHandler(callback);
    return <Component {...props} />;
  }
  return React.memo(WithBackHandler);
};
