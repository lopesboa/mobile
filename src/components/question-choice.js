// @flow strict

import * as React from 'react';
import {View, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import type {Media} from '@coorpacademy/progression-engine';

import {MEDIA_TYPE} from '../const';
import theme from '../modules/theme';
import {getCleanUri} from '../modules/uri';
import Html from './html';
import {BrandThemeContext} from './brand-theme-provider';

type Props = {|
  isSelected?: boolean,
  onPress: () => void,
  children: string,
  isDisabled?: boolean,
  testID?: string,
  media?: Media,
  style?: GenericStyleProp
|};

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.common,
    overflow: 'hidden'
  },
  textContainer: {
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.base,
    justifyContent: 'flex-start'
  },
  text: {
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.black
  },
  textSelected: {
    color: theme.colors.white
  },
  image: {
    borderTopLeftRadius: theme.radius.common,
    borderTopRightRadius: theme.radius.common,
    width: '100%',
    height: 120
  }
});

const QuestionChoice = ({
  children,
  isSelected = false,
  isDisabled,
  onPress,
  media,
  testID: prefixTestID,
  style
}: Props) => (
  <BrandThemeContext.Consumer>
    {brandTheme => {
      const selectedStyle = {
        backgroundColor: brandTheme.colors.primary,
        borderColor: brandTheme.colors.primary
      };
      const selectedSuffix = prefixTestID && isSelected ? '-selected' : '';
      const mediaType =
        media && media.type && media.type === MEDIA_TYPE.IMAGE && media.type.toLowerCase();
      const mediaUri =
        media &&
        media.type === MEDIA_TYPE.IMAGE &&
        media.src &&
        media.src.length > 0 &&
        getCleanUri(media.src[0].url);

      const mediaSuffix = prefixTestID && mediaType ? `-${mediaType}` : '';

      return (
        <TouchableOpacity onPress={!isDisabled ? onPress : undefined} style={style}>
          <View
            style={[styles.container, isSelected && selectedStyle, {flexGrow: 1}]}
            testID={prefixTestID && `${prefixTestID}${selectedSuffix}`}
          >
            {mediaUri && (
              <ImageBackground
                testID={prefixTestID && `${prefixTestID}${mediaSuffix}`}
                source={{uri: mediaUri}}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            <View style={styles.textContainer}>
              <Html fontSize={17} style={[styles.text, isSelected && styles.textSelected]}>
                {children}
              </Html>
            </View>
          </View>
        </TouchableOpacity>
      );
    }}
  </BrandThemeContext.Consumer>
);

export default QuestionChoice;
