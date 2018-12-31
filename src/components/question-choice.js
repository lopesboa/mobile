// @flow strict

import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Image from '../containers/image-scalable';
import theme from '../modules/theme';
import Text from './text';
import {BrandThemeContext} from './brand-theme-provider';

type Props = {|
  isSelected?: boolean,
  onPress: () => void,
  children: string,
  testID?: string,
  image?: File
|};

const IMAGE_SIZE = 60;

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 17,
    color: theme.colors.black,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.base
  },
  container: {
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.common,
    flexDirection: 'row',
    padding: 3
  },
  textSelected: {
    color: theme.colors.white
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    justifyContent: 'center'
  }
});

const QuestionChoice = ({
  children,
  isSelected = false,
  onPress,
  image,
  testID: prefixTestID
}: Props) => (
  <TouchableOpacity onPress={onPress}>
    <BrandThemeContext.Consumer>
      {brandTheme => {
        const selectedStyle = {
          backgroundColor: brandTheme.colors.primary,
          borderColor: brandTheme.colors.primary
        };
        const selectedSuffix = prefixTestID && isSelected ? '-selected' : '';

        return (
          <View
            style={[styles.container, isSelected && selectedStyle]}
            testID={prefixTestID && `${prefixTestID}${selectedSuffix}`}
          >
            {image && (
              <View style={[styles.imageContainer]}>
                <Image maxHeight={IMAGE_SIZE} source={image} />
              </View>
            )}
            <Text style={[styles.text, isSelected && styles.textSelected]}>{children}</Text>
          </View>
        );
      }}
    </BrandThemeContext.Consumer>
  </TouchableOpacity>
);

export default QuestionChoice;
