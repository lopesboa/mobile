import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {createChapterCard, createDisciplineCard, createCardLevel} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import CatalogItemFooter from './catalog-item-footer';

const levelCard = createCardLevel({ref: 'mod_1', status: CARD_STATUS.ACTIVE, label: 'Fake level'});
const disciplineCard = createDisciplineCard({
  ref: 'foo',
  completion: 0.3,
  levels: [levelCard],
  title: 'Discipline card',
});
const disciplineCardAdaptive = createDisciplineCard({
  ref: 'foo',
  completion: 0.3,
  levels: [levelCard],
  title: 'Discipline card',
  isAdaptive: true,
});
const disciplineCardAdaptiveWithThreeLevels = createDisciplineCard({
  ref: 'foo',
  completion: 0.3,
  levels: [levelCard, levelCard, levelCard],
  title: 'Discipline card',
  isAdaptive: true,
});
const disciplineCardWithoutAuthor = createDisciplineCard({
  ref: 'foo',
  completion: 0.3,
  levels: [levelCard],
  title: 'Discipline card',
  authors: [],
});
const chapterCard = createChapterCard({
  ref: 'bar',
  completion: 0.8,
  title: 'Chapter card',
  status: CARD_STATUS.ACTIVE,
});
const chapterCardAdaptive = createChapterCard({
  ref: 'bar',
  completion: 0.8,
  title: 'Chapter card',
  status: CARD_STATUS.ACTIVE,
  isAdaptive: true,
});
const chapterCardWithoutAuthor = createChapterCard({
  ref: 'bar',
  completion: 0.8,
  title: 'Chapter card',
  status: CARD_STATUS.ACTIVE,
  authors: [],
});

storiesOf('CatalogItemFooter', module)
  .add('Default', () => <CatalogItemFooter testID="catalog-item-footer" />)
  .add('Default (hero)', () => <CatalogItemFooter size="hero" testID="catalog-item-footer" />)
  .add('Chapter', () => <CatalogItemFooter item={chapterCard} testID="catalog-item-footer" />)
  .add('Chapter (adaptive)', () => (
    <CatalogItemFooter item={chapterCardAdaptive} testID="catalog-item-footer" />
  ))
  .add('Chapter (cover)', () => (
    <CatalogItemFooter size="cover" item={chapterCard} testID="catalog-item-footer" />
  ))
  .add('Chapter (hero)', () => (
    <CatalogItemFooter size="hero" item={chapterCard} testID="catalog-item-footer" />
  ))
  .add('Chapter (without author)', () => (
    <CatalogItemFooter item={chapterCardWithoutAuthor} testID="catalog-item-footer" />
  ))
  .add('Discipline', () => <CatalogItemFooter item={disciplineCard} testID="catalog-item-footer" />)
  .add('Discipline (adaptive)', () => (
    <CatalogItemFooter item={disciplineCardAdaptive} testID="catalog-item-footer" />
  ))
  .add('Discipline (adaptive with three levels)', () => (
    <CatalogItemFooter item={disciplineCardAdaptiveWithThreeLevels} testID="catalog-item-footer" />
  ))
  .add('Discipline (cover)', () => (
    <CatalogItemFooter size="cover" item={disciplineCard} testID="catalog-item-footer" />
  ))
  .add('Discipline (hero)', () => (
    <CatalogItemFooter size="hero" item={disciplineCard} testID="catalog-item-footer" />
  ))
  .add('Discipline (without author)', () => (
    <CatalogItemFooter item={disciplineCardWithoutAuthor} testID="catalog-item-footer" />
  ));
