// @flow

import * as React from 'react';
import {StyleSheet, RefreshControl, FlatList} from 'react-native';

import type {ChapterCard, DisciplineCard} from '../layer/data/_types';
import type {Section} from '../types';
import CatalogSection from '../containers/catalog-section-refreshable';
import Space from './space';

export type Props = {|
  sections: Array<Section>,
  cards: Array<DisciplineCard | ChapterCard>,
  onCardPress: (DisciplineCard | ChapterCard) => void,
  onRefresh: () => void,
  isRefreshing?: boolean,
  onCardsScroll: (Section, offset: number, limit: number) => void,
  children?: React.Node
|};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
});

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

    if (!item || !item.cardsRef) {
      return <CatalogSection testID={testID} />;
    }

    const sectionCards =
      item.cardsRef && item.cardsRef.map(ref => cards.find(card => card.universalRef === ref));

    if (sectionCards.length === 0) {
      return null;
    }

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

  renderSeparator = () => <Space type="small" />;

  renderFooter = (): React.Node | null => this.props.children || null;

  render() {
    const {sections, onRefresh, isRefreshing = false} = this.props;

    return (
      <FlatList
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        data={sections.length > 0 ? sections : new Array(2).fill()}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={this.renderSeparator}
        ListFooterComponent={this.renderFooter}
        testID="catalog"
      />
    );
  }
}

export default Catalog;
