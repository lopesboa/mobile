import * as React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import {fetchCards} from '../redux/actions/catalog/cards/fetch/search';
import type {StoreState} from '../redux/store';
import {
  getSearchRef,
  getCards,
  getSearchValue,
  getSearchParams,
} from '../redux/utils/state-extract';
import CatalogSearchComponent from '../components/catalog-search';
import type {OwnProps as CatalogSearchProps} from '../components/catalog-search';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import translations from '../translations';
import type {QueryParams} from '../modules/uri';

export interface ConnectedStateProps {
  cards?: Array<DisciplineCard | ChapterCard | void>;
  searchValue?: string;
  searchParams?: QueryParams;
}

interface ConnectedDispatchProps {
  fetchCards: typeof fetchCards;
}

export interface OwnProps {
  cards: Pick<CatalogSearchProps, 'cards'>;
  onScroll: Pick<CatalogSearchProps, 'onScroll'>;
}

interface Props extends ConnectedStateProps, ConnectedDispatchProps, OwnProps {}

class CatalogSearch extends React.Component<Props> {
  handleScroll = (offset: number, limit: number) => {
    const {searchValue, searchParams} = this.props;
    if (searchValue || searchParams) {
      this.props.fetchCards(searchValue ? searchValue : '', offset, limit, searchParams);
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
      ? searchRef.map((ref) =>
          ref && cards[ref] ? cards[ref][translations.getLanguage()] : undefined,
        )
      : undefined,
);

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  cards: getCardsState(state),
  searchValue: getSearchValue(state),
  searchParams: getSearchParams(state),
});

const mapDispatchToProps: ConnectedDispatchProps = {
  fetchCards,
};

export {CatalogSearch as Component};
export default connect(mapStateToProps, mapDispatchToProps)(CatalogSearch);
