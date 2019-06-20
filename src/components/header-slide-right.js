// @flow

import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {HEADER_HEIGHT} from '../navigator/navigation-options';
import theme from '../modules/theme';
import Lives from './lives';

type OnToggleFn = () => void;

type Props = {|
  count: number,
  isGodModeActivated: boolean,
  isFastSlideActivated: boolean,
  onGodModeToggle: null | OnToggleFn,
  onFastSlideToggle: null | OnToggleFn,
  isLoading?: boolean
|};

const LIVES_VERTICAL_PADDING = theme.spacing.tiny;

const styles = StyleSheet.create({
  container: {
    paddingVertical: LIVES_VERTICAL_PADDING,
    paddingHorizontal: theme.spacing.small,
    backgroundColor: theme.colors.gray.light
  },
  containerPlaceholder: {
    backgroundColor: 'transparent'
  }
});

const HeaderSlideRight = ({
  count,
  isGodModeActivated,
  isFastSlideActivated,
  onGodModeToggle,
  onFastSlideToggle,
  isLoading
}: Props) => {
  const disabled = (typeof onGodModeToggle === 'object' && true) || false;

  return (
    <View style={[styles.container, isLoading && styles.containerPlaceholder]}>
      <TouchableOpacity
        onPress={onGodModeToggle}
        onLongPress={onFastSlideToggle}
        disabled={disabled}
      >
        <Lives
          isGodModeActivated={isGodModeActivated}
          isFastSlideActivated={isFastSlideActivated}
          count={count}
          height={HEADER_HEIGHT - LIVES_VERTICAL_PADDING * 2}
          isLoading={isLoading}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderSlideRight;
