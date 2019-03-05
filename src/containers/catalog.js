// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import CatalogComponent from '../components/catalog';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import translations from '../translations';

type ConnectedStateProps = {|
  items: Array<DisciplineCard | ChapterCard>
|};

type Props = {|
  ...ConnectedStateProps,
  onPress: (item: DisciplineCard | ChapterCard) => void
|};

const Catalog = ({items, onPress}: Props) => (
  <CatalogComponent
    logo={{
      uri:
        'https://mobile-staging.coorpacademy.com/assets/css/skin/logos/logo_coorpacademy-mobile-theme3.58ba909c8d6.png'
    }}
    titleCover={translations.startLearning}
    titleCards={translations.forYou}
    items={items}
    onPress={onPress}
  />
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
