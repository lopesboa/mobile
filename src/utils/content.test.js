// @flow strict

import {createDisciplineCard, createCardLevel, createChapterCard} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {AUTHOR_TYPE} from '../const';
import {compareCards, pickNextCardLevel, getAuthorName, getAuthorType} from './content';

describe('Content', () => {
  describe('pickNextCardLevel', () => {
    const notStartedLevel = createCardLevel({
      label: 'mod_1',
      ref: 'mod_1',
      status: CARD_STATUS.STARTED,
      completion: 0
    });
    const onGoingLevel = createCardLevel({
      label: 'mod_2',
      ref: 'mod_2',
      status: CARD_STATUS.STARTED,
      completion: 0.5
    });
    const finishedLevel = createCardLevel({
      label: 'mod_3',
      ref: 'mod_3',
      status: CARD_STATUS.STARTED,
      completion: 1
    });
    const secondFinishedLevel = createCardLevel({
      label: 'mod_4',
      ref: 'mod_4',
      status: CARD_STATUS.STARTED,
      completion: 1
    });

    it("should return first module which haven't completion to 100%", () => {
      expect(
        pickNextCardLevel(
          createDisciplineCard({
            title: 'dis_1',
            ref: 'dis_1',
            completion: 0,
            levels: [notStartedLevel],
            name: 'dis_1'
          })
        )
      ).toBe(notStartedLevel);
      expect(
        pickNextCardLevel(
          createDisciplineCard({
            title: 'dis_1',
            ref: 'dis_1',
            completion: 0.5,
            levels: [notStartedLevel, onGoingLevel, finishedLevel],
            name: 'dis_1'
          })
        )
      ).toBe(notStartedLevel);
      expect(
        pickNextCardLevel(
          createDisciplineCard({
            title: 'dis_1',
            ref: 'dis_1',
            completion: 0.5,
            levels: [finishedLevel, notStartedLevel],
            name: 'dis_1'
          })
        )
      ).toBe(notStartedLevel);
      expect(
        pickNextCardLevel(
          createDisciplineCard({
            title: 'dis_1',
            ref: 'dis_1',
            completion: 0.5,
            levels: [finishedLevel, onGoingLevel, notStartedLevel],
            name: 'dis_1'
          })
        )
      ).toBe(onGoingLevel);
    });

    it('should return the last one if every levels are finished', () => {
      expect(
        pickNextCardLevel(
          createDisciplineCard({
            title: 'dis_1',
            ref: 'dis_1',
            completion: 1,
            levels: [finishedLevel, secondFinishedLevel],
            name: 'dis_1'
          })
        )
      ).toBe(secondFinishedLevel);
    });
    it('should return null if discipline has not level', () => {
      expect(
        pickNextCardLevel(
          createDisciplineCard({
            title: 'dis_1',
            ref: 'dis_1',
            completion: 1,
            levels: [],
            name: 'dis_1'
          })
        )
      ).toBe(null);
    });
  });

  describe('compareCards', () => {
    it('should sort cards by completion', () => {
      const notStartedChapter = createChapterCard({
        title: 'cha_1',
        ref: 'cha_1',
        completion: 0,
        status: CARD_STATUS.STARTED
      });
      const onGoingChapter = createChapterCard({
        title: 'cha_2',
        ref: 'cha_2',
        completion: 0.5,
        status: CARD_STATUS.STARTED
      });
      const finishedChapter = createChapterCard({
        title: 'cha_3',
        ref: 'cha_3',
        completion: 1,
        status: CARD_STATUS.STARTED
      });
      const notStartedDiscipline = createDisciplineCard({
        title: 'dis_1',
        ref: 'dis_1',
        completion: 0,
        levels: [],
        status: CARD_STATUS.STARTED
      });
      const onGoingDiscipline = createDisciplineCard({
        title: 'dis_2',
        ref: 'dis_2',
        completion: 0.5,
        levels: [],
        status: CARD_STATUS.STARTED
      });
      const finishedDiscipline = createDisciplineCard({
        title: 'dis_3',
        ref: 'dis_3',
        completion: 1,
        levels: [],
        status: CARD_STATUS.STARTED
      });

      expect(
        [
          onGoingChapter,
          onGoingDiscipline,
          notStartedChapter,
          notStartedDiscipline,
          finishedChapter,
          finishedDiscipline
        ].sort(compareCards)
      ).toEqual([
        onGoingChapter,
        onGoingDiscipline,
        notStartedChapter,
        notStartedDiscipline,
        finishedChapter,
        finishedDiscipline
      ]);
      expect(
        [
          onGoingDiscipline,
          onGoingChapter,
          notStartedDiscipline,
          notStartedChapter,
          finishedDiscipline,
          finishedChapter
        ].sort(compareCards)
      ).toEqual([
        onGoingDiscipline,
        onGoingChapter,
        notStartedDiscipline,
        notStartedChapter,
        finishedDiscipline,
        finishedChapter
      ]);

      expect(
        [
          finishedChapter,
          finishedDiscipline,
          notStartedChapter,
          notStartedDiscipline,
          onGoingChapter,
          onGoingDiscipline
        ].sort(compareCards)
      ).toEqual([
        onGoingChapter,
        onGoingDiscipline,
        notStartedChapter,
        notStartedDiscipline,
        finishedChapter,
        finishedDiscipline
      ]);
    });
  });

  describe('getAuthorName', () => {
    const disciplineCard = createDisciplineCard({
      title: 'dis_1',
      ref: 'dis_1',
      completion: 0,
      levels: [],
      name: 'dis_1'
    });

    it('should return the author name', () => {
      const result = getAuthorName(disciplineCard);
      const expected = 'A good guy with blue eyes';

      expect(result).toEqual(expected);
    });
  });

  describe('getAuthorType', () => {
    const disciplineCard = createDisciplineCard({
      title: 'dis_1',
      ref: 'dis_1',
      completion: 0,
      levels: [],
      name: 'dis_1'
    });

    it('should return the author type', () => {
      const result = getAuthorType(disciplineCard);
      const expected = AUTHOR_TYPE.VERIFIED;

      expect(result).toEqual(expected);
    });
  });
});
