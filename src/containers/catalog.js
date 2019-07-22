// @flow

import * as React from 'react';
import {connect} from 'react-redux';

import CatalogComponent, {SEPARATOR_HEIGHT} from '../components/catalog';
import type {Props as ComponentProps} from '../components/catalog';
import {HEIGHT as SECTION_HEIGHT} from '../components/catalog-section';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {fetchCards} from '../redux/actions/catalog/cards/fetch';
import {fetchSections} from '../redux/actions/catalog/sections';
import {getSection} from '../redux/utils/state-extract';
import {getOffsetWithoutCards, getLimitWithoutCards, isEmptySection} from '../modules/sections';
import translations from '../translations';
import type {Section} from '../types';
import withLayout from './with-layout';
import type {WithLayoutProps} from './with-layout';

type ConnectedStateProps = {|
  sections: Array<Section | void>,
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

const DEFAULT_LIMIT = 4;
const DEBOUNCE_DURATION = 100;

class Catalog extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    isRefreshing: false
  };

  timeout: TimeoutID;

  offsetY: number = 0;

  componentDidMount() {
    this.fetchSections(0, this.getLimit(0));
  }

  componentDidUpdate(prevProps: Props) {
    const {sections} = this.props;
    const emptySections = sections.filter(section => section && isEmptySection(section));
    const previousEmptySections = prevProps.sections.filter(
      section => section && isEmptySection(section)
    );

    if (emptySections.length !== previousEmptySections.length) {
      const offset = this.getOffset();
      const limit = this.getLimit(offset);
      const hasUnfetchedSections = this.hasUnfetchedSections(offset, limit);

      if (hasUnfetchedSections) {
        this.fetchSections(offset, limit);
      }
    }
  }

  fetchSections = async (offset: number, limit: number, forceRefresh?: boolean = false) => {
    await this.props.fetchSections(offset, limit, translations.getLanguage(), forceRefresh);
  };

  handleRefresh = () => {
    this.setState({isRefreshing: true});
    this.fetchSections(0, this.getLimit(0), true)
      .then(() => this.setState({isRefreshing: false}))
      .catch(e => {
        this.setState({isRefreshing: false});
        // eslint-disable-next-line no-console
        console.error(e);
      });
  };

  getOffset = (): number => {
    const {sections} = this.props;
    const offset = Math.trunc(this.offsetY / (SECTION_HEIGHT + SEPARATOR_HEIGHT));

    return getOffsetWithoutCards(sections, offset);
  };

  getLimit = (offset: number): number => {
    const {layout, sections} = this.props;
    if (!layout || !sections) {
      return DEFAULT_LIMIT;
    }

    const limit = Math.ceil(layout.height / (SECTION_HEIGHT + SEPARATOR_HEIGHT) + 1);

    return getLimitWithoutCards(sections, offset, limit);
  };

  hasUnfetchedSections = (offset: number, limit: number): boolean => {
    const {sections} = this.props;

    return sections.slice(offset, offset + limit).findIndex(section => !section) !== -1;
  };

  handleScroll = ({nativeEvent}: ScrollEvent) => {
    const {layout} = this.props;
    const offsetY = nativeEvent.contentOffset.y;

    if (offsetY !== this.offsetY && layout) {
      this.offsetY = offsetY;

      const offset = this.getOffset();
      const limit = this.getLimit(offset);
      const hasUnfetchedSections = this.hasUnfetchedSections(offset, limit);

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
        sections={sections.filter(section => !(section && isEmptySection(section)))}
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

const mapStateToProps = (state: StoreState): ConnectedStateProps => {
  const {sectionsRef = [], entities} = state.catalog;
  const language = translations.getLanguage();

  return {
    sections: sectionsRef.map(key => key && getSection(state, key)),
    cards: Object.keys(entities.cards)
      .map(key => entities.cards[key][language])
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
