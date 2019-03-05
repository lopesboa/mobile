// @flow strict

import * as React from 'react';

type BrandTheme = {|
  host: string,
  colors: {
    primary: string
  },
  name: string
|};

type Props = {|
  children: React.Node
|};

type State = BrandTheme;

const initialState: State = {
  // @todo deal with real data
  host: 'https://onboarding.coorpacademy.com',
  colors: {
    primary: '#00B0FF'
  },
  name: 'custombrand'
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
