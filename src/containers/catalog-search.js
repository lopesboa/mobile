// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import {fetchCards} from '../redux/actions/catalog/cards/fetch/search';
import type {StoreState} from '../redux/store';
import {getSearchRef, getCards, getSearchValue} from '../redux/utils/state-extract';
import CatalogSearchComponent from '../components/catalog-search';
import type {OwnProps as CatalogSearchProps} from '../components/catalog-search';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import translations from '../translations';

export type ConnectedStateProps = {|
  cards?: Array<DisciplineCard | ChapterCard | void>,
  searchValue?: string
|};

type ConnectedDispatchProps = {|
  fetchCards: typeof fetchCards
|};

export type OwnProps = $Diff<
  CatalogSearchProps,
  {|
    cards: $PropertyType<CatalogSearchProps, 'cards'>,
    onScroll: $PropertyType<CatalogSearchProps, 'onScroll'>
  |}
>;

type Props = {|
  ...ConnectedStateProps,
  ...ConnectedDispatchProps,
  ...OwnProps
|};

class CatalogSearch extends React.Component<Props> {
  props: Props;

  handleScroll = (offset: number, limit: number) => {
    const {searchValue} = this.props;

    if (searchValue) {
      this.props.fetchCards(searchValue, offset, limit);
    }
  };

  render() {
    return <CatalogSearchComponent {...this.props} onScroll={this.handleScroll} />;
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
  cards: getCardsState(state),
  searchValue: getSearchValue(state)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  fetchCards
};

export {CatalogSearch as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogSearch);