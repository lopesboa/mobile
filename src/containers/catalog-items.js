// @flow

import * as React from 'react';
import {Keyboard} from 'react-native';

import isEqual from '../modules/equal';
import CatalogItemsComponent, {ITEM_WIDTH, ITEM_HEIGHT} from '../components/catalog-items';
import type {Props as CatalogItemsProps} from '../components/catalog-items';
import withLayout from './with-layout';
import type {WithLayoutProps} from './with-layout';

export type OwnProps = {|
  ...$Diff<
    CatalogItemsProps,
    {|
      onScroll: $PropertyType<CatalogItemsProps, 'onScroll'>
    |}
  >,
  onScroll: (offset: number, limit: number) => void
|};

type Props = {|
  ...WithLayoutProps,
  ...OwnProps
|};

export const DEBOUNCE_DURATION = 100;
export const DEFAULT_LIMIT = 5;

class CatalogItems extends React.Component<Props> {
  props: Props;

  timeout: TimeoutID;

  scrollOffset: number = 0;

  static getOffset = (
    numColumns: $PropertyType<Props, 'numColumns'>,
    scrollOffset: number
  ): number => {
    if (numColumns) {
      return Math.trunc(scrollOffset / ITEM_HEIGHT) * numColumns;
    }

    return Math.trunc(scrollOffset / ITEM_WIDTH);
  };

  static getLimit = (
    numColumns: $PropertyType<Props, 'numColumns'>,
    layout: $PropertyType<Props, 'layout'>
  ): number => {
    if (!layout) {
      return DEFAULT_LIMIT * (numColumns || 1);
    }

    if (numColumns) {
      return (Math.ceil(layout.height / ITEM_HEIGHT) + 1) * numColumns;
    }

    return Math.ceil(layout.width / ITEM_WIDTH) + 1;
  };

  shouldComponentUpdate = ({cards: nextCards, ...nextProps}: Props) => {
    const {cards, ...props} = this.props;
    const cardsRef = cards && cards.filter(Boolean).map(card => card.universalRef);
    const nextCardsRef = nextCards && nextCards.filter(Boolean).map(card => card.universalRef);
    const completion =
      cards && cards.reduce((total, card) => total + ((card && card.completion) || 0), 0);
    const nextCompletion =
      nextCards && nextCards.reduce((total, card) => total + ((card && card.completion) || 0), 0);

    return (
      typeof cards !== typeof nextCards ||
      completion !== nextCompletion ||
      // For performance purpose only (prevent useless render)
      !isEqual(cardsRef, nextCardsRef) ||
      !isEqual(props, nextProps)
    );
  };

  handleScroll = ({nativeEvent}: ScrollEvent) => {
    const {cards, numColumns, layout, onScroll} = this.props;
    const scrollOffset = nativeEvent.contentOffset[numColumns ? 'y' : 'x'];

    if (scrollOffset !== this.scrollOffset) {
      this.scrollOffset = scrollOffset;
      const offset = CatalogItems.getOffset(numColumns, scrollOffset);
      const limit = CatalogItems.getLimit(numColumns, layout);
      const hasUnfetchedCards =
        cards && cards.slice(offset, offset + limit).findIndex(card => card === undefined) !== -1;

      if (hasUnfetchedCards) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          if (this.scrollOffset === scrollOffset) {
            onScroll(offset, limit);
          }
        }, DEBOUNCE_DURATION);
      }
    }
  };

  // to remove the keyboard when scrolling
  handleScrollBeginDrag = () => Keyboard.dismiss();

  render() {
    const {
      /* eslint-disable no-unused-vars */
      containerStyle,
      layout,
      onLayout,
      onScroll,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    return (
      <CatalogItemsComponent
        {...remainingProps}
        onScroll={this.handleScroll}
        onScrollBeginDrag={this.handleScrollBeginDrag}
      />
    );
  }
}

export {CatalogItems as Component};
export default withLayout(CatalogItems);
