import {
  createDisciplineCard,
  createCardLevel,
  createChapterCard,
  createCardAuthor,
} from '../__fixtures__/cards';
import {CARD_STATUS} from '../layer/data/_const';
import {compareCards, pickNextCardLevel, getAuthor} from './content';

describe('Content', () => {
  describe('pickNextCardLevel', () => {
    const notStartedLevel = createCardLevel({
      label: 'mod_1',
      ref: 'mod_1',
      status: CARD_STATUS.STARTED,
      completion: 0,
    });
    const onGoingLevel = createCardLevel({
      label: 'mod_2',
      ref: 'mod_2',
      status: CARD_STATUS.STARTED,
      completion: 0.5,
    });
    const finishedLevel = createCardLevel({
      label: 'mod_3',
      ref: 'mod_3',
      status: CARD_STATUS.STARTED,
      completion: 1,
    });
    const secondFinishedLevel = createCardLevel({
      label: 'mod_4',
      ref: 'mod_4',
      status: CARD_STATUS.STARTED,
      completion: 1,
    });

    it("should return first module which haven't completion to 100%", () => {
      expect(
        pickNextCardLevel(
          createDisciplineCard({
            title: 'dis_1',
            ref: 'dis_1',
            completion: 0,
            levels: [notStartedLevel],
          }),
        ),
      ).toBe(notStartedLevel);
      expect(
        pickNextCardLevel(
          createDisciplineCard({
            title: 'dis_1',
            ref: 'dis_1',
            completion: 0.5,
            levels: [notStartedLevel, onGoingLevel, finishedLevel],
          }),
        ),
      ).toBe(notStartedLevel);
      expect(
        pickNextCardLevel(
          createDisciplineCard({
            title: 'dis_1',
            ref: 'dis_1',
            completion: 0.5,
            levels: [finishedLevel, notStartedLevel],
          }),
        ),
      ).toBe(notStartedLevel);
      expect(
        pickNextCardLevel(
          createDisciplineCard({
            title: 'dis_1',
            ref: 'dis_1',
            completion: 0.5,
            levels: [finishedLevel, onGoingLevel, notStartedLevel],
          }),
        ),
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
          }),
        ),
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
          }),
        ),
      ).toBe(null);
    });
  });

  describe('compareCards', () => {
    it('should sort cards by completion', () => {
      const notStartedChapter = createChapterCard({
        title: 'cha_1',
        ref: 'cha_1',
        completion: 0,
        status: CARD_STATUS.STARTED,
      });
      const onGoingChapter = createChapterCard({
        title: 'cha_2',
        ref: 'cha_2',
        completion: 0.5,
        status: CARD_STATUS.STARTED,
      });
      const finishedChapter = createChapterCard({
        title: 'cha_3',
        ref: 'cha_3',
        completion: 1,
        status: CARD_STATUS.STARTED,
      });
      const notStartedDiscipline = createDisciplineCard({
        title: 'dis_1',
        ref: 'dis_1',
        completion: 0,
        levels: [],
      });
      const onGoingDiscipline = createDisciplineCard({
        title: 'dis_2',
        ref: 'dis_2',
        completion: 0.5,
        levels: [],
      });
      const finishedDiscipline = createDisciplineCard({
        title: 'dis_3',
        ref: 'dis_3',
        completion: 1,
        levels: [],
      });

      expect(
        [
          onGoingChapter,
          onGoingDiscipline,
          notStartedChapter,
          notStartedDiscipline,
          finishedChapter,
          finishedDiscipline,
        ].sort(compareCards),
      ).toEqual([
        onGoingChapter,
        onGoingDiscipline,
        notStartedChapter,
        notStartedDiscipline,
        finishedChapter,
        finishedDiscipline,
      ]);
      expect(
        [
          onGoingDiscipline,
          onGoingChapter,
          notStartedDiscipline,
          notStartedChapter,
          finishedDiscipline,
          finishedChapter,
        ].sort(compareCards),
      ).toEqual([
        onGoingDiscipline,
        onGoingChapter,
        notStartedDiscipline,
        notStartedChapter,
        finishedDiscipline,
        finishedChapter,
      ]);

      expect(
        [
          finishedChapter,
          finishedDiscipline,
          notStartedChapter,
          notStartedDiscipline,
          onGoingChapter,
          onGoingDiscipline,
        ].sort(compareCards),
      ).toEqual([
        onGoingChapter,
        onGoingDiscipline,
        notStartedChapter,
        notStartedDiscipline,
        finishedChapter,
        finishedDiscipline,
      ]);
    });
  });

  describe('getAuthor', () => {
    const author = createCardAuthor({});
    const disciplineCard = createDisciplineCard({
      title: 'dis_1',
      ref: 'dis_1',
      completion: 0,
      levels: [],
      authors: [author],
    });

    it('should return the author', () => {
      const result = getAuthor(disciplineCard);
      const expected = author;

      expect(result).toEqual(expected);
    });
  });
});
