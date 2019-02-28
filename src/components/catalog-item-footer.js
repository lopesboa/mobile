// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  NovaCompositionCoorpacademyAdaptive,
  NovaSolidStatusCheckCircle2
} from '@coorpacademy/nova-icons';
import type {Progression} from '../types';
import theme from '../modules/theme';
import Text from './text';
import ProgressionBar from './progression-bar';

type Props = {|
  title: string,
  subtitle: string,
  progression?: Progression,
  isAdaptive: boolean,
  isCertified?: boolean,
  testID: string,
  titleStyle?: GenericStyleProp,
  subtitleStyle?: GenericStyleProp,
  iconAdaptiveSize?: number,
  iconCertifiedSize?: number
|};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  title: {
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
    paddingTop: theme.spacing.tiny
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  subtitle: {
    color: theme.colors.white,
    fontWeight: theme.fontWeight.regular,
    paddingBottom: theme.spacing.small,
    paddingTop: theme.spacing.tiny
  },
  certified: {
    paddingLeft: theme.spacing.tiny,
    marginTop: -5
  },
  progressionBar: {
    borderRadius: theme.radius.common,
    overflow: 'hidden'
  }
});

const CatalogItemFooter = ({
  title,
  subtitle,
  progression,
  isAdaptive,
  isCertified,
  testID,
  titleStyle = {
    fontSize: 16
  },
  subtitleStyle = {
    fontSize: 14
  },
  iconAdaptiveSize = 16,
  iconCertifiedSize = 14
}: Props) => {
  return (
    <View style={styles.container}>
      {isAdaptive && (
        <NovaCompositionCoorpacademyAdaptive
          testID={`infinite-${testID}`}
          color={theme.colors.white}
          height={iconAdaptiveSize}
          width={iconAdaptiveSize}
        />
      )}
      <Text testID={`title-${testID}`} style={[styles.title, titleStyle]}>
        {title}
      </Text>
      <View style={styles.subtitleContainer}>
        <Text testID={`subtitle-${testID}`} style={[styles.subtitle, subtitleStyle]}>
          {subtitle}
        </Text>
        {isCertified && (
          <View style={styles.certified}>
            <NovaSolidStatusCheckCircle2
              testID={`certified-${testID}`}
              color={theme.colors.white}
              height={iconCertifiedSize}
              width={iconCertifiedSize}
            />
          </View>
        )}
      </View>
      {progression && (
        <View style={styles.progressionBar} testID={`progressBar-${testID}`}>
          <ProgressionBar
            current={progression.current}
            count={progression.count}
            height={2}
            bgBarColor={theme.colors.white}
            isInnerRounded
          />
        </View>
      )}
    </View>
  );
};

export default CatalogItemFooter;
