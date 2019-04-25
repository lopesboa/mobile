// @flow

import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {HEADER_HEIGHT} from '../navigator/navigation-options';
import theme from '../modules/theme';
import Lives from './lives';

type OnGodModeToggle = () => void;

type Props = {|
  count: number,
  isGodMode: boolean,
  onGodModeToggle: null | OnGodModeToggle
|};

const LIVES_VERTICAL_PADDING = theme.spacing.tiny;

const styles = StyleSheet.create({
  lives: {
    paddingVertical: LIVES_VERTICAL_PADDING,
    paddingHorizontal: theme.spacing.small,
    backgroundColor: theme.colors.gray.light
  }
});

const HeaderSlideRight = ({count, isGodMode, onGodModeToggle}: Props) => {
  const disabled = (typeof onGodModeToggle === 'object' && true) || false;
  return (
    <View style={styles.lives}>
      <TouchableOpacity onPress={onGodModeToggle} disabled={disabled}>
        <Lives
          isGodMode={isGodMode}
          count={count}
          height={HEADER_HEIGHT - LIVES_VERTICAL_PADDING * 2}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderSlideRight;
