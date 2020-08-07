import * as React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NovaCompositionCoorpacademyTarget as TargetIcon} from '@coorpacademy/nova-icons';

import {AUTHENTICATION_TYPE} from '../const';
import type {AuthenticationType} from '../types';
import theme, {BLUE_COORP_DARK, BLUE_COORP_LIGHT} from '../modules/theme';
import translations from '../translations';
import AuthenticationSteps from '../containers/authentication-steps';
import AuthenticationFooter from './authentication-footer';
import type {Props as AuthenticationFooterProps} from './authentication-footer';
import Button from './button';
import Space from './space';
import Html from './html';
import Gradient from './gradient';
import HeaderBackButton from './header-back-button';

export interface Props {
  type: AuthenticationType;
  onHelpPress: Pick<AuthenticationFooterProps, 'onHelpPress'>;
  onDemoPress: Pick<AuthenticationFooterProps, 'onDemoPress'>;
  onButtonPress: () => void;
  onBack: () => void;
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  container: {
    flexGrow: 1,
  },
  scroll: {
    paddingTop: theme.spacing.base,
    paddingBottom: theme.spacing.base,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: theme.spacing.base,
  },
  content: {
    flexGrow: 1,
  },
  footer: {
    paddingHorizontal: theme.spacing.base,
  },
  title: {
    color: theme.colors.white,
    textAlign: 'center',
    fontWeight: theme.fontWeight.bold,
    letterSpacing: theme.letterSpacing.header,
  },
  description: {
    color: theme.colors.white,
    textAlign: 'center',
  },
  steps: {
    flexGrow: 1,
  },
  button: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.large,
    color: BLUE_COORP_LIGHT,
    textAlign: 'center',
  },
});

export const TOP_COLOR = BLUE_COORP_DARK;
export const BOTTOM_COLOR = BLUE_COORP_LIGHT;

const AuthenticationDetails = ({type, onButtonPress, onHelpPress, onDemoPress, onBack}: Props) => (
  <React.Fragment>
    <Gradient colors={[TOP_COLOR, BOTTOM_COLOR]} style={styles.gradient} />
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.container, styles.scroll]}
        testID={`authentication-details-${type}`}
      >
        <View style={styles.header}>
          <Html
            fontSize={theme.fontSize.regular}
            style={styles.title}
            isTextCentered
            testID={`authentication-details-${type}-title`}
          >
            {(
              (type === AUTHENTICATION_TYPE.QR_CODE && translations.authenticationQRCodeTitle) ||
              translations.authenticationMagicLinkTitle
            ).toUpperCase()}
          </Html>
          <Space type="base" />
          <Html
            fontSize={theme.fontSize.large}
            style={styles.description}
            isTextCentered
            testID={`authentication-details-${type}-header`}
          >
            {(type === AUTHENTICATION_TYPE.QR_CODE && translations.authenticationQRCodeHeader) ||
              translations.authenticationMagicLinkHeader}
          </Html>
        </View>
        <Space type="small" />
        <View style={styles.content}>
          <AuthenticationSteps type={type} style={styles.steps} />
        </View>
        <Space type="base" />
        <View style={styles.footer}>
          <Button
            isInverted
            isTextSecondary
            onPress={onButtonPress}
            testID={`authentication-details-${type}-button`}
            analyticsID={`authentication-details-${type}-button`}
          >
            <React.Fragment>
              {type === AUTHENTICATION_TYPE.QR_CODE ? (
                <React.Fragment>
                  <TargetIcon color={BLUE_COORP_LIGHT} height={30} width={30} />
                  <Space />
                </React.Fragment>
              ) : null}
              <Html fontSize={theme.fontSize.large} style={styles.button}>
                {(type === AUTHENTICATION_TYPE.QR_CODE && translations.scanQRCode) ||
                  translations.openBrowser}
              </Html>
            </React.Fragment>
          </Button>
          <Space type="small" />
          <AuthenticationFooter
            onHelpPress={onHelpPress}
            onDemoPress={onDemoPress}
            testID={`authentication-details-${type}-footer`}
          />
        </View>
        <HeaderBackButton
          type="back"
          onPress={onBack}
          noSafeArea
          testID={`authentication-details-${type}-button-close`}
        />
      </ScrollView>
    </SafeAreaView>
  </React.Fragment>
);

export default AuthenticationDetails;
