// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {BrandThemeContext} from '../components/brand-theme-provider';

type WithSliderProps = {|
  minValue: number,
  maxValue: number,
  value: number,
  onChange: (value: number) => void
|};

const styles: GenericStyleProp = StyleSheet.create({
  container: {
    flex: 1
  }
});

const withSlider = <P>(
  SliderComponent: React$ComponentType<P>
): React$ComponentType<React$ElementConfig<React$ComponentType<WithSliderProps & P>>> => {
  type Props = $Exact<{|
    ...P,
    ...WithSliderProps
  |}>;
  type State = {|
    value: number,
    minValue: number,
    maxValue: number
  |};

  class ComponentWithSlider extends React.Component<Props, State> {
    props: Props;

    state: State = {
      value: this.props.value,
      minValue: this.props.minValue,
      maxValue: this.props.maxValue
    };

    componentWillUnmount() {
      this.updateState(0, 0, 0);
    }

    updateState = (value: number, minValue: number, maxValue: number): void => {
      this.setState(() => ({value, minValue, maxValue}));
    };

    // Because value by RNS is a float number
    handleValueChange = (value: number) => this.setState({value: parseFloat(value)});

    handleSlidingComplete = () => {
      this.props.onChange(this.state.value);
    };

    render() {
      const {value, minValue, maxValue} = this.state;
      return (
        <BrandThemeContext.Consumer>
          {brandTheme => (
            <View style={styles.container}>
              <SliderComponent
                {...this.props}
                minValue={minValue}
                maxValue={maxValue}
                value={value}
                color={brandTheme.colors.primary}
                onChange={this.handleValueChange}
                onSlidingComplete={this.handleSlidingComplete}
              />
            </View>
          )}
        </BrandThemeContext.Consumer>
      );
    }
  }

  return hoistNonReactStatic(ComponentWithSlider, SliderComponent);
};

export default withSlider;
