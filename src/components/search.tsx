import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import theme from '../modules/theme';
import CatalogSearch from '../containers/catalog-search';
import type {QueryParams} from '../modules/uri';
import HeaderBackButton, {SPACING as ICON_SPACING} from './header-back-button';
import SearchInput from './search-input';

export interface Props {
  onCardPress: (item: DisciplineCard | ChapterCard) => void;
  onBackPress: () => void;
  onSearchInputChange: (value: string) => void;
  isSearchFetching: boolean;
  searchValue?: string;
  queryParams?: QueryParams;
  testID?: string;
}

const CENTER_PADDING = theme.spacing.small;
const SIDE_WIDTH = 20 + ICON_SPACING;
const HEADER_HEIGHT = 67;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  side: {
    width: SIDE_WIDTH,
    justifyContent: 'center',
  },
  right: {
    alignItems: 'flex-end',
    paddingRight: ICON_SPACING,
  },
  center: {
    flex: 1,
    padding: CENTER_PADDING,
  },
  catalog: {
    flex: 1,
  },
});

const Search = ({
  searchValue,
  onSearchInputChange,
  isSearchFetching,
  onCardPress,
  onBackPress,
  queryParams,
  testID = 'search',
}: Props) => {
  return (
    <View style={styles.container} testID={testID}>
      <View style={[styles.header, {height: HEADER_HEIGHT}]} testID={`${testID}-header`}>
        <View style={styles.side}>
          <HeaderBackButton
            isFloating={false}
            color={theme.colors.gray.dark}
            testID="search-back-icon"
            onPress={onBackPress}
            type="back"
          />
        </View>
        <View style={styles.center}>
          <SearchInput
            value={searchValue}
            isFetching={isSearchFetching}
            onChange={onSearchInputChange}
            testID="search-input"
            autoFocus={!queryParams}
          />
        </View>
      </View>
      <CatalogSearch
        onCardPress={onCardPress}
        containerStyle={styles.catalog}
        testID="catalog-search"
        queryParams={queryParams}
      />
    </View>
  );
};

export default Search;
