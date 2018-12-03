// @flow strict

import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import theme from '../modules/theme';
import Text from './text';
import {BrandThemeContext} from './brand-theme-provider';

type Props = {|
  selected?: boolean,
  onPress: () => void,
  children: string,
|};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.colors.black,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.base,
  },
  container: {
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray.lightMedium,
    borderRadius: theme.radius.common,
  },
  textSelected: {
    color: theme.colors.white,
  },
});

const QuestionChoice = ({children, selected = false, onPress}: Props) => (
  <TouchableOpacity onPress={onPress}>
    <BrandThemeContext.Consumer>
      {brandTheme => {
        const selectedStyle = {backgroundColor: brandTheme.colors.primary};

        return (
          <View style={[styles.container, selected && selectedStyle]}>
            <Text style={[styles.text, selected && styles.textSelected]}>{children}</Text>
          </View>
        );
      }}
    </BrandThemeContext.Consumer>
  </TouchableOpacity>
);

export default QuestionChoice;
