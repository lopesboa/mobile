import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {HEADER_HEIGHT} from '../navigator/navigation-options';
import theme from '../modules/theme';
import Lives from './lives';

interface Props {
  count: number;
  isGodModeUser?: boolean;
  isGodModeEnabled?: boolean;
  isFastSlideEnabled?: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const LIVES_VERTICAL_PADDING = theme.spacing.tiny;

const styles = StyleSheet.create({
  container: {
    paddingVertical: LIVES_VERTICAL_PADDING,
    paddingHorizontal: theme.spacing.small,
    backgroundColor: theme.colors.gray.light,
  },
});

const HeaderSlideRight = ({
  count,
  isGodModeUser,
  isGodModeEnabled,
  isFastSlideEnabled,
  onPress,
  onLongPress,
}: Props) => {
  let testID = 'header-slide-right';

  if (isGodModeEnabled) {
    testID += '-god-mode';
  }
  if (isFastSlideEnabled) {
    testID += '-fast-slide';
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={!isGodModeUser}
        testID={testID}
      >
        <Lives
          count={count}
          height={HEADER_HEIGHT - LIVES_VERTICAL_PADDING * 2}
          isGodModeEnabled={isGodModeEnabled}
          isFastSlideEnabled={isFastSlideEnabled}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderSlideRight;
