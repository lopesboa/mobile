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

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.card,
    overflow: 'hidden'
  },
  header: {
    backgroundColor: theme.colors.salmon,
    alignItems: 'flex-end',
    padding: theme.spacing.base
  },
  heading: {
    fontWeight: theme.fontWeight.bold,
    paddingVertical: theme.spacing.small
  },
  content: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.base,
    alignItems: 'center'
  },
  contentFooter: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonContainer: {
    width: '100%',
    paddingVertical: theme.spacing.base
  },
  badge: {
    position: 'absolute',
    backgroundColor: '#f73f52',
    height: 93,
    width: 93,
    borderRadius: 50,
    top: -50,
    borderColor: theme.colors.white,
    borderWidth: 5,
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

  const assitanceHelper =
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
        <React.Fragment>
          <RedoIcon color={theme.colors.white} height={30} width={30} />
          <Space />
          <Text style={styles.buttonText}>{translations.refresh}</Text>
        </React.Fragment>
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
        <View style={styles.badge}>{icon}</View>
        <Space />
        <Text style={[styles.heading, styles.text]}> {headerText} </Text>
        <Text style={styles.text}>{content}</Text>
        <View style={styles.buttonContainer}>{button}</View>
        {assitanceHelper}
      </View>
    </View>
  );
};

export default ErrorModal;
