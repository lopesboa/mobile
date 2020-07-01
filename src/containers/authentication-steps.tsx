import * as React from 'react';

import AuthenticationStepsComponent from '../components/authentication-steps';
import type {Props as AuthenticationStepsProps} from '../components/authentication-steps';

export interface Props {
  currentIndex: Pick<AuthenticationStepsProps, 'currentIndex'>;
  onChange: Pick<AuthenticationStepsProps, 'onChange'>;
  currentIndex?: Pick<AuthenticationStepsProps, 'currentIndex'>;
  onChange?: Pick<AuthenticationStepsProps, 'onChange'>;
}

type State = {
  currentIndex: number;
};

class AuthenticationSteps extends React.PureComponent<Props, State> {
  state: State = {
    currentIndex: this.props.currentIndex || 0,
  };

  handleChange = (index: number) => {
    const {onChange} = this.props;

    this.setState(
      {
        currentIndex: index,
      },
      () => {
        onChange && onChange(index);
      },
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
