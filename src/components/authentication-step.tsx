import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import type {Icon as IconType} from '../types/coorpacademy/nova-icons';

import translations from '../translations';
import theme, {BLUE_COORP_LIGHT} from '../modules/theme';
import Html from './html';
import Space from './space';

export interface Props {
  icon: IconType;
  step: number;
  description: string;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.base,
    backgroundColor: theme.colors.white,
  },
  step: {
    color: BLUE_COORP_LIGHT,
    letterSpacing: theme.letterSpacing.header,
  },
  description: {
    textAlign: 'center',
    alignSelf: 'center',
    color: theme.colors.gray.dark,
  },
});

const AuthenticationStep = ({icon: Icon, step, description}: Props) => {
  const title = translations.formatString(
    '{0} <b>{1}</b>',
    translations.step.toUpperCase(),
    step > 9 ? '' + step : '0' + step,
  );

  return (
    <View style={styles.container} testID={`authentication-step-${step}`}>
      <Icon color={BLUE_COORP_LIGHT} width={27} height={27} />
      <Space type="small" />
      <Html fontSize={theme.fontSize.small} style={styles.step} isTextCentered>
        {title}
      </Html>
      <Space type="base" />
      <Html fontSize={theme.fontSize.regular} style={styles.description} isTextCentered>
        {description}
      </Html>
    </View>
  );
};

export default AuthenticationStep;
