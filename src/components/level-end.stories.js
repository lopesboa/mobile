// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {createCardLevel, createDisciplineCard, createChapterCard} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {handleFakePress} from '../utils/tests';
import {AUTHOR_TYPE} from '../const';
import LevelEnd from './level-end';

const level = createCardLevel({ref: 'mod_1', status: CARD_STATUS.ACTIVE, label: 'Fake level'});

const chapterNew = createChapterCard({
  ref: 'cha_2',
  completion: 0,
  title: 'Fake chapter',
  status: CARD_STATUS.ACTIVE,
  isNew: false,
  authors: [{authorType: AUTHOR_TYPE.CUSTOM, label: 'custom', ref: 'part_VyFl5hZ3V'}]
});
const disciplineNew = createDisciplineCard({
  ref: 'dis_2',
  completion: 0,
  levels: [level],
  title: 'Fake discipline',
  isNew: true,
  authors: [{authorType: AUTHOR_TYPE.CUSTOM, label: 'custom', ref: 'part_VyFl5hZ3V'}]
});

const disciplineNewCoorp = createDisciplineCard({
  ref: 'dis_2',
  completion: 0,
  levels: [level],
  title: 'Fake discipline',
  isNew: true,
  authors: [{authorType: AUTHOR_TYPE.COORP, label: 'custom', ref: 'part_VyFl5hZ3V'}]
});
const chapterNewCoorp = createChapterCard({
  ref: 'cha_2',
  completion: 0,
  title: 'Fake chapter',
  status: CARD_STATUS.ACTIVE,
  isNew: false,
  authors: [{authorType: AUTHOR_TYPE.COORP, label: 'custom', ref: 'part_VyFl5hZ3V'}]
});

storiesOf('LevelEnd', module)
  .add('Failure', () => (
    <LevelEnd
      contentType="level"
      isSuccess={false}
      isFocused={false}
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={disciplineNew}
      bestScore="0"
      isLevelUnlocked={false}
      levelUnlockedName=""
      hasFinishedCourse={false}
    />
  ))
  .add('Success', () => (
    <LevelEnd
      contentType="level"
      isSuccess
      isFocused
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={chapterNew}
      bestScore="20"
      hasFinishedCourse={false}
      isLevelUnlocked
      levelUnlockedName="avancé"
    />
  ))
  .add('Failure Author Coorp', () => (
    <LevelEnd
      contentType="level"
      isSuccess={false}
      isFocused
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={disciplineNewCoorp}
      bestScore="0"
      isLevelUnlocked={false}
      levelUnlockedName=""
      hasFinishedCourse={false}
    />
  ))
  .add('Success Author Coorp', () => (
    <LevelEnd
      contentType="level"
      isSuccess
      isFocused
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={chapterNewCoorp}
      bestScore="0"
      isLevelUnlocked
      levelUnlockedName=""
      hasFinishedCourse={false}
    />
  ))
  .add('Finished', () => (
    <LevelEnd
      contentType="level"
      isSuccess
      isFocused
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={chapterNewCoorp}
      bestScore="0"
      isLevelUnlocked
      levelUnlockedName=""
      hasFinishedCourse
    />
  ))
  .add('Microlearning', () => (
    <LevelEnd
      contentType="chapter"
      isSuccess
      isFocused
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={chapterNewCoorp}
      bestScore="0"
      isLevelUnlocked
      levelUnlockedName=""
      hasFinishedCourse
    />
  ));

if (__TEST__) {
  describe('LevelEnd', () => {
    it('should handle onCardPress callback', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <LevelEnd
          contentType="level"
          isSuccess={false}
          isFocused
          onButtonPress={handleFakePress}
          onCardPress={handlePress}
          onClose={handleFakePress}
          recommendation={disciplineNewCoorp}
          bestScore="0"
          isLevelUnlocked={false}
          levelUnlockedName=""
          hasFinishedCourse={false}
        />
      );
      const item = component.root.find(el => el.props.testID === 'recommend-item-dis-2');
      item.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
      expect(handlePress.mock.calls[0]).toEqual([disciplineNewCoorp]);
    });

    it('should handle onButtonPress callback', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <LevelEnd
          contentType="level"
          isSuccess={false}
          isFocused
          onButtonPress={handlePress}
          onCardPress={handlePress}
          onClose={handleFakePress}
          recommendation={disciplineNew}
          bestScore="0"
          isLevelUnlocked={false}
          levelUnlockedName=""
          hasFinishedCourse={false}
        />
      );
      const item = component.root.find(el => el.props.testID === 'button-retry-level');
      item.props.onPress();

      expect(item.props.analyticsID).toBe('button-end-retry-level');
      expect(handlePress.mock.calls.length).toBe(1);
    });
  });
}
