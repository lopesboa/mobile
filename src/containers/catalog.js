// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import CatalogComponent from '../components/catalog';
import {BrandThemeContext} from '../components/brand-theme-provider';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import translations from '../translations';
import {compareCards} from '../utils/content';

type ConnectedStateProps = {|
  items: Array<DisciplineCard | ChapterCard>
|};

type Props = {|
  ...ConnectedStateProps,
  onPress: (item: DisciplineCard | ChapterCard) => void
|};

const Catalog = ({items, onPress}: Props) => {
  const firstIsStarted = !(items[0] && items[0].completion === 0);

  return (
    <BrandThemeContext.Consumer>
      {brandTheme => (
        <CatalogComponent
          logo={{
            uri: brandTheme.images['logo-mobile']
          }}
          titleCover={firstIsStarted ? translations.finishLearning : translations.startLearning}
          titleCards={translations.forYou}
          items={items}
          onPress={onPress}
        />
      )}
    </BrandThemeContext.Consumer>
  );
};

const mapStateToProps = ({cards, brands, ...state}: StoreState): ConnectedStateProps => {
  const language = translations.getLanguage();

  return {
    items: Object.keys(cards.entities)
      .map(key => cards.entities[key][language])
      .filter(item => item !== undefined)
      .sort(compareCards)
  };
};

export default connect(mapStateToProps)(Catalog);
