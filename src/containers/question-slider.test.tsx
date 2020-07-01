import * as React from 'react';
import renderer from 'react-test-renderer';

import {ANALYTICS_EVENT_TYPE, QUESTION_TYPE} from '../const';
import {createFakeAnalytics} from '../utils/tests';
import {Component as QuestionSlider} from './question-slider';

describe('QuestionSlider', () => {
  it('should handle onPress', () => {
    const handleChange = jest.fn();
    const analytics = createFakeAnalytics();

    const component = renderer.create(
      <QuestionSlider analytics={analytics} onChange={handleChange} min={0} max={100} />,
    );

    const slider = component.root.find((el) => el.props.testID === 'slider');
    slider.props.onValueChange(42.3);
    slider.props.onSlidingComplete();

    expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.SLIDE, {
      id: 'slider',
      questionType: QUESTION_TYPE.SLIDER,
    });
    expect(handleChange).toHaveBeenCalledWith(42);
  });

  it('should reset state when props change', () => {
    const handleChange = jest.fn();
    const analytics = createFakeAnalytics();

    const component = renderer.create(
      <QuestionSlider analytics={analytics} onChange={handleChange} min={0} max={100} />,
    );

    let slider = component.root.find((el) => el.props.testID === 'slider');
    expect(slider.props.value).toEqual(0);

    component.update(
      <QuestionSlider analytics={analytics} onChange={handleChange} min={0} max={100} value={42} />,
    );
    slider = component.root.find((el) => el.props.testID === 'slider');
    expect(slider.props.value).toEqual(42);
  });
});
