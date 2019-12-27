// @flow

import * as React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {NovaCompositionCoorpacademySpiral as Spiral} from '@coorpacademy/nova-icons';
import Gradient from './gradient';

export type Props = {|
  spiralColor: string,
  style?: ViewStyleProp,
  spiralStyle?: ViewStyleProp,
  testID?: string,
  backgroundColor: string,
  isDarkModeActivated: boolean
|};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden'
  },
  gradient: {
    position: 'absolute',
    height: 75,
    bottom: 0
  }
});

const Starburst = ({
  spiralColor,
  testID,
  style,
  spiralStyle,
  backgroundColor,
  isDarkModeActivated = false
}: Props) => {
  const screenSize: number = Dimensions.get('window').height;

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={spiralStyle}>
        <Spiral color={spiralColor} width={screenSize} height={screenSize} />
        {(!isDarkModeActivated && (
          <Gradient
            style={[styles.gradient, {width: screenSize}]}
            colors={[backgroundColor]}
            testID={testID && testID + '-gradient'}
          />
        )) ||
          null}
      </View>
    </View>
  );
};

export default Starburst;
