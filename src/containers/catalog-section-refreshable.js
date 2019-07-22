// @flow strict

import * as React from 'react';

import {DEFAULT_LIMIT} from '../redux/actions/catalog/cards/fetch';
import CatalogSection, {ITEM_WIDTH} from '../components/catalog-section';
import type {Props as CatalogSectionProps} from '../components/catalog-section';
import withLayout from './with-layout';
import type {WithLayoutProps} from './with-layout';

type Props = {|
  ...WithLayoutProps,
  ...$Diff<
    CatalogSectionProps,
    {|
      onScroll: $PropertyType<CatalogSectionProps, 'onScroll'>
    |}
  >,
  onScroll?: (offset: number, limit: number) => void
|};

const DEBOUNCE_DURATION = 100;

class CatalogSectionRefreshable extends React.PureComponent<Props> {
  props: Props;

  timeout: TimeoutID;

  offsetX: number = 0;

  getOffset = (offsetX: number): number => Math.trunc(offsetX / ITEM_WIDTH);

  getLimit = (): number => {
    const {layout} = this.props;
    if (!layout) {
      return DEFAULT_LIMIT;
    }

    return Math.ceil(layout.width / ITEM_WIDTH) + 1;
  };

  handleScroll = ({nativeEvent}: ScrollEvent) => {
    const {onScroll, layout, cards} = this.props;
    const offsetX = nativeEvent.contentOffset.x;

    if (offsetX !== this.offsetX && layout) {
      this.offsetX = offsetX;
      const offset = this.getOffset(offsetX);
      const limit = this.getLimit();
      const hasUnfetchedCards =
        cards && cards.slice(offset, offset + limit).findIndex(card => card === undefined) !== -1;

      if (hasUnfetchedCards) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          if (this.offsetX === offsetX) {
            onScroll && onScroll(offset, limit);
          }
        }, DEBOUNCE_DURATION);
      }
    }
  };

  render() {
    const {
      /* eslint-disable no-unused-vars */
      onScroll,
      containerStyle,
      layout,
      onLayout,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;
    return <CatalogSection {...remainingProps} onScroll={this.handleScroll} />;
  }
}

export default withLayout(CatalogSectionRefreshable);
