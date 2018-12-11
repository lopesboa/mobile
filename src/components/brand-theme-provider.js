// @flow strict

import * as React from 'react';

type BrandTheme = {|
  colors: {
    primary: string
  }
|};

type Props = {|
  children: React.Node
|};

type State = BrandTheme;

const initialState: State = {
  colors: {
    primary: '#00B0FF'
  }
};

export const BrandThemeContext = React.createContext(initialState);

class BrandThemeProvider extends React.PureComponent<Props, State> {
  props: Props;

  state: State = initialState;

  render() {
    const {children} = this.props;
    return <BrandThemeContext.Provider value={this.state}>{children}</BrandThemeContext.Provider>;
  }
}

export default BrandThemeProvider;
