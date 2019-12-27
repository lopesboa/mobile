import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {THEME_PREFERENCE} from '../const';

function useDarkMode() {
  const currentColorScheme = useColorScheme();
  const isDarkModeActivated = currentColorScheme === THEME_PREFERENCE.DARK;
  return isDarkModeActivated;
}

type WithDarkModeProps = {
  isDarkModeActivated: boolean
};

function withDarkMode<P>(
  WrappedComponent: React$ComponentType<P>
): React$ComponentType<$Exact<{|...WithDarkModeProps, ...P|}>> {
  type Props = $Exact<{|
    ...P,
    ...WithDarkModeProps
  |}>;

  const ComponentWithDarkMode = props => {
    const isDarkModeActivated = useDarkMode();
    return <WrappedComponent isDarkModeActivated={isDarkModeActivated} {...props} />;
  };

  return hoistNonReactStatic(ComponentWithDarkMode, WrappedComponent);
}

export {useDarkMode};
export default withDarkMode;
