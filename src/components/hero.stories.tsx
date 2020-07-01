import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {fakeLayout, TestContextProvider, handleFakePress} from '../utils/tests';
import {createCardLevel, createDisciplineCard, createCardAuthor} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {AUTHOR_TYPE} from '../const';
import {Component as Hero} from './hero';

const levelCard = createCardLevel({ref: 'mod_1', status: CARD_STATUS.ACTIVE, label: 'Fake level'});
const card = createDisciplineCard({
  ref: 'foo',
  completion: 0.3,
  levels: [levelCard],
  title: 'Discipline card',
  isAdaptive: true,
  isNew: true,
  authors: [createCardAuthor({authorType: AUTHOR_TYPE.COORP})],
});

storiesOf('Hero', module)
  .add('Default', () => (
    <TestContextProvider>
      <Hero layout={fakeLayout} content={null} onPress={handleFakePress} />
    </TestContextProvider>
  ))
  .add('With user', () => (
    <TestContextProvider>
      <Hero layout={fakeLayout} onPress={handleFakePress} />
    </TestContextProvider>
  ))
  .add('With content', () => (
    <TestContextProvider>
      <Hero layout={fakeLayout} onPress={handleFakePress} content={card} />
    </TestContextProvider>
  ));

if (__TEST__) {
  describe('Hero', () => {
    it('should handle onPress callback', () => {
      const handlePress = jest.fn();
      const content = card;
      const component = renderer.create(<Hero content={content} onPress={handlePress} />);

      const button = component.root.find((el) => el.props.testID === 'catalog-hero-button');
      button.props.onPress();

      expect(handlePress).toHaveBeenCalledTimes(1);
      expect(handlePress.mock.calls[0]).toEqual([content]);
    });
  });
}
