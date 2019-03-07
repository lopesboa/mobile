// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import CatalogComponent from '../components/catalog';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import translations from '../translations';
import {BrandThemeContext} from '../components/brand-theme-provider';

type ConnectedStateProps = {|
  items: Array<DisciplineCard | ChapterCard>
|};

type Props = {|
  ...ConnectedStateProps,
  onPress: (item: DisciplineCard | ChapterCard) => void
|};

const Catalog = ({items, onPress}: Props) => (
  <BrandThemeContext.Consumer>
    {brandTheme => (
      <CatalogComponent
        logo={{uri: brandTheme.images.logo}}
        titleCover={translations.startLearning}
        titleCards={translations.forYou}
        items={items}
        onPress={onPress}
      />
    )}
  </BrandThemeContext.Consumer>
);

const mapStateToProps = ({cards, brands, ...state}: StoreState): ConnectedStateProps => {
  // @todo use user language
  const language = 'en';

  return {
    items: Object.keys(cards.entities)
      .map(key => cards.entities[key][language])
      .filter(item => item !== undefined)
  };
};

export default connect(mapStateToProps)(Catalog);
