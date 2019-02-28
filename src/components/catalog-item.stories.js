// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import image from '../__fixtures__/assets/landscape-1.jpg';
import type {Progression} from '../types';
import {CARD_DISPLAY_MODE} from '../const';
import {handleFakePress} from '../utils/tests';
import CatalogItem from './catalog-item';

const progression: Progression = {
  current: 3,
  count: 10
};

storiesOf('Catalogue Item', module)
  .add('Adaptive', () => (
    <CatalogItem
      title="Predicting the future"
      subtitle="Coorpacademy"
      progression={progression}
      image={image}
      authorType="BREGUET CREATION"
      isAdaptive
      onPress={handleFakePress}
      testID="catalog1"
    />
  ))
  .add('New', () => (
    <CatalogItem
      title="Predicting the future"
      subtitle="Coorpacademy"
      progression={progression}
      image={image}
      authorType="BREGUET CREATION"
      badge="New"
      isAdaptive={false}
      onPress={handleFakePress}
      testID="catalog2"
    />
  ))
  .add('Adaptive/New/Certified/Coorp', () => (
    <CatalogItem
      title="Predicting the future"
      subtitle="Coorpacademy"
      progression={progression}
      image={image}
      authorType="coorp"
      badge="New"
      isAdaptive
      displayMode={CARD_DISPLAY_MODE.COVER}
      isCertified
      onPress={handleFakePress}
      testID="catalog3"
    />
  ))
  .add('Adaptive/New/Certified/Custom', () => (
    <CatalogItem
      title="Predicting the future"
      subtitle="Coorpacademy"
      progression={progression}
      image={image}
      authorType="CUSTOM EDITOR"
      badge="New"
      isAdaptive
      displayMode={CARD_DISPLAY_MODE.CARD}
      isCertified
      onPress={handleFakePress}
      testID="catalog4"
    />
  ));
