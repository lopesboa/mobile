import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {NovaSolidStatusCheckCircle2} from '@coorpacademy/nova-icons';
import type {DisciplineCard, ChapterCard, ScormCard} from '../layer/data/_types';
import theme from '../modules/theme';
import ImageBackground from './image-background';

const styles = StyleSheet.create({
  image: {
    backgroundColor: theme.colors.gray.white,
  },

  imageGradient: {
    paddingTop: theme.spacing.base,
  },
  imageCoverGradient: {
    padding: theme.spacing.base,
    justifyContent: 'flex-end',
  },
  imageCoverScorm: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconScormContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: theme.spacing.xlarge,
    height: theme.spacing.xlarge,
    borderRadius: theme.spacing.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
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

class CatalogItemCover extends React.PureComponent<Props> {
  handlePress = (event: any) => {
    const {onPress, item} = this.props;
    item && onPress && onPress(item);
  };

  render() {
    const {item, testID = 'catalog-item', size, children} = this.props;

    const isLocked = item && item.accessible === false;
    const isScorm = item && item.type === 'scorm';
    if (!isScorm) {
      return (
        <ImageBackground
          testID={`${testID}-image`}
          source={item && {uri: item.image}}
          gradient={
            (item &&
              !isLocked && [
                'rgba(0,0,0,0)',
                'rgba(0,0,0,0.4)',
                'rgba(0,0,0,0.7)',
                'rgba(0,0,0,1)',
              ]) || ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']
          }
          resizeMode="cover"
          style={[styles.image]}
          gradientStyle={(size === 'cover' && styles.imageCoverGradient) || styles.imageGradient}
        >
          {children}
        </ImageBackground>
      );
    } else {
      return (
        <React.Fragment>
          <ImageBackground
            testID={`${testID}-image`}
            source={item && {uri: item.image}}
            resizeMode="cover"
            style={[styles.image, styles.imageCoverScorm, {backgroundColor: theme.colors.scorm}]}
            gradientStyle={(size === 'cover' && styles.imageCoverGradient) || styles.imageGradient}
          >
            <View style={styles.iconScormContainer}>
              <NovaSolidStatusCheckCircle2
                testID={`icon-scorm-${testID}`}
                color={theme.colors.white}
                height={theme.spacing.large}
                width={theme.spacing.large}
              />
            </View>
          </ImageBackground>
          {children}
        </React.Fragment>
      );
    }
  }
}

export default CatalogItemCover;
