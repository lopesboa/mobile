// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import translations from '../translations';
import version from '../modules/version';
import type {Discipline, Chapter} from '../layer/data/_types';
import Catalog from '../containers/catalog';
import Space from './space';
import Text from './text';

type Props = {|
  onChapterPress: (chapter: Chapter) => void,
  onDisciplinePress: (discipline: Discipline) => void
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

const Home = ({onChapterPress, onDisciplinePress}: Props) => (
  <View style={styles.container} testID="home">
    <Catalog onChapterPress={onChapterPress} onDisciplinePress={onDisciplinePress} />
    <Space type="small" />
    <Text style={styles.version}>
      {translations.formatString('{0}: {1}', 'Version', version.commit)}
    </Text>
  </View>
);

export default Home;
