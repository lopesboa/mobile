// @flow

import * as React from 'react';
import {ImageBackground, StyleSheet, View, TouchableOpacity} from 'react-native';
import {
  NovaSolidAudioAudioControlPlay as PlayIcon,
  NovaLineFilesOfficeFileOfficePdf as PDFIcon
} from '@coorpacademy/nova-icons';

import type {ResourceType} from '../types';
import {RESSOURCE_TYPE} from '../const';
import theme from '../modules/theme';
import translations from '../translations';
import Button from './button';
import Space from './space';
import ResourceOverlay from './resource-overlay';

type Props = {|
  type: ResourceType,
  source: File | {uri: string},
  onPress: () => void
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

const Preview = ({type, source, onPress}: Props) => (
  <ImageBackground source={source} style={styles.image}>
    <ResourceOverlay>
      {type === RESSOURCE_TYPE.VIDEO && (
        <TouchableOpacity onPress={onPress} testID="preview-video">
          <PlayIcon color={theme.colors.white} height={70} width={70} />
        </TouchableOpacity>
      )}
      {type === RESSOURCE_TYPE.PDF && (
        <View style={styles.pdf} testID="preview-pdf">
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

export default Preview;
