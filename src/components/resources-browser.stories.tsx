import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {createVideo, createPdf} from '../__fixtures__/lessons';
import {TestContextProvider, handleFakePress} from '../utils/tests';
import {mapToResource} from '../layer/data/mappers';
import ResourcesBrowser from './resources-browser';

const lessons = [
  createVideo({ref: 'les_1'}),
  createPdf({ref: 'les_2'}),
  createVideo({ref: 'les_3'}),
  createVideo({ref: 'les_4'}),
  createVideo({ref: 'les_5'}),
  createVideo({ref: 'les_6'}),
];

const resources = lessons.map(mapToResource).filter((lesson) => lesson.url);

storiesOf('ResourcesBrowser', module)
  .add('Default', () => <ResourcesBrowser resources={resources} onChange={handleFakePress} />)
  .add('Selected', () => (
    <ResourcesBrowser
      resources={resources}
      selected={resources[1]._id}
      onChange={handleFakePress}
    />
  ))
  .add('Only one resource', () => (
    <ResourcesBrowser
      resources={resources.filter((resource) => resource.ref === 'les_1')}
      onChange={handleFakePress}
    />
  ));

if (__TEST__) {
  describe('ResourcesBrowser', () => {
    it('should handle onPress callback', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <TestContextProvider>
          <ResourcesBrowser
            onChange={handlePress}
            selected={resources[0]._id}
            resources={resources}
          />
        </TestContextProvider>,
      );

      const item = component.root.find((el) => el.props.testID === `resource-les-2`);
      item.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
      expect(handlePress.mock.calls[0]).toEqual([resources[1]._id]);
    });
  });
}
