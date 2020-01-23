// @flow strict

import * as React from 'react';
import {HeaderBackButton} from 'react-navigation';
import type {_HeaderBackButtonProps} from 'react-navigation';

import withVibration from './with-vibration';
import type {WithVibrationProps} from './with-vibration';

type OwnProps = _HeaderBackButtonProps;

type Props = WithVibrationProps & OwnProps;

class HeaderLeft extends React.PureComponent<$ReadOnly<Props>> {
  props: $ReadOnly<Props>;

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

export default withVibration<OwnProps>(HeaderLeft);
