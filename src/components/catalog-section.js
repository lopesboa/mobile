// @flow

import * as React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import theme from '../modules/theme';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import Card from './card';
import CatalogItem, {
  WIDTH as CATALOG_ITEM_WIDTH,
  HEIGHT as CATALOG_ITEM_HEIGHT
} from './catalog-item';
import Placeholder from './placeholder';
import PlaceholderLine from './placeholder-line';
import Text from './text';

const LIST_HORIZONTAL_OFFSET = theme.spacing.micro;
const ITEM_VERTICAL_OFFSET = theme.spacing.small;
const ITEM_HORIZONTAL_OFFSET = theme.spacing.micro;
export const ITEM_WIDTH = CATALOG_ITEM_WIDTH + ITEM_HORIZONTAL_OFFSET * 2;
export const ITEM_HEIGHT = CATALOG_ITEM_HEIGHT + ITEM_VERTICAL_OFFSET * 2;
const TITLE_HEIGHT = theme.fontSize.large;
export const HEIGHT = ITEM_HEIGHT + TITLE_HEIGHT;
const PLACEHOLDER_LENGTH = 5;

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: LIST_HORIZONTAL_OFFSET + ITEM_HORIZONTAL_OFFSET,
    fontSize: TITLE_HEIGHT,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black
  },
  list: {
    paddingHorizontal: LIST_HORIZONTAL_OFFSET,
    height: ITEM_HEIGHT
  },
  card: {
    flex: 1,
    borderRadius: theme.radius.card,
    // to see the shadow
    marginHorizontal: ITEM_HORIZONTAL_OFFSET,
    marginVertical: ITEM_VERTICAL_OFFSET
  }
});

export type Props = {|
  sectionRef?: string,
  title?: string,
  cards?: Array<DisciplineCard | ChapterCard | void>,
  onCardPress?: (DisciplineCard | ChapterCard) => void,
  onScroll?: ScrollEvent => void,
  testID: string
|};

class CatalogSection extends React.Component<$ReadOnly<Props>> {
  props: $ReadOnly<Props>;

  offsetX: number = 0;

  keyExtractor = (item: DisciplineCard | ChapterCard | void, index: number) => {
    const {sectionRef, testID} = this.props;
    const suffix =
      (item && item.universalRef && item.universalRef.replace(/_/g, '-')) || `${index}-placeholder`;

    return `catalog-section-${sectionRef || testID}-item-${suffix}`;
  };

  getItemLayout = (data?: Array<DisciplineCard | ChapterCard | void> | null, index: number) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index
  });

  renderItem = ({item, index}: {item: DisciplineCard | ChapterCard | void, index: number}) => {
    const {sectionRef = '', onCardPress} = this.props;
    const testID = this.keyExtractor(item, index);

    return (
      <Card style={styles.card}>
        <CatalogItem item={item} onPress={onCardPress} testID={testID} section={sectionRef} />
      </Card>
    );
  };

  renderTitle = (): React.Node => {
    const {title} = this.props;

    if (!title) {
      return (
        <View style={styles.title}>
          <Placeholder>
            <PlaceholderLine width="30%" fontSize="large" />
          </Placeholder>
        </View>
      );
    }

    return <Text style={styles.title}>{title}</Text>;
  };

  render() {
    const {sectionRef, cards, onScroll, testID} = this.props;

    return (
      <View>
        {this.renderTitle()}
        <FlatList
          data={cards && cards.length > 0 ? cards : new Array(PLACEHOLDER_LENGTH).fill()}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          getItemLayout={this.getItemLayout}
          contentContainerStyle={styles.list}
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEnabled={Boolean(onScroll)}
          horizontal
          testID={`catalog-section-${sectionRef || testID}-items`}
        />
      </View>
    );
  }
}

export default CatalogSection;
