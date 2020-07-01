import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {createChapterCard} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import CatalogItemContent from './catalog-item-content';

const card = createChapterCard({
  ref: 'bar',
  completion: 0.8,
  title: 'Chapter card',
  status: CARD_STATUS.ACTIVE,
  isNew: true,
  isAdaptive: true,
});

storiesOf('CatalogItemContent', module)
  .add('Default', () => <CatalogItemContent />)
  .add('Default (cover)', () => <CatalogItemContent size="cover" />)
  .add('Default (hero)', () => <CatalogItemContent size="hero" />)
  .add('With item', () => <CatalogItemContent item={card} />)
  .add('With item (cover)', () => <CatalogItemContent item={card} size="cover" />)
  .add('With item (hero)', () => <CatalogItemContent item={card} size="hero" />);
