// @flow

import * as React from 'react';
import renderer from 'react-test-renderer';

import {ANALYTICS_EVENT_TYPE, QUESTION_TYPE} from '../const';
import {createFakeAnalytics} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import {Component as QuestionSlider} from './question-slider';

if (__TEST__) {
  describe('QuestionSlider', () => {
    it('should handle onPress', () => {
      const handleChange = jest.fn();
      const analytics = createFakeAnalytics();
      const analyticsID = 'slider';
      const component = renderer.create(
        <QuestionSlider analytics={analytics} onChange={handleChange} min={{}} max={{}} />
      );
      const slider = component.root.find(el => el.props.testID === 'slider');
      slider.props.onValueChange(42.3);
      slider.props.onSlidingComplete();
      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.SLIDE, {
        id: analyticsID,
        questionType: QUESTION_TYPE.SLIDER
      });
      expect(handleChange).toHaveBeenCalledWith(42);
    });
  });
}
