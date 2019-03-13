// @flow

import * as React from 'react';
import {ImageBackground, StyleSheet, View, TouchableOpacity} from 'react-native';
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

type Props = {|
  type: LessonType,
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
  }
});

const Preview = ({type, source, onPress, testID}: Props) => {
  const testIDSuffix = testID ? '-' + testID : '';
  return (
    <ImageBackground source={source} style={styles.image}>
      <ResourceOverlay>
        {type === RESOURCE_TYPE.VIDEO && (
          <TouchableOpacity onPress={onPress} testID={'preview-video' + testIDSuffix}>
            <PlayIcon color={theme.colors.white} height={70} width={70} />
          </TouchableOpacity>
        )}
        {type === RESOURCE_TYPE.PDF && (
          <View style={styles.pdf} testID={'preview-pdf' + testIDSuffix}>
            <View testID="preview-pdf-icon" style={styles.pdfIcon}>
              <PDFIcon color={theme.colors.white} height={45} width={45} />
            </View>
            <Space type="base" />
            <Button isInverted isInlined testID="button-open-pdf" onPress={onPress}>
              {translations.open}
            </Button>
          </View>
        )}
      </ResourceOverlay>
    </ImageBackground>
  );
};
export default Preview;
