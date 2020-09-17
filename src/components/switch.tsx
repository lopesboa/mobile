import * as React from 'react';
import {View, TouchableWithoutFeedback, Animated, Easing, StyleSheet} from 'react-native';
import {NotificationSettingStatus} from '../types';
import theme from '../modules/theme';

const styles = StyleSheet.create({
  track: {
    width: 51,
    height: 32,
    borderRadius: 20,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  thumb: {
    marginHorizontal: 1,
    width: 28,
    height: 28,
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.28,
    shadowRadius: 2.22,
    elevation: 5,
  },
});

interface Props {
  onPress: () => Promise<void>;
  isActive: boolean;
  testID: string;
}

function Switch({onPress, isActive, testID}: Props) {
  const animationValue = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const thumbPosition = isActive ? styles.alignRight : styles.alignLeft;
  const trackBgColor = isActive ? theme.colors.positive : theme.colors.white;

  React.useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isActive ? 1 : 0,
      easing: Easing.elastic(3),
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [animationValue, isActive]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.track, thumbPosition, {backgroundColor: trackBgColor}]}>
        <TouchableWithoutFeedback
          onPress={onPress}
          testID={testID + `${isActive ? '-on' : '-off'}`}
        >
          <Animated.View style={[styles.thumb, {transform: [{translateX: animationValue}]}]} />
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Switch;
