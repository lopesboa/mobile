import * as React from 'react';
import {View, StyleSheet, Dimensions, ViewStyle} from 'react-native';
import {NovaCompositionCoorpacademySpiral as Spiral} from '@coorpacademy/nova-icons';
import Gradient from './gradient';

export interface Props {
  spiralColor: string;
  style?: ViewStyle;
  spiralStyle?: ViewStyle;
  testID?: string;
  backgroundColor: string;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    height: 75,
    bottom: 0,
  },
});

const Starburst = ({spiralColor, testID, style, spiralStyle, backgroundColor}: Props) => {
  const screenSize: number = Dimensions.get('window').height;

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={spiralStyle}>
        <Spiral color={spiralColor} width={screenSize} height={screenSize} />
        <Gradient
          style={[styles.gradient, {width: screenSize}]}
          colors={[backgroundColor]}
          testID={testID && testID + '-gradient'}
        />
      </View>
    </View>
  );
};

export default Starburst;
