// @flow strict

import * as React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {
  NovaSolidAudioAudioControlPlay as PlayIcon,
  NovaLineFilesOfficeFileOfficePdf as PDFIcon
} from '@coorpacademy/nova-icons';

import type {LessonType} from '@coorpacademy/progression-engine';
import {RESOURCE_TYPE} from '../const';
import theme from '../modules/theme';
import translations from '../translations';
import Button from './button';
import Space from './space';
import ResourceOverlay from './resource-overlay';
import ExtraLife from './extralife';
import Text from './text';
import Touchable from './touchable';

export const EXTRALIFE: string = 'extralife';

type Props = {|
  type: LessonType | typeof EXTRALIFE,
  source: File | {uri: string},
  onPress: () => void,
  testID?: string
|};

const styles = StyleSheet.create({
  image: {
    flex: 1
  },
  pdf: {
    width: '45%'
  },
  pdfIcon: {
    alignSelf: 'center'
  },
  extralifeTxtContainer: {
    paddingTop: theme.spacing.base
  },
  extralifeTxt: {
    fontSize: theme.fontSize.regular,
    color: theme.colors.white,
    textAlign: 'center'
  },
  extralifeTxtBold: {
    fontWeight: theme.fontWeight.bold
  }
});

const Preview = ({type, source, onPress, testID}: Props) => {
  const testIDSuffix = testID ? '-' + testID : '';
  return (
    <ImageBackground source={source} style={styles.image}>
      <ResourceOverlay>
        {type === RESOURCE_TYPE.VIDEO && (
          <Touchable
            onPress={onPress}
            testID={'preview-video' + testIDSuffix}
            analyticsID="preview-video"
          >
            <PlayIcon color={theme.colors.white} height={70} width={70} />
          </Touchable>
        )}
        {type === RESOURCE_TYPE.PDF && (
          <View style={styles.pdf} testID={'preview-pdf' + testIDSuffix}>
            <View testID="preview-pdf-icon" style={styles.pdfIcon}>
              <PDFIcon color={theme.colors.white} height={45} width={45} />
            </View>
            <Space type="base" />
            <Button
              isInverted
              isInlined
              testID="button-open-pdf"
              onPress={onPress}
              analyticsID="button-open-pdf"
            >
              {translations.open}
            </Button>
          </View>
        )}
        {type === EXTRALIFE && (
          <Touchable
            onPress={onPress}
            testID={'preview-extralife' + testIDSuffix}
            analyticsID="preview-extralife"
          >
            <View testID={'extra-life' + testIDSuffix}>
              <ExtraLife count={1} />
              <View style={styles.extralifeTxtContainer}>
                <Text style={styles.extralifeTxt}>Bonus!</Text>
                <Text style={[styles.extralifeTxt, styles.extralifeTxtBold]}>
                  {translations.getAnExtralife}
                </Text>
              </View>
            </View>
          </Touchable>
        )}
      </ResourceOverlay>
    </ImageBackground>
  );
};
export default Preview;
