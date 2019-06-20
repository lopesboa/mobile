// @flow

import {createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';

import {mapStateToProps} from './header-slide-title';

describe('header-slide-title', () => {
  it('should return the accurate props', () => {
    const levelRef = 'dummyRef';
    const progression = createProgression({
      engine: 'microlearning',
      progressionContent: {
        type: 'level',
        ref: levelRef
      }
    });

    const mockedStore = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [],
      progression
    });

    const props = mapStateToProps(mockedStore);
    const expectedResult = {
      image: undefined,
      subtitle: undefined,
      title: undefined
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
