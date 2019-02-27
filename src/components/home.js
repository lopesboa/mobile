// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import translations from '../translations';
import version from '../modules/version';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import Catalog from '../containers/catalog';
import Space from './space';
import Text from './text';

type Props = {|
  onCardPress: (item: DisciplineCard | ChapterCard) => void
|};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.base,
    justifyContent: 'flex-end'
  },
  version: {
    fontSize: 10,
    textAlign: 'center',
    color: theme.colors.gray.medium
  }
});

const Home = ({onCardPress}: Props) => (
  <View style={styles.container} testID="home">
    <Catalog onPress={onCardPress} />
    <Space type="small" />
    <Text style={styles.version}>
      {translations.formatString('{0}: {1}', 'Version', version.commit)}
    </Text>
  </View>
);

export default Home;
