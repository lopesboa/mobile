import * as React from 'react';
import {View} from 'react-native';
import {storiesOf} from '@storybook/react-native';
import {TestContextProvider} from '../utils/tests';
import Switch from './switch';

const SwitchWithState = () => {
  const [isActive, setIsActive] = React.useState(true);
  function handleOnPress() {
    setIsActive((prev) => !prev);
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Switch isActive={isActive} onPress={handleOnPress} testID="switch" />
    </View>
  );
};

storiesOf('Switch', module).add('default', () => (
  <TestContextProvider>
    <SwitchWithState />
  </TestContextProvider>
));
