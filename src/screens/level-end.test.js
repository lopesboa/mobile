// @flow strict

import {createStoreState, createCatalogState} from '../__fixtures__/store';
import {createQCMGraphic} from '../__fixtures__/questions';
import {createSlide} from '../__fixtures__/slides';
import {createDiscipline} from '../__fixtures__/disciplines';
import {createLevel} from '../__fixtures__/levels';
import {createChapter} from '../__fixtures__/chapters';
import {createProgression} from '../__fixtures__/progression';
import {createContextWithImage} from '../__fixtures__/context';
import {createDisciplineCard, createCardLevel} from '../__fixtures__/cards';
import {CONTENT_TYPE, ENGINE} from '../const';
import {CARD_STATUS} from '../layer/data/_const';
import {mapToLevelAPI, mapToChapterAPI} from '../layer/data/mappers';
import type {ConnectedStateProps} from './level-end';

jest.mock('../modules/audio-player', () => ({
  __esModule: true,
  default: jest.fn(),
  AUDIO_FILE: {
    SUCCESS_LEVEL: 'success.mp3',
    FAILURE_LEVEL: 'failure.mp3'
  }
}));

const question = createQCMGraphic({});
const context = createContextWithImage({title: 'A beautifull rainy day'});
const slide = createSlide({
  ref: 'dummySlideRef',
  chapterId: '666',
  chapterIds: ['666'],
  question,
  context
});

const levelOne = createLevel({ref: 'mod_foo', chapterIds: []});
const levelTwo = createLevel({ref: 'mod_bar', chapterIds: []});
const levelThree = createLevel({ref: 'mod_baz', chapterIds: []});
const levelFour = createLevel({ref: 'mod_qux', chapterIds: []});
const levelFive = createLevel({ref: 'mod_quux', chapterIds: []});
const chapter = createChapter({name: 'Fake chapter', ref: 'cha_foo'});
const disciplineOne = createDiscipline({
  ref: 'dis1',
  levels: [levelOne, levelTwo, levelThree],
  name: 'Fake discipline'
});
const disciplineTwo = createDiscipline({
  ref: 'dis2',
  levels: [levelFour, levelFive],
  name: 'Fake discipline'
});
const disciplineCardOne = createDisciplineCard({
  ref: disciplineOne.ref,
  completion: 0,
  levels: disciplineOne.modules.map(({ref, name}) =>
    createCardLevel({ref, label: name, status: CARD_STATUS.ACTIVE})
  ),
  title: disciplineOne.name
});
const disciplineCardTwo = createDisciplineCard({
  ref: disciplineTwo.ref,
  completion: 0,
  levels: disciplineTwo.modules.map(({ref, name}) =>
    createCardLevel({ref, label: name, status: CARD_STATUS.ACTIVE})
  ),
  title: disciplineTwo.name
});

describe('LevelEnd', () => {
  describe('Props', () => {
    const catalog = createCatalogState([], [disciplineCardOne, disciplineCardTwo]);

    it('should have learner props', () => {
      const {mapStateToProps} = require('./level-end');

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: levelOne.ref
        },
        state: {
          nextContent: {
            type: CONTENT_TYPE.LEVEL,
            ref: levelTwo.ref
          },
          stars: 20
        }
      });

      const state = createStoreState({
        levels: [levelOne, levelTwo, levelThree, levelFour, levelFive],
        disciplines: [disciplineOne, disciplineTwo],
        chapters: [chapter],
        slides: [slide, slide],
        progression,
        catalog,
        nextContent: mapToLevelAPI(levelTwo)
      });

      const result = mapStateToProps(state);
      const expected: ConnectedStateProps = {
        contentType: CONTENT_TYPE.LEVEL,
        nextContent: mapToLevelAPI(levelTwo),
        currentContent: mapToLevelAPI(levelOne),
        bestScore: '20',
        recommendation: disciplineCardTwo
      };

      expect(result).toEqual(expected);
    });

    it('should have microlearning props', () => {
      const {mapStateToProps} = require('./level-end');

      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.CHAPTER,
          ref: chapter.universalRef
        },
        state: {
          nextContent: {
            type: CONTENT_TYPE.CHAPTER,
            ref: chapter.universalRef
          },
          stars: 7
        }
      });

      const state = createStoreState({
        levels: [levelOne, levelTwo, levelThree, levelFour, levelFive],
        disciplines: [disciplineOne, disciplineTwo],
        chapters: [chapter],
        slides: [slide, slide],
        progression,
        catalog,
        nextContent: mapToChapterAPI(chapter)
      });

      const result = mapStateToProps(state);
      const expected: ConnectedStateProps = {
        contentType: CONTENT_TYPE.CHAPTER,
        nextContent: mapToChapterAPI(chapter),
        currentContent: mapToChapterAPI(chapter),
        bestScore: '7',
        recommendation: disciplineCardOne
      };

      expect(result).toEqual(expected);
    });
  });
});
