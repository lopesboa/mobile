import * as React from 'react';
import {HeaderBackButton} from 'react-navigation';
import type {_HeaderBackButtonProps} from 'react-navigation';

import {BackHandler} from '../modules/back-handler';
import withVibration from './with-vibration';
import type {WithVibrationProps} from './with-vibration';

interface Props extends WithVibrationProps, _HeaderBackButtonProps {}

class HeaderLeft extends React.PureComponent<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.handlePress();
    return true;
  };

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

export {HeaderLeft as Component};
export default withVibration(HeaderLeft);
