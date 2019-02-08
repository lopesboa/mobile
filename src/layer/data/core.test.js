// @flow

import {AsyncStorage} from 'react-native';

import disciplineBunlde from '../../__fixtures__/discipline-bundle';
import {discipline4y8q7qLLN_withoutModules} from '../../__fixtures__/discipline';
import {fakeError} from '../../utils/tests';
import type {Chapter, Discipline} from './types';
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

describe('Data Layer Core', () => {
  it('should build the key/value pair', () => {
    const chapter: {[key: string]: Chapter} = disciplineBunlde.chapters;
    const userLanguage = 'en';

    const expectedResult = [
      ['chapter:en:cha_4yiDgZ4cH', JSON.stringify(chapter.cha_4yiDgZ4cH)],
      ['chapter:en:cha_4yoJx~V9r', JSON.stringify(chapter['cha_4yoJx~V9r'])]
    ];

    // $FlowFixMe
    const result = buildKeyValuePair(CONTENT_TYPE.CHAPTER, userLanguage, chapter);
    expect(result).toEqual(expectedResult);
  });

  it('should a chunk of a storable chapters', () => {
    const userLanguage = 'en';

    const result = createReduceToNormalizedItemFunction(disciplineBunlde, userLanguage)(
      [],
      'chapters'
    );

    const {chapters} = disciplineBunlde;
    const expectedResult = [
      ['chapter:en:cha_4yiDgZ4cH', JSON.stringify(chapters.cha_4yiDgZ4cH)],
      ['chapter:en:cha_4yoJx~V9r', JSON.stringify(chapters['cha_4yoJx~V9r'])]
    ];

    expect(result).toEqual(expectedResult);
  });

  it('should a chunk of a storable chapters', () => {
    const userLanguage = 'en';

    const bundledResourceWithoutDiscipline = {
      ...disciplineBunlde,
      disciplines: {}
    };

    const result = createReduceToNormalizedItemFunction(
      bundledResourceWithoutDiscipline,
      userLanguage
    )([], 'disciplines');

    const expectedResult = [];

    expect(result).toEqual(expectedResult);
  });

  it('should build for all resources included in the bundle -- with modules', () => {
    const userLanguage = 'en';

    const {disciplines, chapters, slides, exitNodes} = disciplineBunlde;

    const expectedResult = [
      ['discipline:en:dis_4kEB1WE5r', JSON.stringify(disciplines.dis_4kEB1WE5r)],
      ['level:en:mod_NkOL1WE5r', JSON.stringify(disciplines.dis_4kEB1WE5r.modules[0])],
      ['level:en:mod_EJZbe~NqS', JSON.stringify(disciplines.dis_4kEB1WE5r.modules[1])],
      ['chapter:en:cha_4yiDgZ4cH', JSON.stringify(chapters.cha_4yiDgZ4cH)],
      ['chapter:en:cha_4yoJx~V9r', JSON.stringify(chapters['cha_4yoJx~V9r'])],
      ['slide:en:sli_415pDBG2r', JSON.stringify(slides.sli_415pDBG2r)],
      ['slide:en:sli_666pDBG2r', JSON.stringify(slides.sli_666pDBG2r)],
      ['exitNode:en:failExitNode', JSON.stringify(exitNodes.failExitNode)],
      ['exitNode:en:successExitNode', JSON.stringify(exitNodes.successExitNode)]
    ];

    const result = normalizeDisciplineBundle(disciplineBunlde, userLanguage);

    expect(result).toEqual(expectedResult);
  });

  it('should build for all resources included in the bundle -- without modules', () => {
    const userLanguage = 'en';
    const disciplineBundleWithoutModules = {
      ...disciplineBunlde,
      disciplines: {
        dis_4kEB1WE5r: discipline4y8q7qLLN_withoutModules
      }
    };

    const {chapters, slides, exitNodes, disciplines} = disciplineBundleWithoutModules;

    const expectedResult = [
      ['discipline:en:dis_4kEB1WE5r', JSON.stringify(disciplines.dis_4kEB1WE5r)],
      ['chapter:en:cha_4yiDgZ4cH', JSON.stringify(chapters.cha_4yiDgZ4cH)],
      ['chapter:en:cha_4yoJx~V9r', JSON.stringify(chapters['cha_4yoJx~V9r'])],
      ['slide:en:sli_415pDBG2r', JSON.stringify(slides.sli_415pDBG2r)],
      ['slide:en:sli_666pDBG2r', JSON.stringify(slides.sli_666pDBG2r)],
      ['exitNode:en:failExitNode', JSON.stringify(exitNodes.failExitNode)],
      ['exitNode:en:successExitNode', JSON.stringify(exitNodes.successExitNode)]
    ];

    const result = normalizeDisciplineBundle(disciplineBundleWithoutModules, userLanguage);

    expect(result).toEqual(expectedResult);
  });

  it('should build for all resources included in the bundle -- without discipline', () => {
    // basically this case should never happend in a real business case situation
    const userLanguage = 'en';
    const disciplineBundleWithoutModules = {
      ...disciplineBunlde,
      disciplines: {}
    };

    const {chapters, slides, exitNodes} = disciplineBundleWithoutModules;

    const expectedResult = [
      ['chapter:en:cha_4yiDgZ4cH', JSON.stringify(chapters.cha_4yiDgZ4cH)],
      ['chapter:en:cha_4yoJx~V9r', JSON.stringify(chapters['cha_4yoJx~V9r'])],
      ['slide:en:sli_415pDBG2r', JSON.stringify(slides.sli_415pDBG2r)],
      ['slide:en:sli_666pDBG2r', JSON.stringify(slides.sli_666pDBG2r)],
      ['exitNode:en:failExitNode', JSON.stringify(exitNodes.failExitNode)],
      ['exitNode:en:successExitNode', JSON.stringify(exitNodes.successExitNode)]
    ];

    const result = normalizeDisciplineBundle(disciplineBundleWithoutModules, userLanguage);

    expect(result).toEqual(expectedResult);
  });

  it('should build the key', () => {
    const resourceType = CONTENT_TYPE.DISCIPLINE;
    const userLanguage = 'en';
    const resourceReference = 'cha_4yiDgZ4cH';

    const expectedResult = `${resourceType}:${userLanguage}:${resourceReference}`;
    expect(buildKey(resourceType, userLanguage, resourceReference)).toBe(expectedResult);
  });

  describe('getItem', () => {
    const resourceType = CONTENT_TYPE.DISCIPLINE;
    const userLanguage = 'en';
    const resourceReference = 'cha_4yiDgZ4cH';

    it('should build the too', () => {
      const {disciplines} = disciplineBunlde;

      AsyncStorage.getItem = jest
        .fn()
        .mockImplementation(() => Promise.resolve(JSON.stringify(disciplines.dis_4kEB1WE5r)));

      const result = getItem(resourceType, resourceReference, userLanguage);
      expect(result).resolves.toBe(disciplines.dis_4kEB1WE5r);
    });

    it('should not build the too', () => {
      AsyncStorage.getItem = jest.fn().mockImplementation(() => Promise.reject(fakeError));

      const result = getItem(resourceType, resourceReference, userLanguage);
      expect(result).rejects.toThrow('resource not found with cha_4yiDgZ4cH');
    });
  });

  it('should filtred the given array item according to a regex', () => {
    const valueToRetrive = 'chapter:fr:cha_Vy-gSqL8E';
    const keys = ['chapter:en:cha_4yiDgZ4cH', 'discipline:fr:cha_4yiDgZ4cH', valueToRetrive];
    const regex = new RegExp('^chapter:fr:(.+)+', 'gm');
    const result = filterKeys(regex, keys);
    expect(result).toEqual([valueToRetrive]);
  });

  it('should return all the stored resources according to the language and the resourceType', async () => {
    const {chapters} = disciplineBunlde;
    const userLanguage = 'en';

    const resources = [
      ['chapter:en:cha_4yiDgZ4cH', JSON.stringify(chapters.cha_4yiDgZ4cH)],
      ['chapter:en:cha_4yoJx~V9r', JSON.stringify(chapters['cha_4yoJx~V9r'])]
    ];

    AsyncStorage.getAllKeys = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(['chapter:en:cha_4yiDgZ4cH', 'chapter:en:cha_4yoJx~V9r'])
      );

    AsyncStorage.multiGet = jest.fn().mockImplementation(() => Promise.resolve(resources));

    const result = await getItemsPerResourceType(CONTENT_TYPE.CHAPTER, userLanguage);

    expect(result).toEqual([chapters.cha_4yiDgZ4cH, chapters['cha_4yoJx~V9r']]);
  });

  it('should build the levels', () => {
    const {disciplines} = disciplineBunlde;
    // $FlowFixMe bundleResource.discipline is not mixed
    const arrayDisciplines: Array<Discipline> = Object.values(disciplines);
    const discipline: Discipline = arrayDisciplines[0];

    const result: Array<Array<string>> = buildLevels(discipline.modules, 'en');

    const expectedResult = [
      ['level:en:mod_NkOL1WE5r', JSON.stringify(disciplines.dis_4kEB1WE5r.modules[0])],
      ['level:en:mod_EJZbe~NqS', JSON.stringify(disciplines.dis_4kEB1WE5r.modules[1])]
    ];
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
      const result = await storeDisciplineBundle(disciplineBunlde, 'fr');
      expect(result).toBeUndefined();
    });

    it('should not store the discipline bundle', () => {
      AsyncStorage.multiSet = jest.fn().mockImplementation(() => Promise.reject(fakeError));
      const result = storeDisciplineBundle(disciplineBunlde, 'fr');
      expect(result).rejects.toThrow(new Error('could not store the provided bundledResource'));
    });
  });

  it('should fetch discipline', () => {
    AsyncStorage.multiSet = jest.fn().mockImplementation(() => Promise.resolve());
    const dummyFunction = () => fetchDisciplineBundle('fr')();
    expect(dummyFunction).not.toThrow();
  });
});
