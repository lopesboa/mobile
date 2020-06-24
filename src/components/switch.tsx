import * as React from 'react';
import {View, TouchableWithoutFeedback, Animated, Easing, StyleSheet} from 'react-native';
import theme from '../modules/theme';

const styles = StyleSheet.create({
  track: {
    width: 51,
    height: 32,
    borderRadius: 20,
    backgroundColor: 'green',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  alignLeft: {
    alignItems: 'flex-start'
  },
  alignRight: {
    alignItems: 'flex-end'
  },
  thumb: {
    marginHorizontal: 2,
    width: 28,
    height: 28,
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.28,
    shadowRadius: 2.22,
    elevation: 3
  }
});

function Switch({onPress, isActive}) {
  const animationValue = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const thumbPosition = isActive ? styles.alignRight : styles.alignLeft;
  const trackBgColor = isActive ? theme.colors.positive : theme.colors.white;

  React.useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isActive ? 1 : 0,
      easing: Easing.elastic(3),
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [animationValue, isActive]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.track, thumbPosition, {backgroundColor: trackBgColor}]}>
        <TouchableWithoutFeedback onPress={onPress}>
          <Animated.View style={[styles.thumb, {transform: [{translateX: animationValue}]}]} />
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Switch;
