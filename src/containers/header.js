// @flow

import * as React from 'react';
import {Alert} from 'react-native';
import {connect} from 'react-redux';

import translations from '../translations';
import HeaderComponent from '../components/header';
import type {Props as ComponentProps} from '../components/header';
import type {StoreState} from '../redux/store';
import {
  isSearchVisible as _isSearchVisible,
  isSearchFetching as _isSearchFetching,
  getSearchValue
} from '../redux/utils/state-extract';
import {toggle as _toggleSearch, edit as _editSearch} from '../redux/actions/ui/search';
import {
  fetchCards as _fetchCards,
  DEFAULT_LIMIT
} from '../redux/actions/catalog/cards/fetch/search';
import {clearSearch as _clearSearch} from '../redux/actions/catalog/cards/clear';
import {signOut as _signOut} from '../redux/actions/authentication';

export type ConnectedStateProps = {|
  isSearchVisible: boolean,
  isSearchFetching: boolean,
  searchValue?: string
|};

type ConnectedDispatchProps = {|
  toggleSearch: typeof _toggleSearch,
  editSearch: typeof _editSearch,
  fetchCards: typeof _fetchCards,
  signOut: typeof _signOut,
  clearSearch: typeof _clearSearch
|};

export type Props = {|
  ...ConnectedStateProps,
  ...ConnectedDispatchProps,
  height: $PropertyType<ComponentProps, 'height'>
|};

export const SEARCH_DEBOUNCE_DURATION = 500;
export const SEARCH_MIN_LENGTH = 2;

class Header extends React.PureComponent<Props> {
  props: Props;

  timeout: TimeoutID;

  searchValue: string | void;

  handleLogoLongPress = () =>
    Alert.alert(translations.logOut, null, [
      {
        text: translations.cancel
      },
      {
        text: translations.ok,
        onPress: () => this.props.signOut()
      }
    ]);

  handleSearchToggle = (value: boolean) => {
    this.props.toggleSearch(value);

    if (!value) {
      this.handleSearchInputChange('');
    }
  };

  handleSearchInputChange = (value: string) => {
    this.searchValue = value;
    this.props.editSearch(value);

    if (value.length >= SEARCH_MIN_LENGTH) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (this.searchValue === value) {
          this.props.fetchCards(value, 0, DEFAULT_LIMIT, true);
        }
      }, SEARCH_DEBOUNCE_DURATION);
    }

    if (value.length === 0) {
      this.props.clearSearch();
    }
  };

  render() {
    const {
      /* eslint-disable no-unused-vars */
      toggleSearch,
      editSearch,
      fetchCards,
      signOut,
      clearSearch,
      /* eslint-enable no-unused-vars */
      isSearchFetching,
      isSearchVisible,
      ...props
    } = this.props;

    return (
      <HeaderComponent
        {...props}
        isSearchFetching={isSearchFetching}
        isSearchVisible={isSearchVisible}
        onLogoLongPress={this.handleLogoLongPress}
        onSearchToggle={this.handleSearchToggle}
        onSearchInputChange={this.handleSearchInputChange}
        testID="header"
      />
    );
  }
}

export const mapStateToProps = (state: StoreState): ConnectedStateProps => ({
  isSearchVisible: _isSearchVisible(state),
  isSearchFetching: _isSearchFetching(state),
  searchValue: getSearchValue(state)
});

const mapDispatchToProps: ConnectedDispatchProps = {
  toggleSearch: _toggleSearch,
  editSearch: _editSearch,
  fetchCards: _fetchCards,
  signOut: _signOut,
  clearSearch: _clearSearch
};

export {Header as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
