// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import Catalog from '../containers/catalog';
import CatalogSearch from '../containers/catalog-search';
import Header from '../containers/header';
import Box from './box';
import Version from './version';
import Gradient from './gradient';
import Loader from './loader';

type Props = {|
  onCardPress: (item: DisciplineCard | ChapterCard) => void,
  isFetching: boolean,
  isFocused: boolean,
  isSearchVisible: boolean,
  testID?: string
|};

const HEADER_HEIGHT = 67;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    paddingTop: HEADER_HEIGHT,
    overflow: 'hidden'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  gradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingTop: HEADER_HEIGHT,
    right: 0
  },
  catalog: {
    flex: 1
  },
  version: {
    color: theme.colors.gray.medium,
    paddingBottom: theme.spacing.base,
    paddingTop: theme.spacing.small
  }
});

const Home = ({onCardPress, isFetching, isFocused, isSearchVisible, testID}: Props) => {
  if (isFetching) {
    return (
      <View style={styles.loaderContainer} testID={testID}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <Gradient
        height={HEADER_HEIGHT + theme.spacing.small}
        colors={[theme.colors.white]}
        transparencyPosition="bottom"
        style={styles.gradient}
      />
      {isSearchVisible ? (
        <CatalogSearch
          onCardPress={onCardPress}
          containerStyle={styles.catalog}
          testID="catalog-search"
        />
      ) : (
        <Catalog
          onCardPress={onCardPress}
          containerStyle={styles.catalog}
          isFocused={isFocused}
          testID="catalog"
        >
          <Version style={styles.version} />
        </Catalog>
      )}
      <Box style={styles.header}>
        <Header height={HEADER_HEIGHT} />
      </Box>
    </View>
  );
};

export default Home;
