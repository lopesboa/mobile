// @flow

import * as React from 'react';

import {View, StyleSheet} from 'react-native';
import theme, {BLUE_COORP_LIGHT} from '../modules/theme';
import {STYLE as BOX_STYLE} from './box';
import Html from './html';
import Space from './space';
import StepsIcon from './steps-icon';
import type {IconName} from './steps-icon';

export type Props = {|
  item: {|
    iconName: IconName,
    header: string,
    description: string
  |},
  itemIndex: number,
  currentIndex: number,
  width: number
|};

const styles: GenericStyleProp = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible'
  },
  cards: {
    ...BOX_STYLE,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    padding: theme.spacing.small,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.white
  },
  text: {
    fontSize: theme.fontSize.large
  },
  description: {
    textAlign: 'center',
    alignSelf: 'center',
    color: theme.colors.gray.dark
  }
});

const CarouselCard = ({item, itemIndex, currentIndex, width}: Props) => {
  const opacity = itemIndex === currentIndex ? 1 : 0.65;
  return (
    <View style={[styles.container, {width}]}>
      <View style={[styles.cards, {opacity, width: width - theme.spacing.base, height: width}]}>
        <StepsIcon
          iconName={item.iconName}
          color={BLUE_COORP_LIGHT}
          height={theme.spacing.base}
          width={theme.spacing.base}
        />
        <Space type="small" />
        <Html fontSize={theme.fontSize.large} style={{color: BLUE_COORP_LIGHT}} isTextCentered>
          {item.header.toUpperCase()}
        </Html>
        <Space type="base" />
        <Html fontSize={theme.fontSize.regular} style={styles.description} isTextCentered>
          {item.description}
        </Html>
      </View>
    </View>
  );
};

export default CarouselCard;
