// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {createArraySelector} from 'reselect-map';

import {fetchCards, DEFAULT_LIMIT} from '../redux/actions/catalog/cards/fetch/sections';
import type {StoreState} from '../redux/store';
import {getCards} from '../redux/utils/state-extract';
import CatalogSection from '../components/catalog-section';
import type {Props as CatalogSectionProps} from '../components/catalog-section';
import {ITEM_WIDTH} from '../components/catalog-items';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import isEqual from '../modules/equal';
import translations from '../translations';
import withLayout from './with-layout';
import type {WithLayoutProps} from './with-layout';

export type ConnectedStateProps = {|
  cards: Array<DisciplineCard | ChapterCard | void>
|};

type ConnectedDispatchProps = {|
  fetchCards: typeof fetchCards
|};

export type OwnProps = $Diff<
  CatalogSectionProps,
  {|
    cards: $PropertyType<CatalogSectionProps, 'cards'>,
    onScroll: $PropertyType<CatalogSectionProps, 'onScroll'>
  |}
>;

type Props = {|
  ...ConnectedStateProps,
  ...ConnectedDispatchProps,
  ...WithLayoutProps,
  ...OwnProps
|};

export const DEBOUNCE_DURATION = 100;

class CatalogSectionRefreshable extends React.Component<Props> {
  props: Props;

  timeout: TimeoutID;

  offsetX: number = 0;

  shouldComponentUpdate = ({cards: nextCards, ...nextProps}: Props) => {
    const {cards, ...props} = this.props;
    const cardsRef = cards && cards.filter(Boolean).map(card => card.universalRef);
    const nextCardsRef = nextCards && nextCards.filter(Boolean).map(card => card.universalRef);
    const completion = cards.reduce((total, card) => total + ((card && card.completion) || 0), 0);
    const nextCompletion = nextCards.reduce(
      (total, card) => total + ((card && card.completion) || 0),
      0
    );

    return (
      typeof cards !== typeof nextCards ||
      completion !== nextCompletion ||
      // For performance purpose only (prevent useless render)
      !isEqual(cardsRef, nextCardsRef) ||
      !isEqual(props, nextProps)
    );
  };

  getOffset = (offsetX: number): number => Math.trunc(offsetX / ITEM_WIDTH);

  getLimit = (): number => {
    const {layout} = this.props;
    if (!layout) {
      return DEFAULT_LIMIT;
    }

    return Math.ceil(layout.width / ITEM_WIDTH) + 1;
  };

  handleScroll = ({nativeEvent}: ScrollEvent) => {
    const {sectionRef, layout, cards} = this.props;
    const offsetX = nativeEvent.contentOffset.x;

    if (sectionRef && offsetX !== this.offsetX && layout) {
      this.offsetX = offsetX;
      const offset = this.getOffset(offsetX);
      const limit = this.getLimit();
      const hasUnfetchedCards =
        cards && cards.slice(offset, offset + limit).findIndex(card => card === undefined) !== -1;

      if (hasUnfetchedCards) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          if (this.offsetX === offsetX) {
            this.props.fetchCards(sectionRef, offset, limit);
          }
        }, DEBOUNCE_DURATION);
      }
    }
  };

  render() {
    const {
      /* eslint-disable no-unused-vars */
      fetchCards: _fetchCards,
      containerStyle,
      layout,
      onLayout,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;
    return <CatalogSection {...remainingProps} onScroll={this.handleScroll} />;
  }
}

const getCardsRef = (state: StoreState, {sectionRef}: OwnProps) => {
  const cardsRef =
    (sectionRef &&
      state.catalog.entities.sections[sectionRef] &&
      state.catalog.entities.sections[sectionRef][translations.getLanguage()] &&
      state.catalog.entities.sections[sectionRef][translations.getLanguage()].cardsRef) ||
    [];
  return cardsRef;
};

const getCardsState = createArraySelector(
  [getCardsRef, getCards],
  (cardRef: string | void, cards: $ExtractReturn<typeof getCards>) =>
    cardRef && cards[cardRef] && cards[cardRef][translations.getLanguage()]
);

export const mapStateToProps = (state: StoreState, props: OwnProps): ConnectedStateProps => ({
  cards: getCardsState(state, props)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  fetchCards
};

export {CatalogSectionRefreshable as Component};
export default withLayout(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CatalogSectionRefreshable)
);
