// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {createArraySelector} from 'reselect-map';

import {fetchCards} from '../redux/actions/catalog/cards/fetch/sections';
import type {StoreState} from '../redux/store';
import {getCards} from '../redux/utils/state-extract';
import CatalogSectionComponent from '../components/catalog-section';
import type {Props as CatalogSectionProps} from '../components/catalog-section';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import translations from '../translations';

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
  ...OwnProps
|};

class CatalogSection extends React.Component<Props> {
  props: Props;

  handleScroll = (offset: number, limit: number) => {
    const {sectionRef} = this.props;

    if (sectionRef) {
      this.props.fetchCards(sectionRef, offset, limit);
    }
  };

  render() {
    const {
      /* eslint-disable no-unused-vars */
      fetchCards: _fetchCards,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;
    return <CatalogSectionComponent {...remainingProps} onScroll={this.handleScroll} />;
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

export {CatalogSection as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogSection);
