// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import renderer from 'react-test-renderer';
import {createSelectChoice} from '../__fixtures__/question-choices';
import {createFakeAnalytics, handleFakePress} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import {ANALYTICS_EVENT_TYPE, QUESTION_TYPE} from '../const';
import {Component as Select} from './select';
import type {Props} from './select';

type State = {|
  isFocused: boolean
|};

class SelectWithModal extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    isFocused: false
  };

  componentDidMount() {
    this.reset(this.props.isFocused);
  }

  reset = (isFocused?: boolean) =>
    this.setState({
      isFocused
    });

  handleFocus = () => {
    this.reset(true);
    this.props.onFocus();
  };

  handleBlur = () => {
    this.reset(false);
    this.props.onBlur();
  };

  render() {
    return (
      <Select
        {...this.props}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        isFocused={this.state.isFocused}
      />
    );
  }
}

const select = createSelectChoice({name: 'sel456'});
const items = select.items || [];

storiesOf('Select', module)
  .add('Default', () => (
    <Select
      questionType={QUESTION_TYPE.TEMPLATE}
      analyticsID="foo"
      values={items}
      onChange={handleFakePress}
      onFocus={handleFakePress}
      onBlur={handleFakePress}
    />
  ))
  .add('With placeholder', () => (
    <Select
      questionType={QUESTION_TYPE.TEMPLATE}
      analyticsID="foo"
      placeholder="Feel free to edit"
      values={items}
      onChange={handleFakePress}
      onFocus={handleFakePress}
      onBlur={handleFakePress}
    />
  ))
  .add('With value', () => (
    <Select
      analyticsID="foo"
      placeholder="Feel free to edit"
      questionType={QUESTION_TYPE.TEMPLATE}
      values={items}
      value={items[1].text}
      onChange={handleFakePress}
      onFocus={handleFakePress}
      onBlur={handleFakePress}
    />
  ))
  .add('Disabled', () => (
    <Select
      analyticsID="foo"
      placeholder="Feel free to edit"
      questionType={QUESTION_TYPE.TEMPLATE}
      values={items}
      onChange={handleFakePress}
      onFocus={handleFakePress}
      onBlur={handleFakePress}
      isDisabled
    />
  ))
  .add('Colored', () => (
    <Select
      analyticsID="foo"
      placeholder="Feel free to edit"
      questionType={QUESTION_TYPE.TEMPLATE}
      values={items}
      onChange={handleFakePress}
      onFocus={handleFakePress}
      onBlur={handleFakePress}
      color="#ff00ff"
    />
  ))
  .add('Colored with value', () => (
    <Select
      analyticsID="foo"
      placeholder="Feel free to edit"
      questionType={QUESTION_TYPE.TEMPLATE}
      values={items}
      value={items[1].text}
      onChange={handleFakePress}
      onFocus={handleFakePress}
      onBlur={handleFakePress}
      color="#ff00ff"
    />
  ))
  .add('Focused', () => (
    <SelectWithModal
      analyticsID="foo"
      placeholder="Feel free to edit"
      questionType={QUESTION_TYPE.TEMPLATE}
      values={items}
      onChange={handleFakePress}
      onFocus={handleFakePress}
      onBlur={handleFakePress}
      isFocused
    />
  ));

if (__TEST__) {
  describe('Select', () => {
    it('should handle focus', () => {
      const analytics = createFakeAnalytics();
      const analyticsID = 'foo';
      const questionType = QUESTION_TYPE.TEMPLATE;
      const handleFocus = jest.fn();

      const component = renderer.create(
        <Select
          analyticsID={analyticsID}
          questionType={questionType}
          analytics={analytics}
          values={items}
          placeholder="Foo bar baz"
          onChange={handleFakePress}
          onFocus={handleFocus}
          onBlur={handleFakePress}
          isDisabled
          testID="select"
        />
      );

      const item = component.root.find(el => el.props.testID === 'select-input');
      item.props.onPress();

      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.OPEN_SELECT, {
        id: analyticsID,
        questionType
      });
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle blur', () => {
      const analytics = createFakeAnalytics();
      const analyticsID = 'foo';
      const questionType = QUESTION_TYPE.TEMPLATE;
      const handleBlur = jest.fn();

      const component = renderer.create(
        <Select
          analyticsID={analyticsID}
          questionType={questionType}
          analytics={analytics}
          values={items}
          value={items[1].text}
          placeholder="Foo bar baz"
          onChange={handleFakePress}
          onFocus={handleFakePress}
          onBlur={handleBlur}
          isDisabled
          testID="select"
        />
      );

      const item = component.root.find(el => el.props.testID === 'select-modal');
      item.props.onClose();

      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.CLOSE_SELECT, {
        id: analyticsID,
        questionType
      });
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should handle change', () => {
      const analytics = createFakeAnalytics();
      const analyticsID = 'foo';
      const questionType = QUESTION_TYPE.TEMPLATE;
      const handleBlur = jest.fn();
      const handleChange = jest.fn();

      const component = renderer.create(
        <Select
          analyticsID={analyticsID}
          questionType={questionType}
          analytics={analytics}
          values={items}
          value={items[1].text}
          placeholder="Foo bar baz"
          onChange={handleChange}
          onFocus={handleFakePress}
          onBlur={handleBlur}
          isDisabled
          testID="select"
        />
      );

      const item = component.root.find(el => el.props.testID === 'select-modal');
      item.props.onChange('bar');

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('bar');
      expect(analytics.logEvent).toHaveBeenCalledWith(ANALYTICS_EVENT_TYPE.CLOSE_SELECT, {
        id: analyticsID,
        questionType
      });
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });
}
