// @flow

import {createStoreState} from '../__fixtures__/store';
import {createLevel} from '../__fixtures__/levels';
import {createQCMGraphic} from '../__fixtures__/questions';
import {createSlide} from '../__fixtures__/slides';
import {createProgression} from '../__fixtures__/progression';

import {createContextWithImage} from '../__fixtures__/context';
import {createDisciplineCard, createCardLevel} from '../__fixtures__/cards';
import {mapStateToProps} from './level-end';

describe('level-end', () => {
  it('should return the accurate props', () => {
    const levelRef = 'dummyLevelRef';
    const SlideRef = 'dummySlideRef';
    const level = createLevel({ref: levelRef, chapterIds: ['666']});
    const question = createQCMGraphic({});
    const context = createContextWithImage({title: 'A beautifull rainy day'});
    const slide = createSlide({
      ref: SlideRef,
      chapterId: '666',
      chapterIds: ['666'],
      question,
      context
    });

    const progression = createProgression({
      engine: 'learner',
      progressionContent: {
        type: 'level',
        ref: 'mod_1'
      },
      nextContent: {
        type: 'slide',
        ref: 'dummySlideRef'
      }
    });

    const levelCard1 = createCardLevel({
      ref: 'mod_1',
      status: 'isActive',
      label: 'Fake level'
    });
    const levelCard2 = createCardLevel({
      ref: 'mod_2',
      status: 'isActive',
      label: 'Fake level'
    });
    const dis1 = createDisciplineCard({
      ref: 'dis1',
      completion: 0,
      levels: [levelCard1],
      title: 'First discipline'
    });
    const dis2 = createDisciplineCard({
      ref: 'dis2',
      completion: 0,
      levels: [levelCard2],
      title: 'Second discipline'
    });

    const cards = {
      entities: {
        dis1: {
          en: dis1
        },
        dis2: {
          en: dis2
        }
      }
    };
    const mockedStore = createStoreState({
      levels: [level],
      disciplines: [],
      chapters: [],
      slides: [slide, slide],
      progression,
      cards
    });

    const {
      // $FlowFixMe
      currentContent: {universalRef: currentContentUniversalRef},
      // $FlowFixMe
      recommendedContent: {universalRef: recommendedContentUniversalRef}
    } = mapStateToProps(mockedStore);

    expect({currentContentUniversalRef: 'dis1', recommendedContentUniversalRef: 'dis2'}).toEqual({
      currentContentUniversalRef,
      recommendedContentUniversalRef
    });
  });
});
