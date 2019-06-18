// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import {SPACE} from '../const';
import {HEIGHT as CATALOG_ITEM_HEIGHT, WIDTH as CATALOG_ITEM_WIDTH} from './catalog-item';
import Space from './space';
import Placeholder from './placeholder';
import PlaceholderLine from './placeholder-line';

type Props = {|
  testID?: string
|};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray.light,
    padding: theme.spacing.small,
    height: CATALOG_ITEM_HEIGHT,
    width: CATALOG_ITEM_WIDTH,
    justifyContent: 'flex-end'
  },
  placeholder: {
    height: 75
  }
});

const CatalogItemPlaceholder = ({testID = 'catalog-item-placeholder'}: Props) => (
  <View style={styles.container} testID={testID}>
    <Placeholder style={styles.placeholder}>
      <PlaceholderLine width="70%" color={theme.colors.gray.lightMedium} />
      <Space />
      <PlaceholderLine width="80%" color={theme.colors.gray.lightMedium} />
      <Space type={SPACE.BASE} />
      <PlaceholderLine size="small" width="40%" color={theme.colors.gray.lightMedium} />
      <Space type={SPACE.SMALL} />
      <PlaceholderLine size="tiny" width="100%" color={theme.colors.gray.lightMedium} />
    </Placeholder>
  </View>
);

export default CatalogItemPlaceholder;
