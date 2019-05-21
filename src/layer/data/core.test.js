// @flow

import {AsyncStorage} from 'react-native';

import disciplinesBundle from '../../__fixtures__/discipline-bundle';
import chaptersBundle from '../../__fixtures__/chapter-bundle';
import {createDiscipline} from '../../__fixtures__/disciplines';
import {createLevel} from '../../__fixtures__/levels';
import {createChapter} from '../../__fixtures__/chapters';
import {createSlide} from '../../__fixtures__/slides';
import {createQCM, createQCMGraphic} from '../../__fixtures__/questions';
import {failureExitNode, successExitNode} from '../../__fixtures__/exit-nodes';
import {fakeError} from '../../utils/tests';
import type {Discipline, BundledDiscipline, BundledChapter} from './_types';
import {CONTENT_TYPE} from './_const';
import {
  buildKeyValuePair,
  normalizeBundle,
  createReduceToNormalizedItemFunction,
  buildKey,
  getItem,
  getItemsPerResourceType,
  filterKeys,
  storeBundle,
  buildLevels,
  mapToResourceType
} from './core';

const token = '__TOKEN__';
const host = '__HOST__';
const qcm = createQCM({});
const qcmGraphic = createQCMGraphic({});
const level = createLevel({ref: 'mod_1', chapterIds: ['cha_1', 'cha_2']});
const disciplineBundle: BundledDiscipline = {
  disciplines: {
    dis_1: createDiscipline({ref: 'dis_1', levels: [level], name: 'Basic course'})
  },
  chapters: {
    cha_1: createChapter({ref: 'cha_1', name: 'Basic chapter 1'}),
    cha_2: createChapter({ref: 'cha_2', name: 'Basic chapter 2'})
  },
  slides: {
    sli_1: createSlide({ref: 'sli_1', chapterId: 'cha_1', question: qcm}),
    sli_2: createSlide({ref: 'sli_2', chapterId: 'cha_1', question: qcmGraphic}),
    sli_3: createSlide({ref: 'sli_3', chapterId: 'cha_2', question: qcm}),
    sli_4: createSlide({ref: 'sli_4', chapterId: 'cha_2', question: qcmGraphic})
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};
const chapterBundle: BundledChapter = {
  chapters: {
    cha_1: createChapter({ref: 'cha_1', name: 'Basic chapter 1'}),
    cha_2: createChapter({ref: 'cha_2', name: 'Basic chapter 2'})
  },
  slides: {
    sli_1: createSlide({ref: 'sli_1', chapterId: 'cha_1', question: qcm}),
    sli_2: createSlide({ref: 'sli_2', chapterId: 'cha_1', question: qcmGraphic}),
    sli_3: createSlide({ref: 'sli_3', chapterId: 'cha_2', question: qcm}),
    sli_4: createSlide({ref: 'sli_4', chapterId: 'cha_2', question: qcmGraphic})
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};
const {disciplines, chapters, slides, exitNodes} = disciplineBundle;

describe('Data Layer Core', () => {
  it('should build the key/value pair', () => {
    const expectedResult = [
      ['chapter:en:cha_1', JSON.stringify(chapters.cha_1)],
      ['chapter:en:cha_2', JSON.stringify(chapters.cha_2)]
    ];

    // $FlowFixMe union type
    const result = buildKeyValuePair(CONTENT_TYPE.CHAPTER, 'en', chapters);
    expect(result).toEqual(expectedResult);
  });

  it('should a chunk of a storable chapters', () => {
    const result = createReduceToNormalizedItemFunction(disciplineBundle, 'en')([], 'chapters');
    const expectedResult = [
      ['chapter:en:cha_1', JSON.stringify(chapters.cha_1)],
      ['chapter:en:cha_2', JSON.stringify(chapters.cha_2)]
    ];

    expect(result).toEqual(expectedResult);
  });

  it('should a chunk of a storable chapters', () => {
    const bundledResourceWithoutDiscipline = {
      ...disciplineBundle,
      disciplines: {}
    };

    const result = createReduceToNormalizedItemFunction(bundledResourceWithoutDiscipline, 'en')(
      [],
      'disciplines'
    );

    const expectedResult = [];

    expect(result).toEqual(expectedResult);
  });

  it('should build for all resources included in the bundle -- with modules', () => {
    const expectedResult = [
      ['discipline:en:dis_1', JSON.stringify(disciplines.dis_1)],
      ['level:en:mod_1', JSON.stringify(disciplines.dis_1.modules[0])],
      ['chapter:en:cha_1', JSON.stringify(chapters.cha_1)],
      ['chapter:en:cha_2', JSON.stringify(chapters.cha_2)],
      ['slide:en:sli_1', JSON.stringify(slides.sli_1)],
      ['slide:en:sli_2', JSON.stringify(slides.sli_2)],
      ['slide:en:sli_3', JSON.stringify(slides.sli_3)],
      ['slide:en:sli_4', JSON.stringify(slides.sli_4)],
      ['exitNode:en:failExitNode', JSON.stringify(exitNodes.failExitNode)],
      ['exitNode:en:successExitNode', JSON.stringify(exitNodes.successExitNode)]
    ];

    const result = normalizeBundle(disciplineBundle, 'en');

    expect(result).toEqual(expectedResult);
  });

  it('should build for all resources included in the bundle -- without modules', () => {
    const disciplineBundleWithoutModules = {
      ...disciplineBundle,
      disciplines: {
        dis_1: {
          ...disciplines.dis_1,
          modules: []
        }
      }
    };

    const expectedResult = [
      ['discipline:en:dis_1', JSON.stringify(disciplineBundleWithoutModules.disciplines.dis_1)],
      ['chapter:en:cha_1', JSON.stringify(chapters.cha_1)],
      ['chapter:en:cha_2', JSON.stringify(chapters.cha_2)],
      ['slide:en:sli_1', JSON.stringify(slides.sli_1)],
      ['slide:en:sli_2', JSON.stringify(slides.sli_2)],
      ['slide:en:sli_3', JSON.stringify(slides.sli_3)],
      ['slide:en:sli_4', JSON.stringify(slides.sli_4)],
      ['exitNode:en:failExitNode', JSON.stringify(exitNodes.failExitNode)],
      ['exitNode:en:successExitNode', JSON.stringify(exitNodes.successExitNode)]
    ];

    const result = normalizeBundle(disciplineBundleWithoutModules, 'en');

    expect(result).toEqual(expectedResult);
  });

  it('should build for all resources included in the bundle -- without discipline', () => {
    // basically this case should never happend in a real business case situation
    const disciplineBundleWithoutModules = {
      ...disciplineBundle,
      disciplines: {}
    };

    const expectedResult = [
      ['chapter:en:cha_1', JSON.stringify(chapters.cha_1)],
      ['chapter:en:cha_2', JSON.stringify(chapters.cha_2)],
      ['slide:en:sli_1', JSON.stringify(slides.sli_1)],
      ['slide:en:sli_2', JSON.stringify(slides.sli_2)],
      ['slide:en:sli_3', JSON.stringify(slides.sli_3)],
      ['slide:en:sli_4', JSON.stringify(slides.sli_4)],
      ['exitNode:en:failExitNode', JSON.stringify(exitNodes.failExitNode)],
      ['exitNode:en:successExitNode', JSON.stringify(exitNodes.successExitNode)]
    ];

    const result = normalizeBundle(disciplineBundleWithoutModules, 'en');

    expect(result).toEqual(expectedResult);
  });

  it('should build the key', () => {
    const resourceType = CONTENT_TYPE.DISCIPLINE;
    const userLanguage = 'en';
    const resourceReference = 'cha_1';

    const expectedResult = `${resourceType}:${userLanguage}:${resourceReference}`;
    expect(buildKey(resourceType, userLanguage, resourceReference)).toBe(expectedResult);
  });

  describe('getItem', () => {
    const resourceType = CONTENT_TYPE.DISCIPLINE;
    const userLanguage = 'en';
    const resourceReference = 'cha_1';

    it('should build the too', () => {
      AsyncStorage.getItem = jest
        .fn()
        .mockImplementation(() => Promise.resolve(JSON.stringify(disciplines.dis_1)));

      const result = getItem(resourceType, userLanguage, resourceReference);
      return expect(result).resolves.toEqual(disciplines.dis_1);
    });

    it('should not build the too', () => {
      AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.reject(fakeError));

      const result = getItem(resourceType, userLanguage, resourceReference);
      return expect(result).rejects.toThrow('Resource not found with ref: cha_1');
    });
  });

  it('should filtred the given array item according to a regex', () => {
    const valueToRetrive = 'chapter:fr:cha_1';
    const keys = ['chapter:en:cha_1', 'discipline:fr:cha_1', valueToRetrive];
    const regex = new RegExp('^chapter:fr:(.+)+', 'gm');
    const result = filterKeys(regex, keys);
    expect(result).toEqual([valueToRetrive]);
  });

  it('should return all the stored resources according to the language and the resourceType', async () => {
    const resources = [
      ['chapter:en:cha_1', JSON.stringify(chapters.cha_1)],
      ['chapter:en:cha_2', JSON.stringify(chapters.cha_2)]
    ];

    AsyncStorage.getAllKeys = jest
      .fn()
      .mockImplementation(() => Promise.resolve(['chapter:en:cha_1', 'chapter:en:cha_2']));

    AsyncStorage.multiGet = jest.fn().mockImplementation(() => Promise.resolve(resources));

    const result = await getItemsPerResourceType(CONTENT_TYPE.CHAPTER, 'en');

    expect(result).toEqual([chapters.cha_1, chapters.cha_2]);
  });

  it('should build the levels', () => {
    // $FlowFixMe bundleResource.discipline is not mixed
    const arrayDisciplines: Array<Discipline> = Object.values(disciplines);
    const discipline: Discipline = arrayDisciplines[0];

    const result: Array<Array<string>> = buildLevels(discipline.modules, 'en');

    const expectedResult = [['level:en:mod_1', JSON.stringify(disciplines.dis_1.modules[0])]];
    expect(result).toEqual(expectedResult);
  });

  it('should transform a levels to a resourceType', () => {
    const rawResourcesType = 'levels';
    const expectedResult = CONTENT_TYPE.LEVEL;
    const result = mapToResourceType(rawResourcesType);
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error if a value is not mappable to a resource type ', () => {
    const rawValue = 'toto';
    const dummyFunction = () => mapToResourceType(rawValue);
    expect(dummyFunction).toThrow(new Error('current type toto not supported'));
  });

  describe('storeBundle', () => {
    it('should store the discipline bundle', async () => {
      AsyncStorage.multiSet = jest.fn().mockImplementation(() => Promise.resolve());
      const result = await storeBundle(disciplineBundle, 'en');
      expect(result).toBeUndefined();
    });

    it('should not store the bundle', () => {
      AsyncStorage.multiSet = jest.fn().mockImplementation(() => Promise.reject(fakeError));
      const result = storeBundle(disciplineBundle, 'en');
      return expect(result).rejects.toThrow(new Error('Could not store the provided resource'));
    });
  });

  describe('fetchBundle', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    AsyncStorage.multiSet = jest.fn().mockImplementation(() => Promise.resolve());

    it('should fetch discipline bundle fixture', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {fetchBundle} = require('./core');
      const keys = Object.keys(disciplinesBundle.disciplines);
      const result = fetchBundle(CONTENT_TYPE.DISCIPLINE, keys[0], 'en', token, host);
      // @todo should be mocked
      return expect(result).resolves.toEqual(disciplinesBundle);
    });

    it('should fetch chapter bundle fixture', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {fetchBundle} = require('./core');
      const keys = Object.keys(chaptersBundle.chapters);
      const result = fetchBundle(CONTENT_TYPE.CHAPTER, keys[0], 'en', token, host);
      return expect(result).resolves.toEqual(chaptersBundle);
    });

    it('should try to fetch discipline bundle', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: false
      }));
      const {fetchBundle} = require('./core');
      jest.mock('cross-fetch');

      const fetch = require('cross-fetch');
      fetch.mockImplementationOnce((url, options) => {
        expect(url).toEqual(
          `${host}/api/v2/disciplines/bundle?lang=en&conditions={"universalRef": ["foobarbaz"]}`
        );
        return Promise.resolve({
          json: () => Promise.resolve(disciplineBundle)
        });
      });

      const result = fetchBundle(CONTENT_TYPE.DISCIPLINE, 'foobarbaz', 'en', token, host);
      return expect(result).resolves.toBe(disciplineBundle);
    });

    it('should try to fetch chapter bundle', () => {
      jest.mock('../../modules/environment', () => ({
        __E2E__: true
      }));
      const {fetchBundle} = require('./core');
      jest.mock('cross-fetch');

      const fetch = require('cross-fetch');
      fetch.mockImplementationOnce((url, options) => {
        expect(url).toEqual(
          `${host}/api/v2/chapters/bundle?lang=en&conditions={"universalRef": ["foobarbaz"]}`
        );
        return Promise.resolve({
          json: () => Promise.resolve(chapterBundle)
        });
      });

      const result = fetchBundle(CONTENT_TYPE.CHAPTER, 'foobarbaz', 'en', token, host);
      return expect(result).resolves.toBe(chapterBundle);
    });

    afterAll(() => {
      jest.resetAllMocks();
    });
  });
});
