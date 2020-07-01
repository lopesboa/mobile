import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {choices} from '../__fixtures__/question-choices';
import {handleFakePress} from '../utils/tests';
import DropZone from './drop-zone';

const upgradedChoices = choices.map((choice) => ({
  ...choice,
  value: undefined,
}));

storiesOf('DropZone', module)
  .add('Default', () => <DropZone choices={choices} onPress={handleFakePress} />)
  .add('with choice without value', () => (
    <DropZone choices={upgradedChoices} onPress={handleFakePress} />
  ))
  .add('With No SelectedChoics', () => <DropZone choices={[]} onPress={handleFakePress} />);

if (__TEST__) {
  describe('DropZone', () => {
    it('should handle onItemPress callback', () => {
      const handleItemPress = jest.fn();
      const component = renderer.create(<DropZone choices={choices} onPress={handleItemPress} />);
      const questionItem = component.root.find((el) => el.props.testID === 'choice-4');
      questionItem.props.onPress();
      expect(handleItemPress.mock.calls.length).toBe(1);
      expect(handleItemPress.mock.calls[0]).toEqual([choices[3]]);
    });
  });
}
