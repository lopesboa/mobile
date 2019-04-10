// @flow strict

import * as React from 'react';

import QuestionSliderComponent from '../components/question-slider';
import type {
  Props as QuestionSliderProps,
  Edge as QuestionSliderEdge
} from '../components/question-slider';
import {QUESTION_TYPE, ANALYTICS_EVENT_TYPE} from '../const';
import withAnalytics from './with-analytics';
import type {WithAnalyticsProps} from './with-analytics';

type Edge = {|
  value?: $PropertyType<QuestionSliderEdge, 'value'>,
  label?: $PropertyType<QuestionSliderEdge, 'label'>
|};

export type Props = $Exact<{|
  ...WithAnalyticsProps,
  ...$Rest<
    QuestionSliderProps,
    {|
      onSlidingComplete: () => void,
      min: QuestionSliderEdge,
      max: QuestionSliderEdge,
      value: number
    |}
  >,
  min: Edge,
  max: Edge,
  value?: number
|}>;

type State = {|
  min: number,
  max: number,
  value: number
|};

const defaultState: State = {
  value: 0,
  min: 0,
  max: 0
};

class QuestionSlider extends React.PureComponent<Props, State> {
  props: Props;

  state: State = defaultState;

  componentDidMount() {
    const {min, max, value} = this.props;
    this.resetState(value, min.value, max.value);
  }

  componentDidUpdate(prevProps: Props) {
    const {min, max, value} = this.props;

    if (
      prevProps.min.value !== min.value ||
      prevProps.max.value !== max.value ||
      prevProps.value !== value
    ) {
      this.resetState(value, min.value, max.value);
    }
  }

  resetState = (value?: number, min?: number, max?: number): void =>
    this.setState(() => ({
      value: value || defaultState.value,
      min: min || defaultState.min,
      max: max || defaultState.max
    }));

  handleChange = (value: number) =>
    this.setState({
      // Because value by RNS is a float number
      value: parseInt(value)
    });

  handleSlidingComplete = () => {
    const {onChange, analytics} = this.props;

    analytics &&
      analytics.logEvent(ANALYTICS_EVENT_TYPE.SLIDE, {
        id: 'slider',
        questionType: QUESTION_TYPE.SLIDER
      });

    onChange(this.state.value);
  };

  render() {
    const {
      /* to avoid giving wrong props to child */
      /* eslint-disable no-unused-vars */
      analytics,
      min,
      max,
      value,
      onChange,
      /* eslint-enable no-unused-vars */
      ...props
    } = this.props;
    return (
      <QuestionSliderComponent
        {...props}
        min={{
          value: this.state.min,
          label: this.props.min.label || ''
        }}
        max={{
          value: this.state.max,
          label: this.props.max.label || ''
        }}
        value={this.state.value}
        onChange={this.handleChange}
        onSlidingComplete={this.handleSlidingComplete}
      />
    );
  }
}

export {QuestionSlider as Component};
export default withAnalytics(QuestionSlider);
