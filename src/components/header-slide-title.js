// @flow strict

import * as React from 'react';
import {Text, View, StyleSheet, ImageBackground} from 'react-native';

import {HEADER_HEIGHT} from '../navigator/navigation-options';
import theme from '../modules/theme';
import {BrandThemeContext} from './brand-theme-provider';

type Props = {|
  image: {uri: string} | File,
  subtitle: string,
  title: string
|};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: theme.spacing.small,
    paddingRight: theme.spacing.large,
    alignItems: 'center'
  },
  thumbnail: {
    borderRadius: theme.radius.thumbnail,
    overflow: 'hidden'
  },
  image: {
    width: 28,
    height: 28
  },
  text: {
    paddingLeft: theme.spacing.tiny,
    flex: 1
  },
  subtitle: {
    fontWeight: theme.fontWeight.bold,
    fontSize: 12
  },
  discipline: {
    fontWeight: theme.fontWeight.bold,
    fontSize: 12,
    color: theme.colors.gray.dark
  }
});

const HeaderSlide = ({image, subtitle, title}: Props) => (
  <BrandThemeContext.Consumer>
    {brandTheme => (
      <View testID="header-slide-title" style={[styles.container, {height: HEADER_HEIGHT}]}>
        <View style={styles.thumbnail}>
          <ImageBackground
            testID="header-slide-title-image"
            source={image}
            style={[styles.image, styles.thumbnail]}
          />
        </View>
        <View style={styles.text}>
          <Text style={[styles.subtitle, {color: brandTheme.colors.primary}]} numberOfLines={1}>
            {subtitle}
          </Text>
          <Text testID="header-slide-title-title" style={styles.discipline} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>
    )}
  </BrandThemeContext.Consumer>
);

export default HeaderSlide;
