import * as React from 'react';
import {connect} from 'react-redux';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {
  isSearchFetching as _isSearchFetching,
  getSearchValue,
  getSearchParams,
} from '../redux/utils/state-extract';
import {edit as _editSearch} from '../redux/actions/ui/search';
import {
  fetchCards as _fetchCards,
  DEFAULT_LIMIT,
} from '../redux/actions/catalog/cards/fetch/search';
import {clearSearch as _clearSearch} from '../redux/actions/catalog/cards/clear';

import SearchComponent from '../components/search';
import type {QueryParams} from '../modules/uri';
import isEqual from '../modules/equal';

export interface ConnectedStateProps {
  isSearchFetching: boolean;
  searchValue?: string;
  searchParams?: QueryParams;
}

interface ConnectedDispatchProps {
  editSearch: typeof _editSearch;
  fetchCards: typeof _fetchCards;
  clearSearch: typeof _clearSearch;
}

export interface Props extends ConnectedStateProps, ConnectedDispatchProps {
  onCardPress: (item: DisciplineCard | ChapterCard) => void;
  onBackPress: () => void;
}

export const SEARCH_DEBOUNCE_DURATION = 500;
export const SEARCH_MIN_LENGTH = 2;

class Search extends React.PureComponent<Props> {
  timeout: TimeoutID;

  searchValue: string | void;

  componentDidMount() {
    const {searchParams} = this.props;
    if (searchParams) {
      this.props.fetchCards('', 0, DEFAULT_LIMIT, searchParams, true);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (prevProps.searchParams === undefined && this.props.searchParams) ||
      (prevProps.searchParams &&
        this.props.searchParams &&
        !isEqual(prevProps.searchParams, this.props.searchParams))
    ) {
      this.cleanUpSearch();
      this.props.fetchCards('', 0, DEFAULT_LIMIT, this.props.searchParams, true);
    }
  }

  componentWillUnmount() {
    this.cleanUpSearch();
  }

  cleanUpSearch = () => {
    this.props.clearSearch();
    this.props.editSearch({text: ''});
  };

  handleSearchInputChange = (value: string) => {
    this.searchValue = value;
    this.props.editSearch({text: value});

    if (value.length >= SEARCH_MIN_LENGTH) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (this.searchValue === value) {
          this.props.fetchCards(value, 0, DEFAULT_LIMIT, {}, true);
        }
      }, SEARCH_DEBOUNCE_DURATION);
    }

    if (value.length === 0) {
      this.props.clearSearch();
    }
  };

  render() {
    const {searchValue, isSearchFetching, onCardPress, onBackPress} = this.props;
    return (
      <SearchComponent
        testID="search"
        searchValue={searchValue}
        onCardPress={onCardPress}
        onBackPress={onBackPress}
        isSearchFetching={isSearchFetching}
        onSearchInputChange={this.handleSearchInputChange}
      />
    );
  }
}

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  isSearchFetching: _isSearchFetching(state),
  searchValue: getSearchValue(state),
  searchParams: getSearchParams(state),
});

const mapDispatchToProps: ConnectedDispatchProps = {
  editSearch: _editSearch,
  fetchCards: _fetchCards,
  clearSearch: _clearSearch,
};

export {Search as Component};
export default connect(mapStateToProps, mapDispatchToProps)(Search);
