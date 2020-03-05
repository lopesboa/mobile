// @flow

import * as React from 'react';
import {Keyboard} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import type {StoreState} from '../redux/store';
import {getSearchRef, getCards} from '../redux/utils/state-extract';
import CatalogSearchComponent from '../components/catalog-search';
import type {OwnProps as CatalogSearchProps} from '../components/catalog-search';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import isEqual from '../modules/equal';
import translations from '../translations';
import withLayout from './with-layout';
import type {WithLayoutProps} from './with-layout';

export type ConnectedStateProps = {|
  cards?: Array<DisciplineCard | ChapterCard | void>
|};

export type OwnProps = $Diff<
  CatalogSearchProps,
  {|
    cards: $PropertyType<CatalogSearchProps, 'cards'>,
    onScroll: $PropertyType<CatalogSearchProps, 'onScroll'>,
    onScrollBeginDrag: $PropertyType<CatalogSearchProps, 'onScrollBeginDrag'>
  |}
>;

type Props = {|
  ...ConnectedStateProps,
  ...WithLayoutProps,
  ...OwnProps
|};

class CatalogSearch extends React.Component<Props> {
  props: Props;

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
    // @todo infinite scroll
  };

  // to remove the keyboard when scrolling
  handleScrollBeginDrag = () => Keyboard.dismiss();

  render() {
    const {
      /* eslint-disable no-unused-vars */
      containerStyle,
      layout,
      onLayout,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;
    return (
      <CatalogSearchComponent
        {...remainingProps}
        onScroll={this.handleScroll}
        onScrollBeginDrag={this.handleScrollBeginDrag}
        testID="catalog-search"
      />
    );
  }
}

const getCardsState = createSelector(
  [getSearchRef, getCards],
  (searchRef: Array<string | void> | void, cards: $ExtractReturn<typeof getCards>) =>
    searchRef
      ? searchRef.map(ref =>
          ref && cards[ref] ? cards[ref][translations.getLanguage()] : undefined
        )
      : undefined
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  cards: getCardsState(state)
});

export {CatalogSearch as Component};
export default withLayout(connect(mapStateToProps)(CatalogSearch));
