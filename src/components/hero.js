// @flow strict

import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import theme from '../modules/theme';
import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import translations from '../translations';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {CARD_TYPE} from '../layer/data/_const';
import {ENGINE} from '../const';
import {BrandThemeContext} from './brand-theme-provider';
import {UserContext} from './user-provider';
import Button from './button';
import {PLACEHOLDER_COLOR} from './catalog-item-footer';
import CatalogItemContent from './catalog-item-content';
import ImageBackground from './image-background';
import Space from './space';
import Text from './text';

export const HEIGHT = 337;

const styles = StyleSheet.create({
  image: {
    height: HEIGHT,
    width: '100%',
    backgroundColor: theme.colors.gray.light
  },
  imageGradient: {
    justifyContent: 'flex-end',
    padding: theme.spacing.base
  },
  content: {
    flex: 1
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xxlarge,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center'
  },
  button: {
    alignSelf: 'center',
    minWidth: '40%'
  }
});

type Props = {|
  ...WithLayoutProps,
  content?: DisciplineCard | ChapterCard | null,
  onPress: (DisciplineCard | ChapterCard) => void
|};

class Hero extends React.PureComponent<Props> {
  props: Props;

  handlePress = () => {
    const {content, onPress} = this.props;

    content && onPress(content);
  };

  render() {
    const {layout, content} = this.props;
    const width = layout && layout.width;
    const analyticsParams = content && {
      ref: content.universalRef,
      type: content.type === CARD_TYPE.CHAPTER ? ENGINE.MICROLEARNING : ENGINE.LEARNER,
      section: 'hero'
    };

    return (
      <UserContext.Consumer>
        {user => (
          <BrandThemeContext.Consumer>
            {brandTheme => {
              const isLoading = content === null;
              const heroUri =
                (!isLoading && ((content && content.image) || (brandTheme && brandTheme.hero))) ||
                undefined;

              return (
                <ImageBackground
                  height={HEIGHT}
                  width={width}
                  style={styles.image}
                  resizeMode="cover"
                  source={width && heroUri && {uri: heroUri}}
                  gradientStyle={styles.imageGradient}
                  gradient={
                    (!isLoading && [
                      'rgba(0,0,0,0)',
                      'rgba(0,0,0,0.4)',
                      'rgba(0,0,0,0.7)',
                      'rgba(0,0,0,1)'
                    ]) || ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']
                  }
                >
                  {!isLoading && !content && user && (
                    <Text style={styles.text} testID="catalog-hero-welcome-message">
                      {translations.welcomeUser.replace(
                        /{{displayname}}/g,
                        `\n${user.displayName}`
                      )}
                    </Text>
                  )}
                  {(isLoading || content) && (
                    <View style={styles.content}>
                      <CatalogItemContent
                        item={(content !== null && content) || undefined}
                        size="hero"
                        testID="catalog-hero"
                      />
                      <Space type="base" />
                      <Button
                        onPress={this.handlePress}
                        testID="catalog-hero-button"
                        analyticsID="hero"
                        analyticsParams={analyticsParams}
                        style={styles.button}
                        isSmall
                        isPlaceholder={!content}
                        placeholderColor={PLACEHOLDER_COLOR}
                      >
                        {translations.resumeLearning}
                      </Button>
                    </View>
                  )}
                </ImageBackground>
              );
            }}
          </BrandThemeContext.Consumer>
        )}
      </UserContext.Consumer>
    );
  }
}

export {Hero as Component};
export default withLayout(Hero);
