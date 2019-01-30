// @flow strict

import * as React from 'react';
import {Text, View, StyleSheet, ImageBackground} from 'react-native';

import {HEADER_HEIGHT} from '../navigator/navigation-options';
import theme from '../modules/theme';
import type {LevelType} from '../types';
import {LEVEL_TYPE} from '../const';
import translations from '../translations';
import {BrandThemeContext} from './brand-theme-provider';

type Props = {|
  image: File,
  level: LevelType,
  discipline: string
|};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: theme.spacing.small,
    paddingRight: theme.spacing.small,
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
  level: {
    fontWeight: theme.fontWeight.bold,
    fontSize: 12
  },
  discipline: {
    fontWeight: theme.fontWeight.bold,
    fontSize: 12,
    color: theme.colors.gray.dark
  }
});

const HeaderSlide = ({image, level, discipline}: Props) => (
  <BrandThemeContext.Consumer>
    {brandTheme => (
      <View style={[styles.container, {height: HEADER_HEIGHT}]}>
        <View style={styles.thumbnail}>
          <ImageBackground source={image} style={[styles.image, styles.thumbnail]} />
        </View>
        <View style={styles.text}>
          <Text style={[styles.level, {color: brandTheme.colors.primary}]} numberOfLines={1}>
            {level === LEVEL_TYPE.BASE && translations.base}
            {level === LEVEL_TYPE.ADVANCED && translations.advanced}
            {level === LEVEL_TYPE.COACH && translations.coach}
          </Text>
          <Text style={styles.discipline} numberOfLines={1}>
            {discipline}
          </Text>
        </View>
      </View>
    )}
  </BrandThemeContext.Consumer>
);

export default HeaderSlide;
