// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {NovaSolidLocksLock11 as LockIcon} from '@coorpacademy/nova-icons';

import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {CARD_TYPE} from '../layer/data/_const';
import {ENGINE} from '../const';
import theme from '../modules/theme';
import translations from '../translations';
import CatalogItemContent from './catalog-item-content';
import CatalogItemBadge from './catalog-item-badge';
import ImageBackground from './image-background';
import Touchable from './touchable';
import Overlay from './overlay';

export const HEIGHT = 205;
export const WIDTH = 168;
export const COVER_HEIGHT = 264;

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH
  },
  image: {
    backgroundColor: theme.colors.gray.light
  },
  imageLocked: {
    opacity: 0.4
  },
  imageGradient: {
    paddingTop: theme.spacing.base,
    padding: theme.spacing.small
  },
  imageCover: {
    height: COVER_HEIGHT
  },
  imageCoverGradient: {
    padding: theme.spacing.base,
    justifyContent: 'flex-end'
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0
  }
});

type AnalyticsParams = {|
  section?: string
|};

type Props = $Exact<{|
  ...AnalyticsParams,
  item?: DisciplineCard | ChapterCard,
  onPress?: (DisciplineCard | ChapterCard) => void,
  size?: 'cover',
  testID?: string
|}>;

class CatalogItem extends React.PureComponent<Props> {
  props: Props;

  handlePress = () => {
    const {onPress, item} = this.props;

    item && onPress && onPress(item);
  };

  render() {
    const {item, testID = 'catalog-item', section, size} = this.props;

    const analyticsParams = item && {
      ref: item.universalRef,
      type: item.type === CARD_TYPE.CHAPTER ? ENGINE.MICROLEARNING : ENGINE.LEARNER,
      section
    };

    const isLocked = item && item.accessible === false;

    return (
      <Touchable
        testID={testID}
        onPress={this.handlePress}
        disabled={!item || isLocked}
        isHighlight
        style={size !== 'cover' && styles.container}
        analyticsID="card"
        analyticsParams={analyticsParams}
      >
        <React.Fragment>
          <ImageBackground
            testID={`${testID}-image`}
            source={item && {uri: item.image}}
            gradient={
              (item &&
                !isLocked && [
                  'rgba(0,0,0,0)',
                  'rgba(0,0,0,0.4)',
                  'rgba(0,0,0,0.7)',
                  'rgba(0,0,0,1)'
                ]) || ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']
            }
            resizeMode="cover"
            style={[
              styles.image,
              isLocked && styles.imageLocked,
              (size === 'cover' && styles.imageCover) || styles.container
            ]}
            gradientStyle={(size === 'cover' && styles.imageCoverGradient) || styles.imageGradient}
          >
            {item && item.isNew ? (
              <View style={styles.badge}>
                <CatalogItemBadge
                  label={translations.formatString(
                    '{0}{1}',
                    translations.new.charAt(0).toUpperCase(),
                    translations.new.slice(1)
                  )}
                  size={size}
                  testID={`${testID}-badge`}
                />
              </View>
            ) : null}
            <CatalogItemContent item={item} size={size} testID={`${testID}-content`} />
          </ImageBackground>
          {isLocked ? (
            <Overlay>
              <LockIcon width={40} height={40} color={theme.colors.white} />
            </Overlay>
          ) : null}
        </React.Fragment>
      </Touchable>
    );
  }
}

export default CatalogItem;
