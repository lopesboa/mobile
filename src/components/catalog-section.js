// @flow

import * as React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import theme from '../modules/theme';
import translations from '../translations';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {CARD_TYPE} from '../layer/data/_const';
import {CARD_DISPLAY_MODE, AUTHOR_TYPE, ENGINE} from '../const';
import {getAuthorName, getAuthorType} from '../utils/content';
import {BrandThemeContext} from './brand-theme-provider';
import {STYLE as BOX_STYLE} from './box';
import Card from './card';
import CatalogItem, {
  WIDTH as CATALOG_ITEM_WIDTH,
  HEIGHT as CATALOG_ITEM_HEIGHT
} from './catalog-item';
import CatalogItemPlaceholder from './catalog-item-placeholder';
import Placeholder from './placeholder';
import PlaceholderLine from './placeholder-line';
import Text from './text';

export type Props = {|
  sectionRef?: string,
  title?: string,
  cards?: Array<DisciplineCard | ChapterCard | void>,
  onCardPress?: (DisciplineCard | ChapterCard) => void,
  onScroll?: ScrollEvent => void,
  testID: string
|};

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

class CatalogSection extends React.Component<Props> {
  props: Props;

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

  handleItemPress = (item: DisciplineCard | ChapterCard) => () =>
    this.props.onCardPress && this.props.onCardPress(item);

  renderItem = ({item, index}: {item: DisciplineCard | ChapterCard | void, index: number}) => {
    const {sectionRef = ''} = this.props;
    const testID = this.keyExtractor(item, index);

    if (!item) {
      return (
        <Card style={styles.card} shadowStyle={BOX_STYLE}>
          <CatalogItemPlaceholder testID={testID} />
        </Card>
      );
    }

    const authorType = getAuthorType(item);
    const authorName = getAuthorName(item);

    return (
      <Card style={styles.card} shadowStyle={BOX_STYLE}>
        <BrandThemeContext.Consumer>
          {brandTheme => (
            <CatalogItem
              title={item.title}
              subtitle={item.authors && item.authors.map(({label}) => label).join(', ')}
              progression={{
                current: item.completion,
                count: 1
              }}
              image={{uri: item.image}}
              authorType={authorType}
              authorName={authorType !== AUTHOR_TYPE.CUSTOM ? authorName : brandTheme.name}
              badge={item.isNew ? translations.new : ''}
              isAdaptive={item.adaptiv || false}
              displayMode={CARD_DISPLAY_MODE.CARD}
              onPress={this.handleItemPress(item)}
              testID={testID}
              isCertified={authorType === AUTHOR_TYPE.VERIFIED}
              universalRef={item.universalRef}
              type={item.type === CARD_TYPE.CHAPTER ? ENGINE.MICROLEARNING : ENGINE.LEARNER}
              section={sectionRef}
            />
          )}
        </BrandThemeContext.Consumer>
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
