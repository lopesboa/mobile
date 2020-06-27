import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {AUTHOR_TYPE} from '../const';
import CatalogItemAuthor from './catalog-item-author';

storiesOf('CatalogItemAuthor', module)
  .add('Coorp', () => <CatalogItemAuthor type={AUTHOR_TYPE.COORP} testID="catalog-author" />)
  .add('Marketplace', () => (
    <CatalogItemAuthor
      name="marketplace"
      type={AUTHOR_TYPE.MARKETPLACE}
      testID="catalog-author-marketplace"
    />
  ))
  .add('Custom', () => (
    <CatalogItemAuthor
      name="custom author"
      type={AUTHOR_TYPE.CUSTOM}
      testID="catalog-author-custom"
    />
  ))
  .add('Cover size', () => (
    <CatalogItemAuthor
      name="coorp"
      size="cover"
      type={AUTHOR_TYPE.COORP}
      testID="catalog-author-custom-font-size"
    />
  ))
  .add('Hero size', () => (
    <CatalogItemAuthor
      name="coorp"
      size="hero"
      type={AUTHOR_TYPE.COORP}
      testID="catalog-author-custom-font-size"
    />
  ));
