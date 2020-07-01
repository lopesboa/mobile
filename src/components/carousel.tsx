import * as React from 'react';
import {View, ViewStyle, StyleSheet} from 'react-native';
import type {Props as FlatListProps} from 'react-native/Libraries/Lists/FlatList';
import CarouselBase from 'react-native-sideswipe';
import {Pagination} from 'react-native-snap-carousel';
import {$NonMaybeType} from 'utility-types';

import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import theme from '../modules/theme';
import Box from './box';

export interface Props<ItemT> extends WithLayoutProps {
  data: $NonMaybeType<Pick<FlatListProps<ItemT>, 'data'>>;
  // Copy paste from FlatList without separators property
  renderItem: (arg0: {item: ItemT; index: number}) => React.ReactNode | null | undefined;
  currentIndex: number;
  onChange: (arg0: number) => void;
  testID?: string;
  style?: ViewStyle;
}

const PAGINATION_DOT_WIDTH = 8;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  carousel: {
    alignItems: 'stretch',
  },
  item: {
    paddingHorizontal: theme.spacing.base + theme.spacing.small,
    paddingVertical: theme.spacing.small,
  },
  itemInactive: {
    opacity: 0.65,
  },
  box: {
    flexGrow: 1,
  },
  itemContent: {
    flexGrow: 1,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
  },
  pagination: {
    paddingHorizontal: theme.spacing.small,
    paddingVertical: 0,
  },
  paginationDot: {
    width: PAGINATION_DOT_WIDTH,
    height: PAGINATION_DOT_WIDTH,
    borderRadius: PAGINATION_DOT_WIDTH,
    padding: 2,
  },
  paginationDotContainer: {
    marginHorizontal: theme.spacing.tiny / 2,
    padding: 2,
    borderColor: theme.colors.white,
    borderWidth: 1,
    borderRadius: PAGINATION_DOT_WIDTH,
  },
});

class Carousel<ItemT> extends React.PureComponent<Props<ItemT>> {
  props: Props<ItemT>;

  renderItem = (width: number) => ({item, itemIndex}: {item: ItemT; itemIndex: number}) => (
    <View
      style={[styles.item, this.props.currentIndex !== itemIndex && styles.itemInactive, {width}]}
      testID="carousel-item"
    >
      <Box style={styles.box}>
        <View style={styles.itemContent}>{this.props.renderItem({item, index: itemIndex})}</View>
      </Box>
    </View>
  );

  extractKey = (item: ItemT, index: number) => `carousel-item-${index + 1}`;

  render() {
    const {layout, data, currentIndex, onChange, testID = 'carousel', style, onLayout} = this.props;

    const width = layout && layout.width;

    return (
      <View style={styles.container} testID={testID} onLayout={onLayout}>
        {width ? (
          <CarouselBase
            index={currentIndex}
            itemWidth={width}
            threshold={width / 4}
            extractKey={this.extractKey}
            style={[style, {width}]}
            data={data}
            onIndexChange={onChange}
            renderItem={this.renderItem(width)}
            useVelocityForIndex={false}
            contentContainerStyle={styles.carousel}
          />
        ) : null}
        <Pagination
          dotsLength={data.length}
          activeDotIndex={currentIndex}
          dotColor={theme.colors.white}
          dotStyle={styles.paginationDot}
          dotContainerStyle={styles.paginationDotContainer}
          containerStyle={styles.pagination}
          inactiveDotColor={theme.colors.white}
          inactiveDotStyle={styles.paginationDot}
          inactiveDotOpacity={0}
          inactiveDotScale={0.6}
        />
      </View>
    );
  }
}

export {Carousel as Component};
export default withLayout(Carousel, {
  withoutContainer: true,
});
