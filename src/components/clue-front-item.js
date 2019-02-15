// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import theme from '../modules/theme';
import translations from '../translations';
import Button from './button';
import Text from './text';
import Space from './space';

export type Props = {|
  onPress: () => void,
  starsDiff: number
|};

const styles: GenericStyleProp = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  text: {
    color: theme.colors.white,
    fontSize: 22,
    textAlign: 'center',
    fontStyle: 'italic'
  }
});

const ClueFrontItem = ({onPress, starsDiff}: Props) => {
  const clueStarsToLoose = translations.clueStarsToLoose.replace(/{{count}}/g, String(starsDiff));
  return (
    <React.Fragment>
      <View style={styles.container}>
        <Text style={styles.text} testID="clue-advice">
          {clueStarsToLoose}
        </Text>
      </View>
      <Space type="base" />
      <Button isInverted onPress={onPress} testID="clue-button">
        {translations.seeClue}
      </Button>
    </React.Fragment>
  );
};

export default ClueFrontItem;
