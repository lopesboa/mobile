// @flow

import * as React from 'react';
import {Text, StyleSheet} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import {CARD_TYPE, CARD_DISPLAY_MODE, AUTHOR_TYPE} from '../const';
import image from '../__fixtures__/assets/landscape-1.jpg';
import type {Progression} from '../types';
import theme from '../modules/theme';
import {handleFakePress} from '../utils/tests';
import translations from '../translations';
import Card from './card';
import CardHeader from './card-header';
import CatalogItem from './catalog-item';
import {STYLE as BOX_STYLE} from './box';

const progression: Progression = {
  current: 3,
  count: 10
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.card,
    borderBottomWidth: 1,
    borderColor: 'rgba(20, 23, 26, 0.15)'
  }
});

storiesOf('Card', module)
  .add('Tip', () => (
    <Card>
      <CardHeader type={CARD_TYPE.TIP} title="Foo bar baz" />
      <Text>A sponsored post is a small advertising insert appearing in users’ timelines.</Text>
    </Card>
  ))
  .add('Key point', () => (
    <Card>
      <CardHeader type={CARD_TYPE.KEY_POINT} title="Foo bar baz" />
      <Text>A sponsored post is a small advertising insert appearing in users’ timelines.</Text>
    </Card>
  ))
  .add('Correction', () => (
    <Card>
      <CardHeader type={CARD_TYPE.CORRECTION} title="Foo bar baz" />
      <Text>A sponsored post is a small advertising insert appearing in users’ timelines.</Text>
    </Card>
  ))
  .add('Catalog Item Cover', () => (
    <Card style={styles.card} shadowStyle={BOX_STYLE}>
      <CatalogItem
        title="Predicting the future"
        subtitle="Coorpacademy"
        progression={progression}
        image={image}
        authorType={AUTHOR_TYPE.CUSTOM}
        authorName="CUSTOM"
        badge={translations.new}
        isAdaptive
        displayMode={CARD_DISPLAY_MODE.COVER}
        isCertified
        onPress={handleFakePress}
        testID="catalog1"
        universalRef="foobar"
        type="learner"
        section="finishLearning"
      />
    </Card>
  ))
  .add('Catalog Item Card', () => (
    <Card style={styles.card} shadowStyle={BOX_STYLE}>
      <CatalogItem
        title="Predicting the future"
        subtitle="Coorpacademy"
        progression={progression}
        image={image}
        authorType={AUTHOR_TYPE.CUSTOM}
        authorName="CUSTOM EDITOR"
        badge={translations.new}
        isAdaptive
        displayMode={CARD_DISPLAY_MODE.CARD}
        isCertified
        onPress={handleFakePress}
        testID="catalog2"
        universalRef="foobar"
        type="learner"
        section="finishLearning"
      />
    </Card>
  ));
