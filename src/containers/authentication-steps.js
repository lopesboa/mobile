// @flow

import * as React from 'react';

import AuthenticationStepsComponent from '../components/authentication-steps';
import type {Props as AuthenticationStepsProps} from '../components/authentication-steps';

export type Props = $Rest<
  AuthenticationStepsProps,
  {|
    currentIndex: $PropertyType<AuthenticationStepsProps, 'currentIndex'>,
    onChange: $PropertyType<AuthenticationStepsProps, 'onChange'>
  |}
> & {|
  currentIndex?: $PropertyType<AuthenticationStepsProps, 'currentIndex'>,
  onChange?: $PropertyType<AuthenticationStepsProps, 'onChange'>
|};

type State = {|
  currentIndex: number
|};

class AuthenticationSteps extends React.PureComponent<$ReadOnly<Props>, State> {
  props: $ReadOnly<Props>;

  state: State = {
    currentIndex: this.props.currentIndex || 0
  };

  handleChange = (index: number) => {
    const {onChange} = this.props;

    this.setState(
      {
        currentIndex: index
      },
      () => {
        onChange && onChange(index);
      }
    );
  };

  render() {
    return (
      <AuthenticationStepsComponent
        {...this.props}
        currentIndex={this.state.currentIndex}
        onChange={this.handleChange}
      />
    );
  }
}

export default AuthenticationSteps;
