// @flow

import {createStoreState} from '../__fixtures__/store';
import {createLevel} from '../__fixtures__/levels';
import {createProgression} from '../__fixtures__/progression';

import {mapStateToProps} from './header-slide-title';

describe('header-slide-title', () => {
  it('should return the accurate props', () => {
    const levelRef = 'dummyRef';
    const level = createLevel({ref: levelRef, chapterIds: ['666']});
    const progression = createProgression({
      engine: 'microlearning',
      progressionContent: {
        type: 'level',
        ref: levelRef
      }
    });

    const mockedStore = createStoreState({
      levels: [level],
      disciplines: [],
      chapters: [],
      slides: [],
      progression
    });

    const {mediaUrl, levelTranslation, name} = level;
    const props = mapStateToProps(mockedStore);
    const expectedResult = {
      image: mediaUrl,
      subtitle: levelTranslation,
      title: name
    };
    expect(props).toEqual(expectedResult);
  });

  it('should return empty props if the content level is unavailable', () => {
    const progression = createProgression({
      engine: 'microlearning',
      progressionContent: {
        type: 'level',
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
    const props = mapStateToProps(emptyStore);
    const expectedResult = {
      image: undefined,
      subtitle: undefined,
      title: undefined
    };
    expect(expectedResult).toEqual(props);
  });
});
