// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import CatalogComponent from '../components/catalog';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';

type ConnectedStateProps = {|
  items: Array<DisciplineCard | ChapterCard>
|};

type Props = {|
  ...ConnectedStateProps,
  onPress: (item: DisciplineCard | ChapterCard) => void
|};

const Catalog = ({items, onPress}: Props) => <CatalogComponent items={items} onPress={onPress} />;

const mapStateToProps = ({cards, ...state}: StoreState): ConnectedStateProps => {
  // @todo use user language
  const language = 'en';

  return {
    items: Object.keys(cards.entities)
      .map(key => cards.entities[key][language])
      .filter(item => item !== undefined)
  };
};

export default connect(mapStateToProps)(Catalog);
