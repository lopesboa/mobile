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
    padding: theme.spacing.base
  }
});

const Preview = ({type, source, onPress}: Props) => (
  <ImageBackground source={source} style={styles.image}>
    <ResourceOverlay>
      {type === RESSOURCE_TYPE.VIDEO && (
        <TouchableOpacity onPress={onPress}>
          <PlayIcon color={theme.colors.white} height={70} width={70} />
        </TouchableOpacity>
      )}
      {type === RESSOURCE_TYPE.PDF && (
        <View style={styles.pdf}>
          <PDFIcon color={theme.colors.white} height={70} width={70} />
          <Space type="base" />
          <Button isInverted onPress={onPress}>
            {translations.open}
          </Button>
        </View>
      )}
    </ResourceOverlay>
  </ImageBackground>
);

export default Preview;
