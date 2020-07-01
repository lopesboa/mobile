import * as React from 'react';
import {StyleSheet, View, ImageStyle} from 'react-native';
import {
  NovaSolidAudioAudioControlPlay as PlayIcon,
  NovaLineFilesOfficeFileOfficePdf as PDFIcon,
} from '@coorpacademy/nova-icons';
import type {LessonType} from '../types/coorpacademy/progression-engine';

import {RESOURCE_TYPE} from '../const';
import theme from '../modules/theme';
import translations from '../translations';
import type {SourceURI} from '../types';
import Button from './button';
import Space from './space';
import Overlay from './overlay';
import ExtraLife from './extralife';
import Text from './text';
import Touchable from './touchable';
import Loader from './loader';
import ImageBackground from './image-background';

export const EXTRALIFE = 'extralife';

interface Props {
  type: LessonType | typeof EXTRALIFE;
  source: File | SourceURI;
  isLoading?: boolean;
  hasOverlay?: boolean;
  iconWidth?: number;
  iconHeight?: number;
  isIconVisible?: boolean;
  onPress?: () => Promise<void> | void;
  testID?: string;
  style?: ImageStyle;
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  pdf: {
    width: '45%',
  },
  pdfIcon: {
    alignSelf: 'center',
  },
  extralifeTxtContainer: {
    paddingTop: theme.spacing.base,
  },
  extralifeTxt: {
    fontSize: theme.fontSize.regular,
    color: theme.colors.white,
    textAlign: 'center',
  },
  extralifeTxtBold: {
    fontWeight: theme.fontWeight.bold,
  },
});

const Preview = ({
  type,
  source,
  isLoading,
  hasOverlay = true,
  iconWidth,
  iconHeight,
  isIconVisible = true,
  onPress,
  testID = 'preview',
  style,
}: Props) => {
  const Wrapper = hasOverlay ? Overlay : React.Fragment;

  return (
    <ImageBackground source={source} style={[styles.image, style]} testID={`${testID}-container`}>
      <Wrapper>
        {type === RESOURCE_TYPE.VIDEO ? (
          <Touchable onPress={onPress} testID={`${testID}-video`} analyticsID="preview-video">
            {isIconVisible && !isLoading ? (
              <PlayIcon
                color={theme.colors.white}
                height={iconHeight || 70}
                width={iconWidth || 70}
              />
            ) : null}
            {isLoading ? <Loader height={36} /> : null}
          </Touchable>
        ) : null}
        {type === RESOURCE_TYPE.PDF ? (
          <View style={styles.pdf} testID={`${testID}-pdf`}>
            {isIconVisible ? (
              <View testID={`${testID}-pdf-icon`} style={styles.pdfIcon}>
                <PDFIcon
                  color={theme.colors.white}
                  height={iconHeight || 45}
                  width={iconWidth || 45}
                />
              </View>
            ) : null}
            {onPress ? (
              <React.Fragment>
                <Space type="base" />
                <Button
                  isInverted
                  isInlined
                  testID={`${testID}-pdf-button`}
                  onPress={onPress}
                  analyticsID="button-open-pdf"
                >
                  {translations.open}
                </Button>
              </React.Fragment>
            ) : null}
          </View>
        ) : null}
        {type === EXTRALIFE ? (
          <Touchable
            onPress={onPress}
            testID={`${testID}-extralife`}
            analyticsID="preview-extralife"
          >
            <View testID={`${testID}-extralife-icon`}>
              <ExtraLife count={1} />
              <View style={styles.extralifeTxtContainer}>
                <Text style={styles.extralifeTxt}>Bonus!</Text>
                <Text style={[styles.extralifeTxt, styles.extralifeTxtBold]}>
                  {translations.getAnExtralife}
                </Text>
              </View>
            </View>
          </Touchable>
        ) : null}
      </Wrapper>
    </ImageBackground>
  );
};
export default Preview;
