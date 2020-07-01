import * as React from 'react';
import {StyleSheet, FlatList} from 'react-native';

import type {ChapterCard, DisciplineCard} from '../layer/data/_types';
import type {Section} from '../types';
import CatalogSection from '../containers/catalog-section';
import theme from '../modules/theme';
import Hero, {HEIGHT as _HERO_HEIGHT} from './hero';
import Space from './space';

export interface Props {
  hero?: DisciplineCard | ChapterCard | null;
  sections: Array<Section | void>;
  onCardPress: (arg0: DisciplineCard | ChapterCard) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onScroll: (arg0: ScrollEvent) => void;
  children?: React.ReactNode;
  testID?: string;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

const SEPARATOR_SIZE = 'base';
export const SEPARATOR_HEIGHT = theme.spacing[SEPARATOR_SIZE];
export const HERO_HEIGHT = _HERO_HEIGHT;
const PLACEHOLDER_LENGTH = 3;

class Catalog extends React.Component<Props> {
  keyExtractor = (item: Section | void, index: number) => {
    const suffix = (item && item.key) || `${index}-placeholder`;

    return `catalog-section-${suffix}`;
  };

  renderItem = ({item, index}: {item: Section | void; index: number}) => {
    const {onCardPress} = this.props;

    if (!item) {
      return <CatalogSection testID={this.keyExtractor(item, index)} />;
    }

    return <CatalogSection title={item.title} sectionRef={item.key} onCardPress={onCardPress} />;
  };

  renderSeparator = () => <Space type={SEPARATOR_SIZE} />;

  renderFooter = (): React.ReactNode | null => this.props.children || null;

  renderHeader = (): React.ReactNode => {
    const {hero, onCardPress} = this.props;

    return (
      <React.Fragment>
        <Hero content={hero} onPress={onCardPress} />
        {this.renderSeparator()}
      </React.Fragment>
    );
  };

  render() {
    const {sections, onRefresh, isRefreshing = false, onScroll, testID = 'catalog'} = this.props;

    return (
      <FlatList
        ListHeaderComponent={this.renderHeader}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        data={sections.length > 0 ? sections : new Array(PLACEHOLDER_LENGTH).fill()}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={this.renderSeparator}
        ListFooterComponent={this.renderFooter}
        testID={testID}
        onScroll={onScroll}
      />
    );
  }
}

export default Catalog;
