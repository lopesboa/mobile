// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import Catalog from '../containers/catalog';
import RoundedFooterAnimated from '../containers/rounded-footer-animated';
import {ANIMATION_TYPE} from '../const';
import {BrandThemeContext} from './brand-theme-provider';

type Props = {|
  onCardPress: (item: DisciplineCard | ChapterCard) => void,
  onLogoLongPress: () => void,
  isFetching?: boolean
|};

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    <Catalog onPress={onCardPress} onLogoLongPress={onLogoLongPress} />
  </View>
);

export default Home;
