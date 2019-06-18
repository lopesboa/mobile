// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import CatalogComponent from '../components/catalog';
import type {Props as ComponentProps} from '../components/catalog';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {fetchCards} from '../redux/actions/catalog/cards';
import {fetchSections} from '../redux/actions/catalog/sections';
import translations from '../translations';
import type {Section} from '../types';

type ConnectedStateProps = {|
  sections: Array<Section>,
  cards: Array<DisciplineCard | ChapterCard>,
  children?: React.Node
|};

type ConnectedDispatchProps = {|
  fetchCards: typeof fetchCards,
  fetchSections: typeof fetchSections
|};

type Props = {|
  ...ConnectedStateProps,
  ...ConnectedDispatchProps,
  onCardPress: $PropertyType<ComponentProps, 'onCardPress'>,
  children?: $PropertyType<ComponentProps, 'children'>
|};

type State = {|
  isRefreshing: boolean
|};

class Catalog extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    isRefreshing: false
  };

  componentDidMount() {
    this.fetchContent();
  }

  fetchContent = async () => {
    await this.props.fetchSections(translations.getLanguage());
  };

  handleRefresh = () => {
    this.setState({isRefreshing: true});
    this.fetchContent()
      .then(() => this.setState({isRefreshing: false}))
      .catch(e => {
        this.setState({isRefreshing: false});
        // eslint-disable-next-line no-console
        console.error(e);
      });
  };

  handleCardsScroll = (section: Section, offset: number, limit: number) => {
    this.props.fetchCards(section.key, offset, limit, translations.getLanguage());
  };

  render() {
    const {sections, cards, onCardPress, children} = this.props;
    const {isRefreshing} = this.state;

    return (
      <CatalogComponent
        sections={sections}
        cards={cards}
        onCardPress={onCardPress}
        onRefresh={this.handleRefresh}
        isRefreshing={isRefreshing}
        onCardsScroll={this.handleCardsScroll}
      >
        {children}
      </CatalogComponent>
    );
  }
}

const mapStateToProps = ({catalog, authentication, ...state}: StoreState): ConnectedStateProps => {
  const language = translations.getLanguage();

  return {
    sections: Object.keys(catalog.entities.sections)
      .map(key => catalog.entities.sections[key][language])
      .filter(item => !(item && item.cardsRef && item.cardsRef.length === 0))
      .sort((a, b) => a.order - b.order),
    cards: Object.keys(catalog.entities.cards)
      .map(key => catalog.entities.cards[key][language])
      .filter(item => item !== undefined)
  };
};

const mapDispatchToProps: ConnectedDispatchProps = {
  fetchCards,
  fetchSections
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Catalog);
