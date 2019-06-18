// @flow

import {createStoreState} from '../__fixtures__/store';
import {createQCMGraphic} from '../__fixtures__/questions';
import {createSlide} from '../__fixtures__/slides';
import {createProgression} from '../__fixtures__/progression';

import {createContextWithImage} from '../__fixtures__/context';
import {createDisciplineCard, createCardLevel} from '../__fixtures__/cards';
import {mapStateToProps} from './level-end';

describe('level-end', () => {
  it('should have currentContent & recommendation', () => {
    const SlideRef = 'dummySlideRef';
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
        type: 'level',
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

    const dis3 = createDisciplineCard({
      ref: 'dis3',
      completion: 0,
      levels: [levelCard2],
      title: 'Second discipline'
    });

    const catalog = {
      entities: {
        cards: {
          dis1: {
            en: dis1
          },
          dis2: {
            en: dis2
          },
          dis3: {
            en: dis3
          }
        },
        sections: {}
      }
    };
    const mockedStore = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [slide, slide],
      progression,
      catalog,
      data: {
        progressions: {
          entities: {
            progression1: {
              content: {
                type: 'level',
                ref: 'mod_1'
              }
            }
          }
        }
      }
    });

    // $FlowFixMe we don't want to mock the entire props
    const props = mapStateToProps(mockedStore, {
      navigation: {state: {params: {progressionId: 'progression1'}}}
    });

    const currentContentUniversalRef =
      props && props.currentContent && props.currentContent.universalRef;
    const recommendationUniversalRef =
      props && props.recommendation && props.recommendation.universalRef;
    expect({currentContentUniversalRef: 'dis1', recommendationUniversalRef: 'dis2'}).toEqual({
      currentContentUniversalRef,
      recommendationUniversalRef
    });
  });
  it('should have currentContent & nextContent', () => {
    const SlideRef = 'dummySlideRef';
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
        type: 'level',
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
    const levelCard3 = createCardLevel({
      ref: 'mod_2',
      status: 'isActive',
      label: 'Fake level',
      level: 'advanced'
    });
    const dis1 = createDisciplineCard({
      ref: 'dis1',
      completion: 0,
      levels: [levelCard1, levelCard3],
      title: 'First discipline'
    });
    const dis2 = createDisciplineCard({
      ref: 'dis2',
      completion: 0,
      levels: [levelCard2],
      title: 'Second discipline'
    });

    const catalog = {
      entities: {
        cards: {
          dis1: {
            en: dis1
          },
          dis2: {
            en: dis2
          }
        },
        sections: {}
      }
    };
    const mockedStore = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [slide, slide],
      progression,
      catalog,
      data: {
        progressions: {
          entities: {
            progression1: {
              content: {
                type: 'level',
                ref: 'mod_1'
              }
            }
          }
        },
        nextContent: {
          entities: {
            progression1: dis1
          }
        }
      },
      ui: {
        current: {
          progressionId: 'progression1'
        }
      }
    });

    // $FlowFixMe we don't want to mock the entire props
    const props = mapStateToProps(mockedStore, {
      navigation: {state: {params: {progressionId: 'progression1'}}}
    });

    const unlockedLevelInfo = props.unlockedLevelInfo;
    const currentContentUniversalRef =
      props && props.currentContent && props.currentContent.universalRef;
    const nextContentUniversalRef = props && props.nextContent && props.nextContent.universalRef;
    expect({
      currentContentUniversalRef: 'dis1',
      nextContentUniversalRef: 'dis1',
      unlockedLevelInfo: {isUnlocked: false, levelName: ''}
    }).toEqual({
      currentContentUniversalRef,
      nextContentUniversalRef,
      unlockedLevelInfo
    });
  });
});
