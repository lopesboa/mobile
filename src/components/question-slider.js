/* eslint-disable flowtype-errors/show-errors */
// @flow

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Slider from '@coorpacademy/react-native-slider';

import theme from '../modules/theme';
import {BrandThemeContext} from './brand-theme-provider';
import {STYLE as BOX_STYLE} from './box';

export type Edge = {|
  value: number,
  label: string
|};

export type Props = {|
  min: Edge,
  max: Edge,
  value: number,
  onChange: (value: number) => void,
  onSlidingComplete: () => void,
  style?: GenericStyleProp,
  step?: number,
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
    fontWeight: theme.fontWeight.bold,
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
  },
  track: {
    height: 10,
    borderRadius: theme.radius.button
  },
  thumb: {
    ...BOX_STYLE,
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    borderWidth: 1
  }
});

const QuestionSlider = ({
  step,
  style,
  min,
  max,
  value,
  onSlidingComplete,
  testID,
  onChange
}: Props) => (
  <View style={[styles.container, style]} testID={testID}>
    <BrandThemeContext.Consumer>
      {brandTheme => (
        <React.Fragment>
          <Text style={[styles.header, {color: brandTheme.colors.primary}]} testID="slider-value">
            {value}
          </Text>
          <Slider
            step={step || 1}
            value={value}
            onValueChange={onChange}
            maximumValue={max.value}
            minimumValue={min.value}
            onSlidingComplete={onSlidingComplete}
            minimumTrackTintColor={brandTheme.colors.primary}
            trackStyle={styles.track}
            thumbStyle={[styles.thumb, {borderColor: brandTheme.colors.primary}]}
            testID="slider"
          />
        </React.Fragment>
      )}
    </BrandThemeContext.Consumer>
    <View style={styles.valuesContainer} testID="slider-values-container">
      <View style={styles.leftValue}>
        <Text style={styles.textValue} testID="slider-min-value">
          {min.label}
        </Text>
      </View>
      <View style={styles.rightValue}>
        <Text style={styles.textValue} testID="slider-max-value">
          {max.label}
        </Text>
      </View>
    </View>
  </View>
);

export default QuestionSlider;
