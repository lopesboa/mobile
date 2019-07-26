// @flow

import {createStoreState} from '../__fixtures__/store';
import {createLevel} from '../__fixtures__/levels';
import {createQCMGraphic} from '../__fixtures__/questions';
import {createSlide} from '../__fixtures__/slides';
import {createProgression} from '../__fixtures__/progression';

import {createContextWithImage} from '../__fixtures__/context';
import {mapStateToProps} from './context';

describe('slide-context', () => {
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
        type: 'slide',
        ref: SlideRef
      },
      state: {
        nextContent: {
          type: 'slide',
          ref: 'dummySlideRef'
        }
      }
    });

    const mockedStore = createStoreState({
      levels: [level],
      disciplines: [],
      chapters: [],
      slides: [slide, slide],
      progression
    });

    const expectedResult = {
      description:
        'Lorem ipsum dolor sit amet, vim ad probatus conceptam philosophia. Follow this <a href="https://coorpacademy.com">link</a>.',
      header: 'A beautifull rainy day',
      hasNoContext: false,
      media: {
        type: 'img',
        mimeType: 'image/jpeg',
        src: [
          {
            _id: 'someImage_ID',
            mimeType: 'image/jpeg',
            url:
              '//api-staging.coorpacademy.com/api-service/medias?h=400&w=400&q=90&url=http://static.coorpacademy.com/content/CoorpAcademy/content/cockpitRecette-joan/default/corbeau-1501504511632.jpg'
          }
        ]
      }
    };
    expect(expectedResult).toEqual(mapStateToProps(mockedStore));
  });

  it('should return empty props if the content there is no context', () => {
    const progression = createProgression({
      engine: 'learner',
      progressionContent: {
        type: 'slide',
        ref: '666'
      }
    });
    const emptyStore = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [],
      progression
    });
    const expectedResult = {
      description: undefined,
      hasNoContext: true,
      header: undefined,
      media: undefined
    };
    expect(expectedResult).toEqual(mapStateToProps(emptyStore));
  });
});
