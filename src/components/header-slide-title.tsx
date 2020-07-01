import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {HEADER_HEIGHT} from '../navigator/navigation-options';
import theme from '../modules/theme';
import type {SourceURI} from '../types';
import {BrandThemeContext} from './brand-theme-provider';
import Text from './text';
import PlaceholderLine from './placeholder-line';
import Space from './space';
import ImageBackground from './image-background';

interface Props {
  image?: SourceURI;
  subtitle?: string;
  title?: string;
}

const PLACEHOLDER_COLOR = theme.colors.gray.light;
const THUMBNAIL_WIDTH = 28;
const THUMBNAIL_HEIGHT = 28;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: theme.spacing.small,
    paddingRight: theme.spacing.large,
    alignItems: 'center',
  },
  thumbnail: {
    backgroundColor: PLACEHOLDER_COLOR,
    borderRadius: theme.radius.thumbnail,
    overflow: 'hidden',
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
  },
  text: {
    paddingLeft: theme.spacing.tiny,
    flex: 1,
  },
  subtitle: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.small,
  },
  discipline: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.small,
    color: theme.colors.gray.dark,
  },
});

const HeaderSlide = ({image, subtitle, title}: Props) => {
  const brandTheme = React.useContext(BrandThemeContext);
  return (
    <View testID="header-slide-title" style={[styles.container, {height: HEADER_HEIGHT}]}>
      <View style={styles.thumbnail}>
        <ImageBackground
          testID="header-slide-title-image"
          source={image}
          style={styles.thumbnail}
        />
      </View>
      <View style={styles.text}>
        {subtitle ? (
          <Text style={[styles.subtitle, {color: brandTheme.colors.primary}]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        {title ? (
          <Text testID="header-slide-title-title" style={styles.discipline} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {!title ? (
          <React.Fragment>
            <PlaceholderLine size="small" color={PLACEHOLDER_COLOR} width={15} />
            <Space />
            <PlaceholderLine size="small" color={PLACEHOLDER_COLOR} width={50} />
          </React.Fragment>
        ) : null}
      </View>
    </View>
  );
};

export default HeaderSlide;
