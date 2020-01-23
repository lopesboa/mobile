// @flow

import * as React from 'react';
import {StyleSheet} from 'react-native';

import version from '../modules/version';
import translations from '../translations';
import theme from '../modules/theme';
import Text from './text';

type Props = {|
  style?: TextStyleProp
|};

const styles = StyleSheet.create({
  version: {
    fontSize: theme.fontSize.extraSmall,
    textAlign: 'center'
  }
});

const Version = ({style}: $ReadOnly<Props>) => (
  <Text style={[styles.version, style]}>
    {translations.formatString('{0}: {1}', 'Version', `${version.tag}.${version.commit}`)}
  </Text>
);

export default Version;
