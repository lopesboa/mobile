// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import type {Discipline, Chapter} from '../layer/data/_types';
import Catalog from '../containers/catalog';

type Props = {|
  onChapterPress: (chapter: Chapter) => void,
  onDisciplinePress: (discipline: Discipline) => void
|};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.base,
    justifyContent: 'flex-end'
  }
});

const Home = ({onChapterPress, onDisciplinePress}: Props) => (
  <View style={styles.container} testID="home">
    <Catalog onChapterPress={onChapterPress} onDisciplinePress={onDisciplinePress} />
  </View>
);

export default Home;
