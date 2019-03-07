// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import translations from '../translations';
import version from '../modules/version';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import Catalog from '../containers/catalog';
import RoundedFooterAnimated from '../containers/rounded-footer-animated';
import {ANIMATION_TYPE} from '../const';
import {BrandThemeContext} from './brand-theme-provider';
import Space from './space';
import Text from './text';

type Props = {|
  onCardPress: (item: DisciplineCard | ChapterCard) => void,
  isFetching?: boolean
|};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  version: {
    fontSize: theme.fontSize.extraSmall,
    textAlign: 'center',
    padding: theme.spacing.base,
    color: theme.colors.white
  }
});

const Home = ({onCardPress, isFetching}: Props) => (
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
    <Catalog onPress={onCardPress} />
    <Space type="small" />
    <Text style={styles.version}>
      {translations.formatString('{0}: {1}', 'Version', version.commit)}
    </Text>
  </View>
);

export default Home;
