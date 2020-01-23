// @flow

import * as React from 'react';
import PlaceholderBase from 'rn-placeholder';

type Props = {|
  children: React.Node,
  style?: ViewStyleProp
|};

const Placeholder = ({children, style}: $ReadOnly<Props>) => (
  <PlaceholderBase style={style}>{children}</PlaceholderBase>
);

export default Placeholder;
