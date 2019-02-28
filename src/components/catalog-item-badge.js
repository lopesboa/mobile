// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import theme from '../modules/theme';
import type {Chapter, Discipline} from '../layer/data/_types';
import Text from './text';
import {BrandThemeContext} from './brand-theme-provider';

export type Item = Discipline | Chapter;

type Props = {|
  label: string,
  testID: string,
  style?: GenericStyleProp,
  labelStyle?: GenericStyleProp
|};

const styles = StyleSheet.create({
  container: {
    position: 'absolute'
  },
  badge: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderBottomEndRadius: theme.radius.medium,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    paddingLeft: theme.spacing.tiny,
    paddingRight: theme.spacing.tiny + theme.spacing.micro,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center'
  }
});

const Badge = ({
  label,
  testID,
  style = {
    minWidth: 40,
    minHeight: 17
  },
  labelStyle = {
    fontSize: 8
  }
}: Props) => {
  return (
    <BrandThemeContext.Consumer>
      {brandTheme => (
        <View style={styles.container}>
          <View style={[styles.badge, style]}>
            <Text
              testID={testID}
              style={[
                label,
                labelStyle,
                {
                  color: brandTheme.colors.primary
                }
              ]}
            >
              {label}
            </Text>
          </View>
        </View>
      )}
    </BrandThemeContext.Consumer>
  );
};

export default Badge;
