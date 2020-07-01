import * as React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-navigation';

import background from '../assets/images/authentication.png';
import logo from '../assets/images/logo.png';
import theme, {BLUE_COORP_DARK, BLUE_COORP_LIGHT} from '../modules/theme';
import translations from '../translations';
import AuthenticationFooter from './authentication-footer';
import type {Props as AuthenticationFooterProps} from './authentication-footer';
import ImageBackground from './image-background';
import Text from './text';
import Space from './space';
import Button from './button';

interface Props {
  onHelpPress: Pick<AuthenticationFooterProps, 'onHelpPress'>;
  onDemoPress: Pick<AuthenticationFooterProps, 'onDemoPress'>;
  onDesktopButtonPress: () => void;
  onMobileButtonPress: () => void;
  testID?: string;
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
  },
  gradient: {
    opacity: 0.8,
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
    paddingTop: theme.spacing.base,
    paddingHorizontal: theme.spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 192,
    height: 35,
  },
  footer: {
    paddingHorizontal: theme.spacing.base,
  },
  contentHeader: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.xxxlarge,
    color: theme.colors.white,
    textAlign: 'center',
  },
  contentDescription: {
    fontSize: theme.fontSize.large,
    color: theme.colors.white,
    textAlign: 'center',
  },
  contentFooter: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.large,
    color: theme.colors.white,
    textAlign: 'center',
  },
});

export const TOP_COLOR = BLUE_COORP_DARK;
export const BOTTOM_COLOR = BLUE_COORP_LIGHT;

const Authentication = ({
  onHelpPress,
  onDemoPress,
  onDesktopButtonPress,
  onMobileButtonPress,
  testID,
}: Props) => (
  <React.Fragment>
    <ImageBackground
      source={background}
      gradient={[TOP_COLOR, BOTTOM_COLOR]}
      gradientStyle={styles.gradient}
      resizeMode="cover"
      style={styles.background}
    />
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.container, styles.scroll]} testID={testID}>
        <View style={styles.header} testID="authentication-header">
          <ImageBackground source={logo} style={styles.image} testID="authentication-logo" />
        </View>
        <Space type="large" />
        <View style={styles.footer}>
          <Text style={styles.contentHeader} testID="authentication-content-header">
            {translations.welcome}
          </Text>
          <Space type="tiny" />
          <Text style={styles.contentDescription} testID="authentication-content-description">
            {translations.welcomeDescription}
          </Text>
          <Space type="base" />
          <Text style={styles.contentFooter} testID="authentication-content-footer">
            {translations.howToSignIn}
          </Text>
          <Space type="base" />
          <Button
            isInverted
            isTextSecondary
            onPress={onMobileButtonPress}
            testID="button-sign-in-mobile"
            analyticsID="button-sign-in-mobile"
          >
            {translations.signInMobile}
          </Button>
          <Space type="tiny" />
          <Button
            isInlined
            onPress={onDesktopButtonPress}
            testID="button-sign-in-desktop"
            analyticsID="button-sign-in-desktop"
          >
            {translations.signInDesktop}
          </Button>
          <Space type="small" />
          <AuthenticationFooter onHelpPress={onHelpPress} onDemoPress={onDemoPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  </React.Fragment>
);
export default Authentication;
