// @flow

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {NovaCompositionCoorpacademySearch as SearchIcon} from '@coorpacademy/nova-icons';

import theme, {getHitSlop} from '../modules/theme';
import HeaderBackButton, {SPACING as ICON_SPACING} from './header-back-button';
import BrandLogo from './brand-logo';
import SearchInput from './search-input';
import Touchable from './touchable';

export type Props = {|
  height: number,
  searchValue?: string,
  isSearchVisible?: boolean,
  isSearchFetching?: boolean,
  onSearchToggle: boolean => void,
  onSearchInputChange: string => void,
  onLogoLongPress: () => void,
  testID?: string
|};

const CENTER_PADDING = theme.spacing.small;
const ICON_WIDTH = 20;
const SIDE_WIDTH = ICON_WIDTH + ICON_SPACING;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  side: {
    width: SIDE_WIDTH,
    justifyContent: 'center'
  },
  right: {
    alignItems: 'flex-end',
    paddingRight: ICON_SPACING
  },
  center: {
    flex: 1,
    padding: CENTER_PADDING
  },
  logo: {
    width: '100%'
  }
});

class Header extends React.PureComponent<Props> {
  props: Props;

  handleSearchToggle = (value: boolean) => () => this.props.onSearchToggle(value);

  render() {
    const {
      onLogoLongPress,
      isSearchVisible,
      height,
      searchValue,
      isSearchFetching,
      onSearchInputChange,
      testID
    } = this.props;
    const logoHeight = height - CENTER_PADDING * 2;

    return (
      <View style={[styles.container, {height}]} testID={testID}>
        <View style={styles.side}>
          {isSearchVisible ? (
            <HeaderBackButton
              isFloating={false}
              color={theme.colors.gray.dark}
              testID="search-back-icon"
              onPress={this.handleSearchToggle(false)}
              type="back"
            />
          ) : null}
        </View>
        <View style={styles.center}>
          {isSearchVisible ? (
            <SearchInput
              value={searchValue}
              isFetching={isSearchFetching}
              onChange={onSearchInputChange}
              testID="search-input"
            />
          ) : (
            <Touchable
              testID="header-logo"
              onLongPress={onLogoLongPress}
              analyticsID="sign-out"
              isWithoutFeedback
            >
              <BrandLogo height={logoHeight} />
            </Touchable>
          )}
        </View>
        {!isSearchVisible ? (
          <View style={[styles.side, styles.right]}>
            <Touchable
              testID="search-icon"
              hitSlop={getHitSlop()}
              onPress={this.handleSearchToggle(true)}
              analyticsID="search-icon"
            >
              <SearchIcon height={ICON_WIDTH} width={ICON_WIDTH} color={theme.colors.gray.dark} />
            </Touchable>
          </View>
        ) : null}
      </View>
    );
  }
}

export default Header;
