/* eslint-disable flowtype-errors/show-errors */
// @flow

import React from 'react';
import {StyleSheet, Text, View, Slider} from 'react-native';
import theme from '../modules/theme';
import withSlider from '../containers/with-slider';

type Props = {|
  minValue: number,
  maxValue: number,
  minLabel: string,
  maxLabel: string,
  value: number,
  onChange: (value: number) => void,
  onSlidingComplete: () => void,
  style?: GenericStyleProp,
  step: number,
  color: string,
  testID?: string
|};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  header: {
    fontSize: 25,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center'
  },
  textValue: {
    fontSize: 15,
    color: theme.colors.black,
    fontWeight: theme.fontWeight.semiBold,
    textAlign: 'center'
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  leftValue: {
    flex: 1,
    alignItems: 'flex-start'
  },
  rightValue: {
    flex: 1,
    alignItems: 'flex-end'
  }
});
const QuestionSlider = ({
  minLabel,
  maxLabel,
  step,
  style,
  value,
  minValue,
  maxValue,
  onChange,
  onSlidingComplete,
  color,
  testID
}: Props) => (
  <View style={[styles.container, style]} testID={testID}>
    <Text style={[styles.header, {color}]} testID="slider-value">
      {value}
    </Text>
    <Slider
      step={step || 1}
      value={value}
      onValueChange={onChange}
      maximumValue={maxValue}
      minimumValue={minValue}
      onSlidingComplete={onSlidingComplete}
      minimumTrackTintColor={color}
      testID="slider"
    />
    <View style={styles.valuesContainer} testID="slider-values-container">
      <View style={styles.leftValue}>
        <Text style={styles.textValue} testID="slider-min-value">
          {minLabel}
        </Text>
      </View>
      <View style={styles.rightValue}>
        <Text style={styles.textValue} testID="slider-max-value">
          {maxLabel}
        </Text>
      </View>
    </View>
  </View>
);

export {QuestionSlider as Component};
export default withSlider(QuestionSlider);
