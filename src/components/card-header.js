// @flow strict

import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  NovaCompositionCoorpacademyLightbulb as TipIcon,
  NovaSolidLoginKey1 as KeyPointIcon,
  NovaLineStatusCheckCircle1 as CorrectionIcon,
  NovaCompositionCoorpacademyFilterVideo2 as ResourceIcon,
  NovaLineStatusCloseCircle as CloseIcon
} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';
import type {CardType} from '../types';
import {CARD_TYPE} from '../const';

export type Props = {|
  type: CardType,
  isCorrect?: boolean,
  title: string
|};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.spacing.base,
    borderTopLeftRadius: theme.radius.card,
    borderTopRightRadius: theme.radius.card
  },
  headerText: {
    paddingLeft: theme.spacing.tiny,
    color: theme.colors.gray.dark,
    fontSize: theme.fontSize.large,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  headerTip: {
    backgroundColor: '#fff8c5'
  },
  headerTipIcon: {
    width: 21,
    height: 21
  },
  headerKeyPoint: {
    backgroundColor: '#ffded4'
  },
  headerKeyPointIcon: {
    width: 23,
    height: 23
  },
  headerResource: {
    backgroundColor: '#cdeffe'
  },
  headerCorrectionIcon: {
    height: 23,
    width: 23
  },
  headerCorrectionBGColorIsCorrect: {
    backgroundColor: '#d3f1e2'
  },
  headerCorrectionBGColorIsNotCorrect: {
    backgroundColor: '#FDD9DC'
  }
});

const CardHeader = ({type, isCorrect, title}: Props) => {
  const correctionBackgroundColor =
    (isCorrect && styles.headerCorrectionBGColorIsCorrect) ||
    styles.headerCorrectionBGColorIsNotCorrect;
  return (
    <View
      style={[
        styles.header,
        type === CARD_TYPE.TIP && styles.headerTip,
        type === CARD_TYPE.KEY_POINT && styles.headerKeyPoint,
        type === CARD_TYPE.CORRECTION && correctionBackgroundColor,
        type === CARD_TYPE.RESOURCE && styles.headerResource
      ]}
    >
      {type === CARD_TYPE.TIP && <TipIcon color="#ffc035" style={styles.headerTipIcon} />}
      {type === CARD_TYPE.KEY_POINT && (
        <KeyPointIcon color="#ff7043" style={styles.headerKeyPointIcon} />
      )}

      {type === CARD_TYPE.CORRECTION && isCorrect && (
        <CorrectionIcon color="#3ec483" style={styles.headerCorrectionIcon} />
      )}
      {type === CARD_TYPE.CORRECTION && !isCorrect && (
        <CloseIcon color={theme.colors.negative} style={styles.headerCorrectionIcon} />
      )}
      {type === CARD_TYPE.RESOURCE && (
        <ResourceIcon color="#16affc" style={styles.headerCorrectionIcon} />
      )}
      <Text style={styles.headerText} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

export default CardHeader;
