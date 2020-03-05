// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import CatalogItems, {ITEM_OFFSET, ITEM_HEIGHT} from './catalog-items';
import Placeholder from './placeholder';
import PlaceholderLine from './placeholder-line';
import Text from './text';

const LIST_HORIZONTAL_OFFSET = theme.spacing.micro;
const TITLE_HEIGHT = theme.fontSize.large;
const SEPARATOR_HEIGHT = theme.spacing.small - ITEM_OFFSET;
export const HEIGHT = ITEM_HEIGHT + SEPARATOR_HEIGHT + TITLE_HEIGHT;

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: LIST_HORIZONTAL_OFFSET + ITEM_OFFSET,
    fontSize: TITLE_HEIGHT,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black
  },
  list: {
    paddingHorizontal: LIST_HORIZONTAL_OFFSET,
    height: ITEM_HEIGHT
  },
  separator: {
    width: SEPARATOR_HEIGHT,
    height: SEPARATOR_HEIGHT
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

class CatalogSection extends React.Component<Props> {
  props: Props;

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
    const {sectionRef, cards, onCardPress, onScroll, testID} = this.props;

    return (
      <View>
        {this.renderTitle()}
        <View style={styles.separator} />
        <CatalogItems
          cards={cards}
          onCardPress={onCardPress}
          onScroll={onScroll}
          placeholderLength={5}
          style={styles.list}
          testID={`catalog-section-${sectionRef || testID}-items`}
        />
      </View>
    );
  }
}

export default CatalogSection;
