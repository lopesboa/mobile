import * as React from 'react';

import {ViewStyle} from 'react-native';
import QuestionSliderComponent from '../components/question-slider';
import type {Props as QuestionSliderProps} from '../components/question-slider';
import {QUESTION_TYPE, ANALYTICS_EVENT_TYPE} from '../const';
import withAnalytics from './with-analytics';
import type {WithAnalyticsProps} from './with-analytics';

export interface Props extends WithAnalyticsProps {
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

type State = {
  value: number;
};

class QuestionSlider extends React.PureComponent<Props, State> {
  state: State = {
    value: 0,
  };

  componentDidMount() {
    const {value} = this.props;
    this.resetState(value);
  }

  componentDidUpdate(prevProps: Props) {
    const {min, max, value} = this.props;

    if (prevProps.min !== min || prevProps.max !== max || prevProps.value !== value) {
      this.resetState(value);
    }
  }

  resetState = (value? = 0): void =>
    this.setState({
      value,
    });

  handleChange = (value: number) =>
    this.setState({
      // Because value by RNS is a float number
      // @ts-ignore
      value: parseInt(value),
    });

  handleSlidingComplete = () => {
    const {onChange, analytics} = this.props;

    analytics &&
      analytics.logEvent(ANALYTICS_EVENT_TYPE.SLIDE, {
        id: 'slider',
        questionType: QUESTION_TYPE.SLIDER,
      });

    onChange(this.state.value);
  };

  render() {
    const {
      /* to avoid giving wrong props to child */
      /* eslint-disable no-unused-vars */
      analytics,
      value,
      onChange,
      /* eslint-enable no-unused-vars */
      ...props
    } = this.props;

    return (
      <QuestionSliderComponent
        {...props}
        value={this.state.value}
        onChange={this.handleChange}
        onSlidingComplete={this.handleSlidingComplete}
      />
    );
  }
}

export {QuestionSlider as Component};
export default withAnalytics(QuestionSlider);
