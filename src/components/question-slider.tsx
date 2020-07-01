/* eslint-disable flowtype-errors/show-errors */

import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Slider from '@coorpacademy/react-native-slider';

import theme from '../modules/theme';
import {BrandThemeContext} from './brand-theme-provider';
import {STYLE as BOX_STYLE} from './box';
import Text from './text';

export interface Props {
  min: number;
  max: number;
  unit?: string;
  value: number;
  onChange: (value: number) => void;
  onSlidingComplete: () => void;
  style?: ViewStyle;
  step?: number;
  testID?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header: {
    fontSize: 25,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
  },
  textValue: {
    fontSize: 15,
    color: theme.colors.black,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  leftValue: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  track: {
    height: 10,
    borderRadius: theme.radius.button,
  },
  thumb: {
    ...BOX_STYLE,
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    borderWidth: 1,
  },
});

const QuestionSlider = ({
  step,
  style,
  min,
  max,
  unit = '',
  value,
  onSlidingComplete,
  testID,
  onChange,
}: Props) => {
  const brandTheme = React.useContext(BrandThemeContext);
  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={[styles.header, {color: brandTheme.colors.primary}]} testID="slider-value">
        {value}
      </Text>
      <Slider
        step={step || 1}
        value={value}
        onValueChange={onChange}
        maximumValue={max}
        minimumValue={min}
        onSlidingComplete={onSlidingComplete}
        minimumTrackTintColor={brandTheme.colors.primary}
        trackStyle={styles.track}
        thumbStyle={[styles.thumb, {borderColor: brandTheme.colors.primary}]}
        testID="slider"
      />
      <View style={styles.valuesContainer} testID="slider-values-container">
        <View style={styles.leftValue}>
          <Text style={styles.textValue} testID="slider-min-value">
            {`${min} ${unit}`}
          </Text>
        </View>
        <View style={styles.rightValue}>
          <Text style={styles.textValue} testID="slider-max-value">
            {`${max} ${unit}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default QuestionSlider;
