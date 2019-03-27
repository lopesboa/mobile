// @flow strict

import * as React from 'react';
import type {Props as ButtonProps} from '../components/button-sticky';
import Button from '../components/button-sticky';
import type {Layout} from './with-layout';

type State = {|
  layout?: Layout
|};

type Props = ButtonProps;

class ButtonSticky extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    layout: undefined
  };

  handleLayout = ({nativeEvent: {layout}}: LayoutEvent) =>
    this.setState({
      layout
    });

  render() {
    const {children, onPress, testID} = this.props;

    return (
      <Button
        onPress={onPress}
        testID={testID}
        layout={this.state.layout}
        onLayout={this.handleLayout}
      >
        {children}
      </Button>
    );
  }
}

export default ButtonSticky;
