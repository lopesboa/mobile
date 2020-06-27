import * as React from 'react';

import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {getAuthor} from '../utils/content';
import {BrandThemeContext} from './brand-theme-provider';
import CatalogItemFooter from './catalog-item-footer';
import CatalogItemAuthor from './catalog-item-author';

interface Props {
  item?: DisciplineCard | ChapterCard,
  size?: 'cover' | 'hero',
  testID?: string
};

const CatalogItemContent = ({item, size, testID = 'catalog-item-content'}: Props) => (
  <BrandThemeContext.Consumer>
    {brandTheme => {
      const author = item && getAuthor(item);

      return (
        <React.Fragment>
          {author ? (
            <CatalogItemAuthor
              type={author.authorType}
              name={author.label}
              size={size}
              testID={`${testID}-author`}
            />
          ) : null}
          <CatalogItemFooter item={item} size={size} testID={`${testID}-footer`} />
        </React.Fragment>
      );
    }}
  </BrandThemeContext.Consumer>
);

export default CatalogItemContent;
