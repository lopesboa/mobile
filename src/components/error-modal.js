// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  NovaSolidDesignActionsRedo as RedoIcon,
  NovaLineMobilephoneMobilePhoneClose1 as PhoneCloseIcon,
  NovaSolidSpaceRingPlanet as RingPlanet
} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';
import type {ErrorType} from '../types';
import translations from '../translations';
import {ERROR_TYPE} from '../const';
import Button from './button';
import Space from './space';
import HeaderBackButton from './header-back-button';
import Touchable from './touchable';

import Text from './text';

export type Props = {|
  onClose: () => void,
  type: ErrorType,
  onPress: () => void,
  onAssistancePress: () => void
|};

const HEADER_HEIGHT = 75;
const BADGE_BORDER_WIDTH = 5;
const BADGE_HEIGHT = 93 + BADGE_BORDER_WIDTH * 2;

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.card,
    overflow: 'hidden'
  },
  header: {
    backgroundColor: theme.colors.salmon,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.medium,
    height: HEADER_HEIGHT
  },
  heading: {
    fontWeight: theme.fontWeight.bold
  },
  content: {
    backgroundColor: theme.colors.white,
    paddingTop: BADGE_HEIGHT / 4 + theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
    alignItems: 'center'
  },
  contentFooter: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  button: {
    width: '100%'
  },
  badge: {
    position: 'absolute',
    backgroundColor: theme.colors.pink,
    height: BADGE_HEIGHT,
    width: BADGE_HEIGHT,
    borderRadius: BADGE_HEIGHT,
    alignSelf: 'center',
    top: HEADER_HEIGHT / 4,
    borderColor: theme.colors.white,
    borderWidth: BADGE_BORDER_WIDTH,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconClosePhone: {
    marginLeft: 5
  },
  text: {
    color: theme.colors.gray.dark,
    fontSize: theme.fontSize.large,
    textAlign: 'center'
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold
  },
  smallText: {
    fontSize: theme.fontSize.regular
  },
  underlineText: {
    fontWeight: theme.fontWeight.bold,
    textDecorationLine: 'underline'
  }
});

const ErrorModal = ({onPress, onClose, onAssistancePress, type}: Props) => {
  const headerText =
    type === ERROR_TYPE.NO_CONTENT_FOUND
      ? translations.dataLost
      : translations.platformHasBeenDisabled;

  const icon =
    type === ERROR_TYPE.NO_CONTENT_FOUND ? (
      <RingPlanet color={theme.colors.white} height={60} width={60} />
    ) : (
      <PhoneCloseIcon
        style={styles.iconClosePhone}
        color={theme.colors.white}
        height={60}
        width={60}
      />
    );

  const content =
    type === ERROR_TYPE.NO_CONTENT_FOUND
      ? translations.refreshEnjoyLearning
      : translations.reactivatePlatform;

  const assistanceHelper =
    type === ERROR_TYPE.NO_CONTENT_FOUND ? (
      <View style={styles.contentFooter}>
        <Text style={[styles.text, styles.smallText]}>{translations.refreshNotWorking}</Text>
        <Space type="tiny" />
        <Touchable onPress={onAssistancePress} analyticsID="ask-for-help">
          <Text style={[styles.text, styles.smallText, styles.underlineText]}>
            {translations.askForHelp}
          </Text>
        </Touchable>
      </View>
    ) : null;

  const button =
    type === ERROR_TYPE.NO_CONTENT_FOUND ? (
      <Button onPress={onPress} analyticsID="button-retry-action">
        <RedoIcon color={theme.colors.white} height={25} width={25} />
        <Space />
        <Text style={styles.buttonText}>{translations.refresh}</Text>
      </Button>
    ) : (
      <Button onPress={onPress} analyticsID="button-retry-action">
        <Text style={styles.buttonText}>{translations.iWantIt}</Text>
      </Button>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderBackButton
          color={theme.colors.gray.dark}
          isFloating={false}
          testID="close-modal"
          onPress={onClose}
          type="close"
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.heading, styles.text]}>{headerText}</Text>
        <Space type="base" />
        <Text style={styles.text}>{content}</Text>
        <Space type="base" />
        <View style={styles.button}>{button}</View>
        <Space type="base" />
        {assistanceHelper}
      </View>
      <View style={styles.badge}>{icon}</View>
    </View>
  );
};

export default ErrorModal;
