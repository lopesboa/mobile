// @flow

import {AsyncStorage} from 'react-native';

import basicCourse from '../../__fixtures__/discipline-bundle/basic';
import adaptiveCourse from '../../__fixtures__/discipline-bundle/adaptive';
import noClueCourse from '../../__fixtures__/discipline-bundle/no-clue';
import withContextCourse from '../../__fixtures__/discipline-bundle/with-context';
import onboardingCourse from '../../__fixtures__/onboarding-course';
import bescherelleCourse from '../../__fixtures__/bescherelle-course';
import {createDiscipline} from '../../__fixtures__/disciplines';
import {createLevel} from '../../__fixtures__/levels';
import {createChapter} from '../../__fixtures__/chapters';
import {createSlide} from '../../__fixtures__/slides';
import {createQCM, createQCMGraphic} from '../../__fixtures__/questions';
import {failureExitNode, successExitNode} from '../../__fixtures__/exit-nodes';
import {fakeError} from '../../utils/tests';
import type {Discipline, BundledDiscipline} from './_types';
import {CONTENT_TYPE} from './_const';
import {
  buildKeyValuePair,
  normalizeDisciplineBundle,
  createReduceToNormalizedItemFunction,
  buildKey,
  getItem,
  getItemsPerResourceType,
  filterKeys,
  storeDisciplineBundle,
  fetchDisciplineBundle,
  buildLevels,
  mapToResourceType
} from './core';

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

    const result = normalizeDisciplineBundle(disciplineBundle, 'en');

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

    const result = normalizeDisciplineBundle(disciplineBundleWithoutModules, 'en');

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

    const result = normalizeDisciplineBundle(disciplineBundleWithoutModules, 'en');

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

      const result = getItem(resourceType, resourceReference, userLanguage);
      expect(result).resolves.toBe(disciplines.dis_1);
    });

    it('should not build the too', () => {
      AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.reject(fakeError));

      const result = getItem(resourceType, resourceReference, userLanguage);
      expect(result).rejects.toThrow('resource not found with cha_1');
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

  describe('storeDisciplineBundle', () => {
    it('should store the discipline bundle', async () => {
      AsyncStorage.multiSet = jest.fn().mockImplementation(() => Promise.resolve());
      const result = await storeDisciplineBundle(disciplineBundle, 'fr');
      expect(result).toBeUndefined();
    });

    it('should not store the discipline bundle', () => {
      AsyncStorage.multiSet = jest.fn().mockImplementation(() => Promise.reject(fakeError));
      const result = storeDisciplineBundle(disciplineBundle, 'fr');
      expect(result).rejects.toThrow(new Error('could not store the provided bundledResource'));
    });
  });

  describe('fetchDisciplineBundle', () => {
    AsyncStorage.multiSet = jest.fn().mockImplementation(() => Promise.resolve());

    it('should fetch basic', () => {
      const result = fetchDisciplineBundle('fixtures_basic', 'fr');
      // @todo should be mocked
      expect(result).resolves.toBe(basicCourse);
    });

    it('should fetch adaptive', () => {
      const result = fetchDisciplineBundle('fixtures_adaptive', 'fr');
      // @todo should be mocked
      expect(result).resolves.toBe(adaptiveCourse);
    });

    it('should fetch no clue', () => {
      const result = fetchDisciplineBundle('fixtures_no_clue', 'fr');
      // @todo should be mocked
      expect(result).resolves.toBe(noClueCourse);
    });

    it('should fetch context', () => {
      const result = fetchDisciplineBundle('fixtures_with_context', 'fr');
      // @todo should be mocked
      expect(result).resolves.toBe(withContextCourse);
    });

    it('should fetch onboarding', () => {
      const result = fetchDisciplineBundle('fixtures_onboarding', 'fr');
      // @todo should be mocked
      expect(result).resolves.toBe(onboardingCourse);
    });
    it('should fetch bescherelle', () => {
      const result = fetchDisciplineBundle('fixtures_bescherelle', 'fr');
      // @todo should be mocked
      expect(result).resolves.toBe(bescherelleCourse);
    });

    it('should trigger error', () => {
      const result = fetchDisciplineBundle('foobarbaz', 'fr');
      expect(result).rejects.toThrow(new Error('API fetching not supported yet.'));
    });
  });
});
