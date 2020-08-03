import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  NovaCompositionCoorpacademySearch as SearchIcon,
  NovaCompositionCoorpacademyCog as SettingsIcon,
} from '@coorpacademy/nova-icons';

import theme, {getHitSlop} from '../modules/theme';
import {SPACING as ICON_SPACING} from './header-back-button';
import BrandLogo from './brand-logo';
import Touchable from './touchable';

export interface Props {
  height: number;
  onSearchPress: () => void;
  onSettingsPress: () => void;
  onLogoLongPress: () => void;
  testID?: string;
}

const CENTER_PADDING = theme.spacing.small;
const ICON_WIDTH = 20;
const SIDE_WIDTH = ICON_WIDTH + ICON_SPACING;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  side: {
    width: SIDE_WIDTH,
    justifyContent: 'center',
  },
  left: {
    alignItems: 'flex-start',
    paddingLeft: ICON_SPACING,
  },
  right: {
    alignItems: 'flex-end',
    paddingRight: ICON_SPACING,
  },
  center: {
    flex: 1,
    padding: CENTER_PADDING,
  },
  logo: {
    width: '100%',
  },
});

class Header extends React.PureComponent<Props> {
  handleSearchPress = () => this.props.onSearchPress();

  handleSettingsPress = () => this.props.onSettingsPress();

  render() {
    const {onLogoLongPress, height, testID} = this.props;
    const logoHeight = height - CENTER_PADDING * 2;

    return (
      <View style={[styles.container, {height}]} testID={testID}>
        <View style={[styles.side, styles.left]}>
          <Touchable
            testID="settings-icon"
            hitSlop={getHitSlop()}
            onPress={this.handleSettingsPress}
            analyticsID="settings-icon"
          >
            <SettingsIcon height={ICON_WIDTH} width={ICON_WIDTH} color={theme.colors.gray.dark} />
          </Touchable>
        </View>
        <View style={styles.center}>
          <Touchable
            testID="header-logo"
            onLongPress={onLogoLongPress}
            analyticsID="sign-out"
            isWithoutFeedback
          >
            <BrandLogo height={logoHeight} />
          </Touchable>
        </View>
        <View style={[styles.side, styles.right]}>
          <Touchable
            testID="search-icon"
            hitSlop={getHitSlop()}
            onPress={this.handleSearchPress}
            analyticsID="search-icon"
          >
            <SearchIcon height={ICON_WIDTH} width={ICON_WIDTH} color={theme.colors.gray.dark} />
          </Touchable>
        </View>
      </View>
    );
  }
}

export default Header;
