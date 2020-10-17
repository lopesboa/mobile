import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {NovaSolidLocksLock11 as LockIcon} from '@coorpacademy/nova-icons';

import type {DisciplineCard, ChapterCard, ScormCard} from '../layer/data/_types';
import {CARD_TYPE} from '../layer/data/_const';
import {ENGINE} from '../const';
import theme from '../modules/theme';
import translations from '../translations';
import CatalogItemContent from './catalog-item-content';
import CatalogItemBadge from './catalog-item-badge';
import Touchable from './touchable';
import Overlay from './overlay';
import CatalogItemCover from './catalog-item-cover';

export const HEIGHT = 255;
export const WIDTH = 168;
export const COVER_HEIGHT = 264;

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    backgroundColor: theme.colors.white,
  },

  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

type AnalyticsParams = {
  section?: string;
};

interface Props extends AnalyticsParams {
  item?: DisciplineCard | ChapterCard | ScormCard;
  onPress?: (arg0: DisciplineCard | ChapterCard) => void;
  size?: 'cover';
  testID?: string;
}

class CatalogItem extends React.PureComponent<Props> {
  handlePress = (event: any) => {
    const {onPress, item} = this.props;
    item && onPress && onPress(item);
  };

  render() {
    const {item, testID = 'catalog-item', section, size} = this.props;

    const analyticsParams = item && {
      ref: item.universalRef,
      // TODO :: case when type is SCORM
      type: item.type === CARD_TYPE.CHAPTER ? ENGINE.MICROLEARNING : ENGINE.LEARNER,
      section,
    };

    const isLocked = item && item.accessible === false;
    const isScorm = item && item.type === 'scorm';
    return (
      <Touchable
        testID={testID}
        onPress={this.handlePress}
        disabled={!item || isLocked}
        style={size !== 'cover' && styles.container}
        analyticsID="card"
        analyticsParams={analyticsParams}
      >
        <CatalogItemCover item={item} testID={`${testID}-image`}>
          {item && item.isNew ? (
            <View style={styles.badge}>
              <CatalogItemBadge
                label={translations.formatString(
                  '{0}{1}',
                  translations.new.charAt(0).toUpperCase(),
                  translations.new.slice(1).toUpperCase(),
                )}
                size={size}
                testID={`${testID}-badge`}
              />
            </View>
          ) : null}
          <CatalogItemContent item={item} size={size} testID={`${testID}-content`} />
          {isLocked ? (
            <Overlay>
              <LockIcon width={40} height={40} color={theme.colors.white} />
            </Overlay>
          ) : null}
        </CatalogItemCover>
      </Touchable>
    );
  }
}

export default CatalogItem;
