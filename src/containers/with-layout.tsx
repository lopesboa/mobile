import * as React from 'react';
import {View, ViewStyle} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

export type Layout = {
  width: number;
  height: number;
};

export interface WithLayoutProps {
  onLayout?: (arg0) => void;
  layout?: Layout;
  containerStyle?: ViewStyle;
}

function withLayout(
  WrappedComponent: React.ElementType<any>,
  options?: {
    withoutContainer?: boolean;
  },
) {
  type Props = WithLayoutProps;
  type State = {
    layout?: Layout;
  };
  class ComponentWithLayout extends React.PureComponent<Props, State> {
    state: State = {
      layout: undefined,
    };

    handleLayout = ({nativeEvent: {layout}}) =>
      this.setState({
        layout,
      });

    render() {
      const containerStyle: ViewStyle = this.props.containerStyle;

      if (options && options.withoutContainer) {
        return (
          <WrappedComponent
            {...this.props}
            layout={this.state.layout}
            onLayout={this.handleLayout}
          />
        );
      }

      return (
        <View onLayout={this.handleLayout} style={containerStyle}>
          <WrappedComponent {...this.props} layout={this.state.layout} />
        </View>
      );
    }
  }

  return hoistNonReactStatic(ComponentWithLayout, WrappedComponent);
}

export default withLayout;
