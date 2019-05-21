// @flow

import * as React from 'react';
import {View, StyleSheet, Image} from 'react-native';

import type {ChapterCard, DisciplineCard} from '../layer/data/_types';
import {CARD_TYPE} from '../layer/data/_const';
import theme from '../modules/theme';
import {CARD_DISPLAY_MODE, AUTHOR_TYPE, ENGINE} from '../const';
import {getCleanUri} from '../modules/uri';
import translations from '../translations';
import type {AuthorType} from '../types';
import Loader from './loader';
import Space from './space';
import {BrandThemeContext} from './brand-theme-provider';
import CatalogItem from './catalog-item';
import Card from './card';
import {STYLE as BOX_STYLE} from './box';
import Text from './text';
import Touchable from './touchable';

type Props = {|
  titleCover: string,
  titleCards: string,
  logo: File | {uri: string},
  items: Array<DisciplineCard | ChapterCard>,
  onPress: (item: DisciplineCard | ChapterCard) => void,
  onLogoLongPress?: () => void
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
    fontSize: theme.fontSize.large,
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
  }
});

export const getAuthorType = (card: DisciplineCard | ChapterCard): AuthorType | void => {
  const author = card && card.authors[0];
  return author && author.authorType;
};

export const getAuthorName = (card: DisciplineCard | ChapterCard): string | void => {
  const author = card && card.authors[0];
  return author && author.label;
};

class Catalog extends React.PureComponent<Props> {
  props: Props;

  handlePress = (item: DisciplineCard | ChapterCard) => () => this.props.onPress(item);

  handleLogoLongPress = () => this.props.onLogoLongPress && this.props.onLogoLongPress();

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
            <View style={styles.container}>
              <Touchable
                testID="catalog-logo"
                onLongPress={this.handleLogoLongPress}
                analyticsID="sign-out"
                isWithoutFeedback
              >
                <Image style={styles.logo} testID="brand-logo" source={logo} />
              </Touchable>
              <Text style={styles.title}>{titleCover}</Text>

              <Card style={styles.card} shadowStyle={BOX_STYLE}>
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
                  universalRef={cover.universalRef}
                  type={cover.type === CARD_TYPE.CHAPTER ? ENGINE.MICROLEARNING : ENGINE.LEARNER}
                  section="finishLearning"
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
                  <View key={`catalog-item-row-${rowIndex}`}>
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
                          universalRef={cover.universalRef}
                          type={
                            item.type === CARD_TYPE.CHAPTER ? ENGINE.MICROLEARNING : ENGINE.LEARNER
                          }
                          section="forYou"
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
                            universalRef={cover.universalRef}
                            type={
                              nextItem.type === CARD_TYPE.CHAPTER
                                ? ENGINE.MICROLEARNING
                                : ENGINE.LEARNER
                            }
                            section="forYou"
                          />
                        </Card>
                      )}
                      {!nextItem && <View style={styles.card} />}
                    </View>
                  </View>
                );
              })}
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
