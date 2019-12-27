import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import hoistNonReactStatic from 'hoist-non-react-statics';
import type {Colors} from '../modules/theme';

type WithColorSchemeProps = {
  colorScheme: 'dark' | 'light'
};

function withColorScheme<P>(
  WrappedComponent: React$ComponentType<P>
): React$ComponentType<$Exact<{|...WithColorSchemeProps, ...P|}>> {
  type Props = $Exact<{|
    ...P,
    ...WithColorSchemeProps
  |}>;

  const ComponentWithColorTheme = props => {
    const colorScheme = useColorScheme();
    return <WrappedComponent colorScheme={colorScheme} {...props} />;
  };

  return hoistNonReactStatic(ComponentWithColorTheme, WrappedComponent);
}

export default withColorScheme;
