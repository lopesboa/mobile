// @flow strict

import * as React from 'react';
import {HeaderBackButton} from 'react-navigation';
import type {_HeaderBackButtonProps} from 'react-navigation';

import withVibration from './with-vibration';
import type {WithVibrationProps} from './with-vibration';

type Props = {|
  ...WithVibrationProps,
  ...$Exact<_HeaderBackButtonProps>
|};

class HeaderLeft extends React.PureComponent<Props> {
  props: Props;

  handlePress = () => {
    const {onPress, vibration} = this.props;

    vibration.vibrate();

    onPress && onPress();
  };

  render() {
    const {
      /* eslint-disable no-unused-vars */
      vibration,
      /* eslint-enable no-unused-vars */
      ...props
    } = this.props;

    return <HeaderBackButton {...props} onPress={this.handlePress} />;
  }
}

export default withVibration(HeaderLeft);
