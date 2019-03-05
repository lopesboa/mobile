// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {AUTHOR_TYPE} from '../const';

import CatalogItemAuthor from './catalog-item-author';

storiesOf('Catalog Item Author', module)
  .add('Coorp', () => (
    <CatalogItemAuthor authorName="coorp" authorType={AUTHOR_TYPE.COORP} testID="catalog-author" />
  ))
  .add('Marketplace', () => (
    <CatalogItemAuthor
      authorName="marketplace"
      authorType={AUTHOR_TYPE.MARKETPLACE}
      testID="catalog-author-marketplace"
    />
  ))
  .add('Custom', () => (
    <CatalogItemAuthor
      authorName="custom author"
      authorType={AUTHOR_TYPE.CUSTOM}
      testID="catalog-author-custom"
    />
  ))
  .add('Verified', () => (
    <CatalogItemAuthor
      authorName="custom author"
      authorType={AUTHOR_TYPE.VERIFIED}
      testID="catalog-author-empty"
    />
  ));
