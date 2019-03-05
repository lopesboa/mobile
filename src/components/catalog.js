// @flow

import * as React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

import type {ChapterCard, DisciplineCard} from '../layer/data/_types';
import theme from '../modules/theme';
import {CARD_DISPLAY_MODE, AUTHOR_TYPE} from '../const';
import {getCleanUri} from '../modules/uri';
import translations from '../translations';
import type {AuthorType} from '../types';
import Space from './space';
import {BrandThemeContext} from './brand-theme-provider';
import CatalogItem from './catalog-item';
import Card from './card';
import Loader from './loader';
import {STYLE as BOX_STYLE} from './box';

type Props = {|
  titleCover: string,
  titleCards: string,
  logo: File | {uri: string},
  items: Array<DisciplineCard | ChapterCard>,
  onPress: (item: DisciplineCard | ChapterCard) => void
|};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    margin: theme.spacing.small
  },
  logo: {
    height: 36,
    width: '100%',
    resizeMode: 'contain'
  },
  title: {
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    paddingBottom: theme.spacing.small,
    paddingTop: theme.spacing.base
  },
  cards: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  card: {
    flex: 1,
    borderRadius: theme.radius.card
  },
  footer: {
    position: 'absolute',
    bottom: '-60%',
    backgroundColor: '#222',
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
    transform: [{scaleX: 2}]
  }
});

const getAuthorType = (card: DisciplineCard | ChapterCard): AuthorType | void => {
  const author = card.authors[0];
  return author && author.authorType;
};

const getAuthorName = (card: DisciplineCard | ChapterCard): string | void => {
  const author = card.authors[0];
  return author && author.label;
};

class Catalog extends React.PureComponent<Props> {
  props: Props;

  handlePress = (item: DisciplineCard | ChapterCard) => () => this.props.onPress(item);

  render() {
    const {items, titleCover, titleCards, logo} = this.props;
    if (items.length > 0) {
      let nextItem: DisciplineCard | ChapterCard;
      let rowIndex: number = -1;
      const cover: DisciplineCard | ChapterCard = items.splice(0, 1)[0];
      // @todo Replace progression with user data

      return (
        <BrandThemeContext.Consumer>
          {brandTheme => (
            <View>
              <View style={[styles.footer, {backgroundColor: brandTheme.colors.primary}]} />

              <View style={styles.container}>
                <Image style={styles.logo} source={logo} />
                <Text style={styles.title}>{titleCover}</Text>

                <Card style={styles.card} shadowStyle={[BOX_STYLE]}>
                  <CatalogItem
                    title={cover.title}
                    subtitle={cover.authors.map(author => author.label).join(', ')}
                    progression={{
                      current: cover.completion,
                      count: 1
                    }}
                    image={{uri: getCleanUri(cover.image)}}
                    authorType={getAuthorType(cover)}
                    authorName={
                      getAuthorType(cover) !== AUTHOR_TYPE.CUSTOM
                        ? getAuthorName(cover)
                        : brandTheme.name
                    }
                    badge={cover.isNew ? translations.new : ''}
                    isAdaptive={cover.adaptiv}
                    displayMode={CARD_DISPLAY_MODE.COVER}
                    onPress={this.handlePress(cover)}
                    testID={`catalog-item-${cover.universalRef.replace(/_/g, '-')}`}
                    isCertified={getAuthorType(cover) === AUTHOR_TYPE.VERIFIED}
                  />
                </Card>
                <Text style={styles.title}>{titleCards}</Text>
                {items.map((item, index) => {
                  nextItem = items[index + 1];

                  if (index % 2 === 1) {
                    return null;
                  }
                  rowIndex++;
                  return (
                    <View key={`question-choice-row-${rowIndex}`}>
                      {index > 0 && <Space />}
                      <View style={styles.cards}>
                        <Card style={styles.card} shadowStyle={BOX_STYLE}>
                          <CatalogItem
                            title={item.title}
                            subtitle={item.authors.map(author => author.label).join(', ')}
                            progression={{
                              current: item.completion,
                              count: 1
                            }}
                            image={{uri: getCleanUri(item.image)}}
                            authorType={getAuthorType(item)}
                            authorName={
                              getAuthorType(item) !== AUTHOR_TYPE.CUSTOM
                                ? getAuthorName(cover)
                                : brandTheme.name
                            }
                            badge={item.isNew ? translations.new : ''}
                            isAdaptive={item.adaptiv}
                            displayMode={CARD_DISPLAY_MODE.CARD}
                            onPress={this.handlePress(item)}
                            testID={`catalog-item-${item.universalRef.replace(/_/g, '-')}`}
                            isCertified={getAuthorType(item) === AUTHOR_TYPE.VERIFIED}
                          />
                        </Card>
                        <Space />
                        {nextItem && (
                          <Card style={styles.card} shadowStyle={BOX_STYLE}>
                            <CatalogItem
                              title={nextItem.title}
                              subtitle={nextItem.authors.map(author => author.label).join(', ')}
                              progression={{
                                current: nextItem.completion,
                                count: 1
                              }}
                              image={{uri: getCleanUri(nextItem.image)}}
                              authorType={getAuthorType(nextItem)}
                              authorName={
                                getAuthorType(nextItem) !== AUTHOR_TYPE.CUSTOM
                                  ? getAuthorName(cover)
                                  : brandTheme.name
                              }
                              badge={nextItem.isNew ? translations.new : ''}
                              isAdaptive={nextItem.adaptiv}
                              displayMode={CARD_DISPLAY_MODE.CARD}
                              onPress={this.handlePress(nextItem)}
                              testID={`catalog-item-${nextItem.universalRef.replace(/_/g, '-')}`}
                              isCertified={getAuthorType(nextItem) === AUTHOR_TYPE.VERIFIED}
                            />
                          </Card>
                        )}
                        {!nextItem && <View style={styles.card} />}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </BrandThemeContext.Consumer>
      );
    } else {
      return (
        <View style={styles.loaderContainer}>
          <Loader height={60} />
        </View>
      );
    }
  }
}

export default Catalog;
