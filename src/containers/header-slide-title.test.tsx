import {createStoreState} from '../__fixtures__/store';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE} from '../const';
import {mapStateToProps} from './header-slide-title';
import type {ConnectedStateProps} from './header-slide-title';

describe('header-slide-title', () => {
  it('should return the accurate props', () => {
    const levelRef = 'dummyRef';
    const progression = createProgression({
      engine: ENGINE.MICROLEARNING,
      progressionContent: {
        type: CONTENT_TYPE.LEVEL,
        ref: levelRef,
      },
    });

    const mockedStore = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [],
      progression,
    });

    const props = mapStateToProps(mockedStore);
    const expectedResult: ConnectedStateProps = {
      image: undefined,
      subtitle: undefined,
      title: undefined,
    };
    expect(props).toEqual(expectedResult);
  });

  it('should return empty props if the content level is unavailable', () => {
    const progression = createProgression({
      engine: ENGINE.MICROLEARNING,
      progressionContent: {
        type: CONTENT_TYPE.LEVEL,
        ref: '666',
      },
    });
    const emptyStore = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [],
      progression,
    });
    const props = mapStateToProps(emptyStore);
    const expectedResult: ConnectedStateProps = {
      image: undefined,
      subtitle: undefined,
      title: undefined,
    };
    expect(expectedResult).toEqual(props);
  });
});
