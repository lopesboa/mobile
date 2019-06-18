// @flow

import * as React from 'react';
import PlaceholderBase from 'rn-placeholder';
import {__E2E__} from '../modules/environment';

type Props = {|
  children: React.Node,
  style?: ViewStyleProp
|};

const Placeholder = ({children, style}: Props) => (
  <PlaceholderBase animation={!__E2E__ && 'fade'} style={style}>
    {children}
  </PlaceholderBase>
);

export default Placeholder;
