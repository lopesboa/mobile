// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

export type Layout = {|
  width: number,
  height: number
|};

export type WithLayoutProps = {|
  layout?: Layout
|};

const styles: GenericStyleProp = StyleSheet.create({
  container: {
    flex: 1
  }
});

function withLayout<P>(
  WrappedComponent: React$ComponentType<P>
): React$ComponentType<React$ElementConfig<React$ComponentType<WithLayoutProps & P>>> {
  type Props = $Exact<{|
    ...P,
    ...WithLayoutProps
  |}>;
  type State = {|
    layout?: Layout
  |};
  class ComponentWithLayout extends React.PureComponent<Props, State> {
    props: Props;

    state: State = {
      layout: undefined
    };

    handleLayout = ({nativeEvent: {layout}}: LayoutEvent) =>
      this.setState({
        layout
      });

    render() {
      return (
        <View onLayout={this.handleLayout} style={styles.container}>
          <WrappedComponent {...this.props} layout={this.state.layout} />
        </View>
      );
    }
  }

  return hoistNonReactStatic(ComponentWithLayout, WrappedComponent);
}

export default withLayout;
