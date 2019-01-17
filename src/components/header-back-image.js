// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {NovaCompositionNavigationArrowLeft} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';

type Props = {||};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.small
  }
});

const HeaderBackImage = (props: Props) => (
  <View style={styles.container}>
    <NovaCompositionNavigationArrowLeft color={theme.colors.gray.dark} height={16} width={16} />
  </View>
);

export default HeaderBackImage;
