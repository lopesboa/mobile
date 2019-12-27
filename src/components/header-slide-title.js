// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {HEADER_HEIGHT} from '../navigator/navigation-options';
import theme from '../modules/theme';
import {useDarkMode} from '../containers/with-dark-mode';
import {BrandThemeContext} from './brand-theme-provider';
import Text from './text';
import PlaceholderLine from './placeholder-line';
import Space from './space';
import ImageBackground from './image-background';

type Props = {|
  image?: {uri: string},
  subtitle?: string,
  title?: string
|};

const PLACEHOLDER_COLOR = theme.colors.gray.light;
const THUMBNAIL_WIDTH = 28;
const THUMBNAIL_HEIGHT = 28;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: theme.spacing.small,
    paddingRight: theme.spacing.large,
    alignItems: 'center'
  },
  containerDarkMode: {
    backgroundColor: '#121212'
  },
  thumbnail: {
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: theme.radius.thumbnail,
    overflow: 'hidden',
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT
  },
  text: {
    paddingLeft: theme.spacing.tiny,
    flex: 1
  },
  subtitle: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.small
  },
  subtitleDarkMode: {
    color: theme.colors.white
  },
  discipline: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.small,
    color: theme.colors.gray.dark
  },
  disciplineDarkMode: {
    color: theme.colors.white
  }
});

const HeaderSlide = ({image, subtitle, title}: Props) => {
  const brandTheme = React.useContext(BrandThemeContext);
  const isDarkModeActivated = useDarkMode();
  return (
    <View
      testID="header-slide-title"
      style={[
        styles.container,
        {height: HEADER_HEIGHT},
        isDarkModeActivated && styles.containerDarkMode
      ]}
    >
      <View style={styles.thumbnail}>
        <ImageBackground
          testID="header-slide-title-image"
          source={image}
          style={styles.thumbnail}
        />
      </View>
      <View style={styles.text}>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              {color: brandTheme.colors.primary},
              isDarkModeActivated && styles.subtitleDarkMode
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
        {title && (
          <Text
            testID="header-slide-title-title"
            style={[styles.discipline, isDarkModeActivated && styles.disciplineDarkMode]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {!title && (
          <React.Fragment>
            <PlaceholderLine size="small" color={PLACEHOLDER_COLOR} width="15%" />
            <Space />
            <PlaceholderLine size="small" color={PLACEHOLDER_COLOR} width="50%" />
          </React.Fragment>
        )}
      </View>
    </View>
  );
};

export default HeaderSlide;
