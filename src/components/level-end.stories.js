// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import renderer from 'react-test-renderer';
import {createCardLevel, createDisciplineCard, createChapterCard} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {handleFakePress} from '../utils/tests';
import {AUTHOR_TYPE} from '../const';
import LevelEnd from './level-end';

// This is for the loader
if (process.env.NODE_ENV === 'test') {
  jest.useFakeTimers();
}

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
      isSuccess={false}
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendedContent={disciplineNew}
      bestScore="0"
      isLevelUnlocked={false}
      levelUnlockedName=""
      hasFinishedCourse={false}
    />
  ))
  .add('Success', () => (
    <LevelEnd
      isSuccess
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendedContent={chapterNew}
      bestScore="20"
      hasFinishedCourse={false}
      isLevelUnlocked
      levelUnlockedName="avancé"
    />
  ))
  .add('Failure Author Coorp', () => (
    <LevelEnd
      isSuccess={false}
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendedContent={disciplineNewCoorp}
      bestScore="0"
      isLevelUnlocked={false}
      levelUnlockedName=""
      hasFinishedCourse={false}
    />
  ))
  .add('Success Author Coorp', () => (
    <LevelEnd
      isSuccess
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendedContent={chapterNewCoorp}
      bestScore="0"
      isLevelUnlocked
      levelUnlockedName=""
      hasFinishedCourse={false}
    />
  ))
  .add('Finished', () => (
    <LevelEnd
      isSuccess
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendedContent={chapterNewCoorp}
      bestScore="0"
      isLevelUnlocked
      levelUnlockedName=""
      hasFinishedCourse
    />
  ));

if (process.env.NODE_ENV === 'test') {
  describe('LevelEnd', () => {
    it('should handle onCardPress callback', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <LevelEnd
          isSuccess={false}
          onButtonPress={handleFakePress}
          onCardPress={handlePress}
          onClose={handleFakePress}
          recommendedContent={disciplineNewCoorp}
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
          isSuccess={false}
          onButtonPress={handlePress}
          onCardPress={handlePress}
          onClose={handleFakePress}
          recommendedContent={disciplineNew}
          bestScore="0"
          isLevelUnlocked={false}
          levelUnlockedName=""
          hasFinishedCourse={false}
        />
      );
      const item = component.root.find(el => el.props.testID === 'button-retry-level');
      item.props.onPress();
      expect(handlePress.mock.calls.length).toBe(1);
    });
  });
}
