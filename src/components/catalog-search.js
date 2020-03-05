// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import translations from '../translations';
import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import CatalogItems, {ITEM_OFFSET, ITEM_WIDTH} from './catalog-items';
import Space from './space';
import Text from './text';

const LIST_HORIZONTAL_OFFSET = theme.spacing.micro;
const LIST_VERTICAL_OFFSET = theme.spacing.base - ITEM_OFFSET;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white
  },
  content: {
    alignItems: 'center',
    paddingVertical: LIST_VERTICAL_OFFSET,
    paddingHorizontal: LIST_HORIZONTAL_OFFSET
  },
  noResults: {
    fontSize: theme.fontSize.xxlarge,
    fontWeight: theme.fontWeight.bold
  },
  noResultsDescription: {
    fontSize: theme.fontSize.regular,
    color: theme.colors.gray.dark,
    textAlign: 'center'
  }
});

export type OwnProps = {|
  cards?: Array<DisciplineCard | ChapterCard | void>,
  onCardPress: (DisciplineCard | ChapterCard) => void,
  onScroll?: ScrollEvent => void,
  onScrollBeginDrag?: ScrollEvent => void,
  testID?: string
|};

type Props = {|
  ...WithLayoutProps,
  ...OwnProps
|};

const CatalogSearch = ({
  layout,
  cards,
  onCardPress,
  onScroll,
  onScrollBeginDrag,
  testID = 'catalog-search'
}: Props) => {
  const numColumns = layout
    ? parseInt((layout.width - LIST_HORIZONTAL_OFFSET) / ITEM_WIDTH, 10)
    : undefined;

  return (
    <View style={styles.container} testID={testID}>
      {cards && cards.length === 0 ? (
        <View style={styles.content}>
          <Space type="xlarge" />
          <Text style={styles.noResults}>{translations.noResults}</Text>
          <Space />
          <Text style={styles.noResultsDescription}>{translations.noResultsDescription}</Text>
        </View>
      ) : null}
      {cards && cards.length > 0 ? (
        <CatalogItems
          cards={cards}
          onCardPress={onCardPress}
          onScroll={onScroll}
          onScrollBeginDrag={onScrollBeginDrag}
          numColumns={numColumns}
          style={styles.content}
          testID={`${testID}-items`}
        />
      ) : null}
    </View>
  );
};

export {CatalogSearch as Component};
export default withLayout(CatalogSearch);
