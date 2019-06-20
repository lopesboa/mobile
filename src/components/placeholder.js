// @flow

import * as React from 'react';
import PlaceholderBase from 'rn-placeholder';

type Props = {|
  children: React.Node,
  style?: ViewStyleProp,
  renderLeft?: () => React.Node
|};

const Placeholder = ({children, style, renderLeft}: Props) => (
  <PlaceholderBase renderLeft={renderLeft} style={style}>
    {children}
  </PlaceholderBase>
);

export default Placeholder;
