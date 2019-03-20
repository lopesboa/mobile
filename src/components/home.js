// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-navigation';

import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import Catalog from '../containers/catalog';
import RoundedFooterAnimated from '../containers/rounded-footer-animated';
import {ANIMATION_TYPE} from '../const';
import theme from '../modules/theme';
import {BrandThemeContext} from './brand-theme-provider';
import Version from './version';
import Space from './space';

type Props = {|
  onCardPress: (item: DisciplineCard | ChapterCard) => void,
  onLogoLongPress: () => void,
  isFetching?: boolean
|};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  version: {
    color: theme.colors.white
  }
});

const Home = ({onCardPress, onLogoLongPress, isFetching}: Props) => (
  <View style={styles.container} testID="home">
    {!isFetching && (
      <BrandThemeContext.Consumer>
        {brandTheme => (
          <RoundedFooterAnimated
            color={brandTheme.colors.primary}
            testID="home-footer"
            animationType={ANIMATION_TYPE.IN}
          />
        )}
      </BrandThemeContext.Consumer>
    )}
    <SafeAreaView style={styles.container}>
      <Catalog onPress={onCardPress} onLogoLongPress={onLogoLongPress} />
      <Space />
      <Version style={styles.version} />
    </SafeAreaView>
  </View>
);

export default Home;
