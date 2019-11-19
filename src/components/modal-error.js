// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  NovaSolidDesignActionsRedo as RedoIcon,
  NovaLineMobilephoneMobilePhoneClose1 as PhoneCloseIcon,
  NovaSolidSpaceRingPlanet as RingPlanet
} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';
import translations from '../translations';
import type {ErrorType} from '../types';
import {ERROR_TYPE} from '../const';
import Button from './button';
import Space from './space';
import Touchable from './touchable';
import Modal from './modal';
import Text from './text';

export type Props = {|
  type: ErrorType,
  onPress: () => void,
  onAssistancePress: () => void,
  onClose: () => void,
  testID?: string
|};

const styles = StyleSheet.create({
  heading: {
    fontWeight: theme.fontWeight.bold
  },
  contentFooter: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  button: {
    width: '100%'
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

const ICON_SIZE = 50;

class ModalError extends React.PureComponent<Props> {
  props: Props;

  renderIcon = () => {
    const {type} = this.props;

    if (type === ERROR_TYPE.PLATFORM_NOT_ACTIVATED) {
      return (
        <PhoneCloseIcon
          style={styles.iconClosePhone}
          color={theme.colors.white}
          height={ICON_SIZE}
          width={ICON_SIZE}
        />
      );
    }

    return <RingPlanet color={theme.colors.white} height={ICON_SIZE} width={ICON_SIZE} />;
  };

  render() {
    const {type, onAssistancePress, onPress, onClose, testID} = this.props;

    return (
      <Modal
        headerBackgroundColor={theme.colors.salmon}
        iconBackgroundColor={theme.colors.negative}
        renderIcon={this.renderIcon}
        onClose={onClose}
        testID={testID}
      >
        <React.Fragment>
          <Text style={[styles.heading, styles.text]}>
            {type === ERROR_TYPE.NO_CONTENT_FOUND
              ? translations.dataLost
              : translations.platformHasBeenDisabled}
          </Text>
          <Space type="base" />
          <Text style={styles.text}>
            {type === ERROR_TYPE.NO_CONTENT_FOUND
              ? translations.refreshEnjoyLearning
              : translations.reactivatePlatform}
          </Text>
          <Space type="base" />
          <View style={styles.button}>
            <Button
              onPress={onPress}
              analyticsID="button-retry-action"
              testID="button-retry-action"
            >
              {type === ERROR_TYPE.NO_CONTENT_FOUND && (
                <React.Fragment>
                  <RedoIcon color={theme.colors.white} height={25} width={25} />
                  <Space />
                  <Text style={styles.buttonText}>{translations.refresh}</Text>
                </React.Fragment>
              )}
              {type === ERROR_TYPE.PLATFORM_NOT_ACTIVATED && (
                <Text style={styles.buttonText}>{translations.iWantIt}</Text>
              )}
            </Button>
          </View>
          {type === ERROR_TYPE.NO_CONTENT_FOUND && (
            <React.Fragment>
              <Space type="base" />
              <View style={styles.contentFooter}>
                <Text style={[styles.text, styles.smallText]}>
                  {translations.refreshNotWorking}
                </Text>
                <Space type="tiny" />
                <Touchable
                  onPress={onAssistancePress}
                  analyticsID="ask-for-help"
                  testID="ask-for-help"
                >
                  <Text style={[styles.text, styles.smallText, styles.underlineText]}>
                    {translations.askForHelp}
                  </Text>
                </Touchable>
              </View>
            </React.Fragment>
          )}
        </React.Fragment>
      </Modal>
    );
  }
}

export default ModalError;
