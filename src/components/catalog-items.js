// @flow

import * as React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import kebabCase from 'lodash/fp/kebabCase';

import theme from '../modules/theme';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import Card from './card';
import CatalogItem, {
  WIDTH as CATALOG_ITEM_WIDTH,
  HEIGHT as CATALOG_ITEM_HEIGHT
} from './catalog-item';

export const ITEM_OFFSET = theme.spacing.micro;
export const ITEM_WIDTH = CATALOG_ITEM_WIDTH + ITEM_OFFSET * 2;
export const ITEM_HEIGHT = CATALOG_ITEM_HEIGHT + ITEM_OFFSET * 2;

const styles = StyleSheet.create({
  item: {
    // to see the shadow
    margin: ITEM_OFFSET
  },
  card: {
    flex: 0,
    width: CATALOG_ITEM_WIDTH,
    height: CATALOG_ITEM_HEIGHT
  }
});

type EmptyCard = {};

export type Props = {|
  cards?: Array<DisciplineCard | ChapterCard | void>,
  onCardPress?: (DisciplineCard | ChapterCard) => void,
  onScroll?: ScrollEvent => void,
  onScrollBeginDrag?: ScrollEvent => void,
  placeholderLength?: number,
  numColumns?: number,
  style?: ViewStyleProp,
  testID?: string
|};

class CatalogItems extends React.PureComponent<Props> {
  props: Props;

  keyExtractor = (item: DisciplineCard | ChapterCard | EmptyCard, index: number) => {
    const {testID = 'catalog-items'} = this.props;
    const suffix =
      // $FlowFixMe union type
      (item && item.universalRef && kebabCase(item.universalRef)) || `${index}-placeholder`;

    return `${testID}-item-${suffix}`;
  };

  getItemLayout = (
    data?: Array<DisciplineCard | ChapterCard | EmptyCard> | null,
    index: number
  ) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index
  });

  renderItem = ({item, index}: {item: DisciplineCard | ChapterCard | EmptyCard, index: number}) => {
    const {onCardPress} = this.props;
    const testID = this.keyExtractor(item, index);

    return (
      <View style={styles.item}>
        <Card style={styles.card}>
          <CatalogItem
            // $FlowFixMe union type
            item={item.universalRef ? item : undefined}
            onPress={onCardPress}
            testID={testID}
          />
        </Card>
      </View>
    );
  };

  render() {
    const {
      cards,
      onScroll,
      onScrollBeginDrag,
      placeholderLength = 0,
      numColumns,
      style,
      testID = 'catalog-items'
    } = this.props;

    const _cards = cards && cards.length > 0 ? cards : new Array(placeholderLength).fill();

    return (
      <FlatList
        // Empty object to prevent filtering when using numColumns
        // https://github.com/facebook/react-native/blob/master/Libraries/Lists/FlatList.js#L495
        data={_cards.map(item => item || {})}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        getItemLayout={this.getItemLayout}
        contentContainerStyle={style}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={onScrollBeginDrag}
        onScroll={onScroll}
        scrollEnabled={Boolean(onScroll)}
        horizontal={!numColumns}
        numColumns={numColumns}
        key={`${testID}-${numColumns || '0'}`}
        testID={testID}
      />
    );
  }
}

export default CatalogItems;
