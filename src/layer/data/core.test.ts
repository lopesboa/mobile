import AsyncStorage from '@react-native-community/async-storage';

import {createDiscipline} from '../../__fixtures__/disciplines';
import {createLevel} from '../../__fixtures__/levels';
import {createChapter} from '../../__fixtures__/chapters';
import {createSlide} from '../../__fixtures__/slides';
import {createQCM, createQCMGraphic} from '../../__fixtures__/questions';
import {createExitNode} from '../../__fixtures__/exit-nodes';
import {fakeError} from '../../utils/tests';
import type {BundledDiscipline} from './_types';
import {CONTENT_TYPE, EXIT_NODE_TYPE} from './_const';
import {buildKey, getItem, getItemsPerResourceType, filterKeys} from './core';

const failureExitNode = createExitNode({type: EXIT_NODE_TYPE.FAILURE});
const successExitNode = createExitNode({type: EXIT_NODE_TYPE.SUCCESS});
const qcm = createQCM({});
const qcmGraphic = createQCMGraphic({});
const level = createLevel({ref: 'mod_1', chapterIds: ['cha_1', 'cha_2']});
const disciplineBundle: BundledDiscipline = {
  disciplines: {
    dis_1: createDiscipline({ref: 'dis_1', levels: [level], name: 'Basic course'}),
  },
  chapters: {
    cha_1: createChapter({ref: 'cha_1', name: 'Basic chapter 1'}),
    cha_2: createChapter({ref: 'cha_2', name: 'Basic chapter 2'}),
  },
  slides: {
    sli_1: createSlide({ref: 'sli_1', chapterId: 'cha_1', question: qcm}),
    sli_2: createSlide({ref: 'sli_2', chapterId: 'cha_1', question: qcmGraphic}),
    sli_3: createSlide({ref: 'sli_3', chapterId: 'cha_2', question: qcm}),
    sli_4: createSlide({ref: 'sli_4', chapterId: 'cha_2', question: qcmGraphic}),
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode,
  },
  chapterRules: {},
};

const {disciplines, chapters} = disciplineBundle;

describe('Data Layer Core', () => {
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
    const regex = /^chapter:fr:(.+)+/gm;
    const result = filterKeys(regex, keys);
    expect(result).toEqual([valueToRetrive]);
  });

  it('should return all the stored resources according to the language and the resourceType', async () => {
    const resources = [
      ['chapter:en:cha_1', JSON.stringify(chapters.cha_1)],
      ['chapter:en:cha_2', JSON.stringify(chapters.cha_2)],
    ];

    AsyncStorage.getAllKeys = jest
      .fn()
      .mockImplementation(() => Promise.resolve(['chapter:en:cha_1', 'chapter:en:cha_2']));

    AsyncStorage.multiGet = jest.fn().mockImplementation(() => Promise.resolve(resources));

    const result = await getItemsPerResourceType(CONTENT_TYPE.CHAPTER, 'en');

    expect(result).toEqual([chapters.cha_1, chapters.cha_2]);
  });
});
