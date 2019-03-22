// @flow strict

import * as React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {NovaCompositionCoorpacademySpiral as Spiral} from '@coorpacademy/nova-icons';

export type Props = {|
  color: string,
  style?: GenericStyleProp,
  spiralStyle?: GenericStyleProp,
  testID?: string
|};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden'
  }
});

const Starburst = ({color, testID, style, spiralStyle}: Props) => {
  const screenSize: number = Dimensions.get('window').height;
  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={spiralStyle}>
        <Spiral color={color} width={screenSize} height={screenSize} />
      </View>
    </View>
  );
};

export default Starburst;
