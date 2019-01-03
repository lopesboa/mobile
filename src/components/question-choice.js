// @flow strict

import * as React from 'react';
import {View, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';

import type {Media} from '../types';
import {MEDIA_TYPE} from '../const';
import theme from '../modules/theme';
import Text from './text';
import {BrandThemeContext} from './brand-theme-provider';

type Props = {|
  isSelected?: boolean,
  onPress: () => void,
  children: string,
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
  text: {
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.base,
    fontWeight: theme.fontWeight.bold,
    fontSize: 17,
    color: theme.colors.black,
    justifyContent: 'flex-start'
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
      const mediaSuffix = prefixTestID && media ? `-${media.type.toLowerCase()}` : '';

      return (
        <TouchableOpacity onPress={onPress} style={style}>
          <View
            style={[styles.container, isSelected && selectedStyle, {flexGrow: 1}]}
            testID={prefixTestID && `${prefixTestID}${selectedSuffix}`}
          >
            {media &&
              media.type === MEDIA_TYPE.IMAGE && (
                <ImageBackground
                  testID={prefixTestID && `${prefixTestID}${mediaSuffix}`}
                  source={media.source}
                  style={styles.image}
                />
              )}
            <Text style={[styles.text, isSelected && styles.textSelected]}>{children}</Text>
          </View>
        </TouchableOpacity>
      );
    }}
  </BrandThemeContext.Consumer>
);

export default QuestionChoice;
