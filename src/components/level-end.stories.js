// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import renderer from 'react-test-renderer';

import {__TEST__} from '../modules/environment';
import {createCardLevel, createDisciplineCard, createChapterCard} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {handleFakePress, createFakeVibration, createFakeAudio} from '../utils/tests';
import {AUTHOR_TYPE, CONTENT_TYPE} from '../const';
import {Component as LevelEnd} from './level-end';

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
      contentType={CONTENT_TYPE.LEVEL}
      isSuccess={false}
      isFocused={false}
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={disciplineNew}
      bestScore="0"
      vibration={createFakeVibration()}
      audio={createFakeAudio()}
    />
  ))
  .add('Success', () => (
    <LevelEnd
      contentType={CONTENT_TYPE.LEVEL}
      isSuccess
      isFocused
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={chapterNew}
      bestScore="20"
      nextContentType={CONTENT_TYPE.LEVEL}
      nextContentLabel="Advanced"
      vibration={createFakeVibration()}
      audio={createFakeAudio()}
    />
  ))
  .add('Failure Author Coorp', () => (
    <LevelEnd
      contentType={CONTENT_TYPE.LEVEL}
      isSuccess={false}
      isFocused
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={disciplineNewCoorp}
      bestScore="0"
      vibration={createFakeVibration()}
      audio={createFakeAudio()}
    />
  ))
  .add('Success Author Coorp', () => (
    <LevelEnd
      contentType={CONTENT_TYPE.LEVEL}
      isSuccess
      isFocused
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={chapterNewCoorp}
      bestScore="0"
      nextContentType={CONTENT_TYPE.LEVEL}
      nextContentLabel="Advanced"
      vibration={createFakeVibration()}
      audio={createFakeAudio()}
    />
  ))
  .add('Finished', () => (
    <LevelEnd
      contentType={CONTENT_TYPE.LEVEL}
      isSuccess
      isFocused
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={chapterNewCoorp}
      bestScore="0"
      vibration={createFakeVibration()}
      audio={createFakeAudio()}
    />
  ))
  .add('Microlearning', () => (
    <LevelEnd
      contentType={CONTENT_TYPE.CHAPTER}
      isSuccess
      isFocused
      onButtonPress={handleFakePress}
      onCardPress={handleFakePress}
      onClose={handleFakePress}
      recommendation={chapterNewCoorp}
      bestScore="0"
      nextContentType={CONTENT_TYPE.CHAPTER}
      nextContentLabel="foobar"
      vibration={createFakeVibration()}
      audio={createFakeAudio()}
    />
  ));

if (__TEST__) {
  describe('LevelEnd', () => {
    it('should handle onCardPress callback', () => {
      const handlePress = jest.fn();
      const component = renderer.create(
        <LevelEnd
          contentType={CONTENT_TYPE.LEVEL}
          isSuccess={false}
          isFocused
          onButtonPress={handleFakePress}
          onCardPress={handlePress}
          onClose={handleFakePress}
          recommendation={disciplineNewCoorp}
          bestScore="0"
          vibration={createFakeVibration()}
          audio={createFakeAudio()}
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
          contentType={CONTENT_TYPE.LEVEL}
          isSuccess={false}
          isFocused
          onButtonPress={handlePress}
          onCardPress={handlePress}
          onClose={handleFakePress}
          recommendation={disciplineNew}
          bestScore="0"
          vibration={createFakeVibration()}
          audio={createFakeAudio()}
        />
      );
      const item = component.root.find(el => el.props.testID === 'button-retry-level');
      item.props.onPress();

      expect(item.props.analyticsID).toBe('button-end-retry-level');
      expect(handlePress.mock.calls.length).toBe(1);
    });

    it('should trigger sound and vibration on success', () => {
      const vibration = createFakeVibration();
      const audio = createFakeAudio();

      renderer.create(
        <LevelEnd
          contentType={CONTENT_TYPE.LEVEL}
          isSuccess
          isFocused
          onButtonPress={handleFakePress}
          onCardPress={handleFakePress}
          onClose={handleFakePress}
          recommendation={disciplineNewCoorp}
          bestScore="0"
          vibration={vibration}
          audio={audio}
        />
      );

      expect(vibration.vibrate).toHaveBeenCalledTimes(1);
      expect(vibration.vibrate).toHaveBeenCalledWith(vibration.VIBRATION_TYPE.NOTIFICATION_SUCCESS);
      expect(audio.play).toHaveBeenCalledTimes(1);
      expect(audio.play).toHaveBeenCalledWith(audio.AUDIO_FILE.SUCCESS_LEVEL);
    });

    it('should trigger sound and vibration on error', () => {
      const vibration = createFakeVibration();
      const audio = createFakeAudio();

      renderer.create(
        <LevelEnd
          contentType={CONTENT_TYPE.LEVEL}
          isSuccess={false}
          isFocused
          onButtonPress={handleFakePress}
          onCardPress={handleFakePress}
          onClose={handleFakePress}
          recommendation={disciplineNewCoorp}
          bestScore="0"
          vibration={vibration}
          audio={audio}
        />
      );

      expect(vibration.vibrate).toHaveBeenCalledTimes(1);
      expect(vibration.vibrate).toHaveBeenCalledWith(vibration.VIBRATION_TYPE.NOTIFICATION_ERROR);
      expect(audio.play).toHaveBeenCalledTimes(1);
      expect(audio.play).toHaveBeenCalledWith(audio.AUDIO_FILE.FAILURE_LEVEL);
    });
  });
}
