import * as React from 'react';
import {HeaderBackButton, StackHeaderLeftButtonProps} from '@react-navigation/stack';
import withVibration from './with-vibration';

import type {WithVibrationProps} from './with-vibration';

interface Props extends WithVibrationProps, StackHeaderLeftButtonProps {}

function HeaderLeft(props: Props) {
  const handlePress = () => {
    const {onPress, vibration} = props;
    vibration.vibrate();
    onPress && onPress();
  };

  return <HeaderBackButton {...props} onPress={handlePress} />;
}

export {HeaderLeft as Component};
export default withVibration(HeaderLeft);
