// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {createLevel} from '../__fixtures__/levels';
import {createDiscipline} from '../__fixtures__/disciplines';
import {createChapter} from '../__fixtures__/chapters';
import {handleFakePress} from '../utils/tests';
import Catalog from './catalog';

const level = createLevel({ref: 'mod_1', chapterIds: ['cha_1']});
const discipline = createDiscipline({ref: 'dis_1', levels: [level], name: 'Fake discipline'});
const chapter = createChapter({ref: 'cha_1', name: 'Fake chapter'});

storiesOf('Catalog', module).add('Default', () => (
  <Catalog items={[discipline, chapter]} onPress={handleFakePress} />
));

if (process.env.NODE_ENV === 'test') {
  describe('QuestionChoices', () => {
    it('should handle onItemPress callback on discipline', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <Catalog items={[discipline, chapter]} onPress={handlePress} />
      );
      const catalogItem = component.root.find(el => el.props.testID === 'catalog-item-dis-1');
      catalogItem.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
      expect(handlePress.mock.calls[0]).toEqual([discipline]);
    });

    it('should handle onItemPress callback on chapter', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <Catalog items={[discipline, chapter]} onPress={handlePress} />
      );
      const catalogItem = component.root.find(el => el.props.testID === 'catalog-item-cha-1');
      catalogItem.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
      expect(handlePress.mock.calls[0]).toEqual([chapter]);
    });
  });
}
