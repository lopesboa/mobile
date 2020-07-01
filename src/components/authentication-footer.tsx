import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {NovaLineInterfaceFeedbackInterfaceQuestionMark as QuestionMarkIcon} from '@coorpacademy/nova-icons';

import theme, {getHitSlop} from '../modules/theme';
import translations from '../translations';
import Space from './space';
import Html from './html';
import Text from './text';
import Touchable from './touchable';

export interface Props {
  onDemoPress: () => void;
  onHelpPress: () => void;
  testID?: string;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  help: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  helpText: {
    textDecorationLine: 'underline',
    fontSize: theme.fontSize.medium,
    color: theme.colors.white,
  },
  demo: {
    textAlign: 'center',
    fontSize: theme.fontSize.large,
    color: theme.colors.white,
  },
});

const AuthenticationFooter = ({
  onDemoPress,
  onHelpPress,
  testID: prefixTestID = 'authentication-footer',
}: Props) => (
  <View style={styles.container}>
    <Html
      fontSize={theme.fontSize.large}
      style={styles.demo}
      onLinkPress={onDemoPress}
      anchorTextColor={theme.colors.white}
      isTextCentered
      testID={`${prefixTestID}-start-demo`}
    >
      {translations.startDemo}
    </Html>
    <Space type="medium" />
    <Touchable
      hitSlop={getHitSlop('micro')}
      onPress={onHelpPress}
      style={styles.help}
      testID={`${prefixTestID}-need-help`}
      analyticsID="need-help"
    >
      <QuestionMarkIcon
        color={theme.colors.white}
        width={theme.fontSize.regular}
        height={theme.fontSize.regular}
      />
      <Space type="micro" />
      <Text style={styles.helpText}>{translations.needHelp}</Text>
    </Touchable>
  </View>
);

export default AuthenticationFooter;
