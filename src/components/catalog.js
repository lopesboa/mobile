// @flow

import * as React from 'react';
import {StyleSheet, FlatList} from 'react-native';

import type {ChapterCard, DisciplineCard} from '../layer/data/_types';
import type {Section} from '../types';
import CatalogSection from '../containers/catalog-section-refreshable';
import theme from '../modules/theme';
import Space from './space';

export type Props = {|
  sections: Array<Section | void>,
  cards: Array<DisciplineCard | ChapterCard>,
  onCardPress: (DisciplineCard | ChapterCard) => void,
  onRefresh: () => void,
  isRefreshing?: boolean,
  onScroll: ScrollEvent => void,
  onCardsScroll: (Section, offset: number, limit: number) => void,
  children?: React.Node
|};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
});

const SEPARATOR_SIZE = 'small';
export const SEPARATOR_HEIGHT = theme.spacing[SEPARATOR_SIZE];
const PLACEHOLDER_LENGTH = 3;

class Catalog extends React.PureComponent<Props> {
  props: Props;

  handleCardsScroll = (section: Section) => (offset: number, limit: number) => {
    this.props.onCardsScroll(section, offset, limit);
  };

  keyExtractor = (item: Section | void, index: number) => {
    const suffix = (item && item.key) || `${index}-placeholder`;

    return `catalog-section-${suffix}`;
  };

  renderItem = ({item, index}: {item: Section | void, index: number}) => {
    const {cards, onCardPress} = this.props;
    const testID = this.keyExtractor(item, index);

    if (!item) {
      return <CatalogSection testID={testID} />;
    }

    const sectionCards =
      item.cardsRef && item.cardsRef.map(ref => cards.find(card => card.universalRef === ref));

    return (
      <CatalogSection
        title={item.title}
        sectionRef={item.key}
        cards={sectionCards}
        onCardPress={onCardPress}
        onScroll={this.handleCardsScroll(item)}
        testID={testID}
      />
    );
  };

  renderSeparator = () => <Space type={SEPARATOR_SIZE} />;

  renderFooter = (): React.Node | null => this.props.children || null;

  render() {
    const {sections, onRefresh, isRefreshing = false, onScroll} = this.props;

    return (
      <FlatList
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        data={sections.length > 0 ? sections : new Array(PLACEHOLDER_LENGTH).fill()}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={this.renderSeparator}
        ListFooterComponent={this.renderFooter}
        testID="catalog"
        onScroll={onScroll}
      />
    );
  }
}

export default Catalog;
