// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {NovaCompositionCoorpacademyTrophyCup as TrophyIcon} from '@coorpacademy/nova-icons';

export type Props = {|
  style?: ViewStyleProp,
  testID?: string
|};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    top: -15
  },
  trophy: {
    flexGrow: 1,
    position: 'absolute',
    width: '50%',
    height: '50%'
  }
});

const Trophy = ({testID, style}: $ReadOnly<Props>) => {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <TrophyIcon style={styles.trophy} />
    </View>
  );
};

export default Trophy;
