// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {createArraySelector} from 'reselect-map';

import {fetchCards, DEFAULT_LIMIT} from '../redux/actions/catalog/cards/fetch';
import type {StoreState} from '../redux/store';
import CatalogSection, {ITEM_WIDTH} from '../components/catalog-section';
import type {Props as CatalogSectionProps} from '../components/catalog-section';
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

    return (
      typeof cards !== typeof nextCards ||
      // For performance purpose only (prevent useless render)
      (cards &&
        nextCards &&
        cards.filter(card => card).length !== nextCards.filter(card => card).length) ||
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

const getCards = (state: StoreState) => state.catalog.entities.cards;

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
