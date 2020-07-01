import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import translations from '../translations';
import Button from './button';
import Text from './text';
import Space from './space';

export interface Props {
  onPress: () => void;
  starsDiff: number;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xlarge,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

const ClueFrontItem = ({onPress, starsDiff}: Props) => (
  <React.Fragment>
    <View style={styles.container}>
      <Text style={styles.text} testID="clue-advice">
        {translations.clueStarsToLoose.replace(/{{count}}/g, String(starsDiff))}
      </Text>
    </View>
    <Space type="base" />
    <Button isInverted onPress={onPress} testID="button-clue" analyticsID="button-clue">
      {translations.seeClue}
    </Button>
  </React.Fragment>
);

export default ClueFrontItem;
