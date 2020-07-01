import {ROLES} from '@coorpacademy/acl';

import {createStoreState, createAuthenticationState} from '../__fixtures__/store';
import {createProgression, createState} from '../__fixtures__/progression';
import {createToken} from '../__fixtures__/tokens';
import {createBrand} from '../__fixtures__/brands';
import {createChapter} from '../__fixtures__/chapters';
import {createSlide} from '../__fixtures__/slides';
import {createQCM} from '../__fixtures__/questions';
import {ENGINE, CONTENT_TYPE} from '../const';
import {mapStateToProps} from './header-slide-right';
import type {ConnectedStateProps} from './header-slide-right';

const chapter = createChapter({ref: 'foo', name: 'Fake chapter'});
const question = createQCM({});
const slide = createSlide({ref: 'bar', chapterId: chapter.universalRef, question});
const nextContent = {
  ref: slide.universalRef,
  type: CONTENT_TYPE.SLIDE,
};
const state = createState({nextContent});
const progression = createProgression({
  engine: ENGINE.MICROLEARNING,
  progressionContent: {
    type: CONTENT_TYPE.CHAPTER,
    ref: chapter.universalRef,
  },
  state,
});
const brand = createBrand({});

describe('header-slide-right', () => {
  it('should return the accurate props', () => {
    const token = createToken({});
    const authentication = createAuthenticationState({token});
    const mockedStore = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [chapter],
      slides: [slide],
      progression,
      authentication,
    });

    const props = mapStateToProps(mockedStore);
    const expectedResult: ConnectedStateProps = {
      count: 4,
      isGodModeUser: false,
      isGodModeEnabled: false,
      isFastSlideEnabled: false,
    };
    expect(props).toEqual(expectedResult);
  });

  it('should hide lives if chapter is undefined', () => {
    const token = createToken({});
    const authentication = createAuthenticationState({token});
    const mockedStore = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [slide],
      progression,
      authentication,
    });

    const props = mapStateToProps(mockedStore);
    const expectedResult: ConnectedStateProps = {
      isGodModeUser: false,
      isGodModeEnabled: false,
      isFastSlideEnabled: false,
    };
    expect(props).toEqual(expectedResult);
  });

  it('should get god mode and fast slide enabled', () => {
    const token = createToken({
      brand: brand.name,
      roles: [ROLES.USER, ROLES.GODMODE],
    });
    const authentication = createAuthenticationState({token, brand});
    const mockedStore = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [slide],
      progression,
      authentication,
      godMode: true,
      fastSlide: true,
    });

    const props = mapStateToProps(mockedStore);
    const expectedResult: ConnectedStateProps = {
      isGodModeUser: true,
      isGodModeEnabled: true,
      isFastSlideEnabled: true,
    };
    expect(props).toEqual(expectedResult);
  });
});
