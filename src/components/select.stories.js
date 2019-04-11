// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import renderer from 'react-test-renderer';
import {createSelectChoice} from '../__fixtures__/question-choices';
import {createFakeAnalytics, handleFakePress} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import {ANALYTICS_EVENT_TYPE} from '../const';
import {Component as Select} from './select';

const select = createSelectChoice({name: 'sel456'});
const items = select.items || [];

storiesOf('Select', module)
  .add('Default', () => (
    <Select
      questionType="template"
      analyticsID="foo"
      values={items}
      placeholder="Foo bar baz"
      onChange={handleFakePress}
    />
  ))
  .add('Not empty', () => (
    <Select
      analyticsID="foo"
      questionType="template"
      values={items}
      value={items[1].text}
      placeholder="Foo bar baz"
      onChange={handleFakePress}
    />
  ))
  .add('Disabled', () => (
    <Select
      analyticsID="foo"
      questionType="template"
      values={items}
      value={items[0].text}
      placeholder="Foo bar baz"
      onChange={handleFakePress}
      isDisabled
    />
  ))
  .add('Colored', () => (
    <Select
      analyticsID="foo"
      questionType="template"
      values={items}
      placeholder="Foo bar baz"
      onChange={handleFakePress}
      color="#ff00ff"
      isDisabled
    />
  ));

if (__TEST__) {
  describe('Select tracking', () => {
    it('should track onOpen', () => {
      const analytics = createFakeAnalytics();

      const component = renderer.create(
        <Select
          testID="plop"
          analyticsID="foo"
          questionType="template"
          analytics={analytics}
          values={items}
          placeholder="Foo bar baz"
          onChange={handleFakePress}
          isDisabled
        />
      );

      const item = component.root.find(el => el.props.testID === `plop-select-base`);
      item.props.onOpen();

      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.OPEN_SELECT, {
        id: 'foo',
        questionType: 'template'
      });
    });

    it('should track onClose', () => {
      const analytics = createFakeAnalytics();

      const component = renderer.create(
        <Select
          testID="plop"
          analyticsID="foo"
          questionType="template"
          analytics={analytics}
          values={items}
          value={items[1].value}
          placeholder="Foo bar baz"
          onChange={handleFakePress}
          isDisabled
        />
      );

      const item = component.root.find(el => el.props.testID === `plop-select-base`);
      item.props.onClose();

      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.CLOSE_SELECT, {
        id: 'foo',
        questionType: 'template'
      });
    });
  });
}
