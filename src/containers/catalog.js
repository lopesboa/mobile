// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import CatalogComponent, {SEPARATOR_HEIGHT} from '../components/catalog';
import type {Props as ComponentProps} from '../components/catalog';
import {HEIGHT as SECTION_HEIGHT} from '../components/catalog-section';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {fetchCards} from '../redux/actions/catalog/cards';
import {fetchSections} from '../redux/actions/catalog/sections';
import translations from '../translations';
import type {Section} from '../types';
import withLayout from './with-layout';
import type {WithLayoutProps} from './with-layout';

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
  ...WithLayoutProps,
  onCardPress: $PropertyType<ComponentProps, 'onCardPress'>,
  children?: $PropertyType<ComponentProps, 'children'>
|};

type State = {|
  isRefreshing: boolean
|};

const DEFAULT_LIMIT = 3;
const DEBOUNCE_DURATION = 100;

class Catalog extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    isRefreshing: false
  };

  timeout: TimeoutID;

  offsetY: number = 0;

  componentDidMount() {
    this.fetchSections(0, DEFAULT_LIMIT);
  }

  fetchSections = async (offset: number, limit: number) => {
    await this.props.fetchSections(offset, limit, translations.getLanguage());
  };

  handleRefresh = () => {
    this.setState({isRefreshing: true});
    this.fetchSections(0, DEFAULT_LIMIT)
      .then(() => this.setState({isRefreshing: false}))
      .catch(e => {
        this.setState({isRefreshing: false});
        // eslint-disable-next-line no-console
        console.error(e);
      });
  };

  getOffset = (offsetY: number): number =>
    Math.trunc(offsetY / (SECTION_HEIGHT + SEPARATOR_HEIGHT));

  getLimit = (): number => {
    const {layout} = this.props;
    if (!layout) {
      return 1;
    }

    return Math.ceil(layout.height / (SECTION_HEIGHT + SEPARATOR_HEIGHT) + 1);
  };

  handleScroll = ({nativeEvent}: ScrollEvent) => {
    const {layout, sections} = this.props;
    const offsetY = nativeEvent.contentOffset.y;

    if (offsetY !== this.offsetY && layout) {
      this.offsetY = offsetY;
      const offset = this.getOffset(offsetY);
      const limit = this.getLimit();
      const hasUnfetchedSections =
        sections && sections.slice(offset, offset + limit).findIndex(section => !section) !== -1;

      if (hasUnfetchedSections) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          if (this.offsetY === offsetY) {
            this.fetchSections(offset, limit);
          }
        }, DEBOUNCE_DURATION);
      }
    }
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
        onScroll={this.handleScroll}
      >
        {children}
      </CatalogComponent>
    );
  }
}

const mapStateToProps = ({catalog, authentication, ...state}: StoreState): ConnectedStateProps => {
  const {sectionsRef = []} = catalog;
  const language = translations.getLanguage();
  const sections = sectionsRef.map(key => {
    if (key) {
      const section = catalog.entities.sections[key];
      return section[language];
    }

    return key;
  });

  return {
    sections,
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
)(withLayout(Catalog));
