// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  NovaCompositionCoorpacademyLightbulb as TipIcon,
  NovaSolidLoginKey1 as KeyPointIcon,
  NovaLineStatusCheckCircle1 as CorrectionIcon,
  NovaCompositionCoorpacademyFilterVideo2 as ResourceIcon,
  NovaLineStatusCloseCircle as CloseIcon
} from '@coorpacademy/nova-icons';

import theme from '../modules/theme';
import type {DeckCardType} from '../types';
import {DECK_CARD_TYPE} from '../const';
import Text from './text';

export type Props = {|
  type: DeckCardType,
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
    fontWeight: theme.fontWeight.bold,
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

const DeckCardHeader = ({type, isCorrect, title}: Props) => {
  const correctionBackgroundColor =
    (isCorrect && styles.headerCorrectionBGColorIsCorrect) ||
    styles.headerCorrectionBGColorIsNotCorrect;
  return (
    <View
      style={[
        styles.header,
        type === DECK_CARD_TYPE.TIP && styles.headerTip,
        type === DECK_CARD_TYPE.KEY_POINT && styles.headerKeyPoint,
        type === DECK_CARD_TYPE.CORRECTION && correctionBackgroundColor,
        type === DECK_CARD_TYPE.RESOURCE && styles.headerResource
      ]}
    >
      {type === DECK_CARD_TYPE.TIP ? (
        <TipIcon color="#ffc035" style={styles.headerTipIcon} />
      ) : null}
      {type === DECK_CARD_TYPE.KEY_POINT ? (
        <KeyPointIcon color="#ff7043" style={styles.headerKeyPointIcon} />
      ) : null}

      {type === DECK_CARD_TYPE.CORRECTION && isCorrect ? (
        <CorrectionIcon color="#3ec483" style={styles.headerCorrectionIcon} />
      ) : null}
      {type === DECK_CARD_TYPE.CORRECTION && !isCorrect ? (
        <CloseIcon color={theme.colors.negative} style={styles.headerCorrectionIcon} />
      ) : null}
      {type === DECK_CARD_TYPE.RESOURCE ? (
        <ResourceIcon color="#16affc" style={styles.headerCorrectionIcon} />
      ) : null}
      <Text style={styles.headerText} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

export default DeckCardHeader;
