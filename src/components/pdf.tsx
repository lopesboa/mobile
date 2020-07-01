import * as React from 'react';
import {StyleSheet} from 'react-native';
import PdfBase from 'react-native-pdf';

import theme from '../modules/theme';
import Loader from './loader';

interface Props {
  source: {uri: string};
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray.light,
  },
});

const Pdf = ({source}: Props) => (
  <PdfBase
    // @ts-ignore - unknown 'body' property
    source={source}
    fitWidth
    style={styles.container}
    activityIndicator={<Loader />}
  />
);

export default Pdf;
