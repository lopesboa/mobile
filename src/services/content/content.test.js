// @flow
import disciplineBunlde from '../../__fixtures__/discipline-bundle';
import type {Chapter} from './types';
import {buildKeyValuePair, normalizeDisciplineBundle} from './content';

describe('content Service', () => {
  it('should build the key/value pair', () => {
    const chapters: {[key: string]: Chapter} = disciplineBunlde.chapters;
    const userLanguage = 'en';

    const expectedResult = [
      ['chapters:en:cha_4yiDgZ4cH', JSON.stringify(chapters.cha_4yiDgZ4cH)],
      ['chapters:en:cha_4yoJx~V9r', JSON.stringify(chapters['cha_4yoJx~V9r'])]
    ];

    // $FlowFixMe
    const result = buildKeyValuePair('chapters', userLanguage, chapters);
    expect(result).toEqual(expectedResult);
  });

  it('should build for all resources included in the bundle', () => {
    const userLanguage = 'en';

    const {disciplines, chapters, slides, exitNodes} = disciplineBunlde;

    const expectedResult = [
      ['disciplines:en:dis_4kEB1WE5r', JSON.stringify(disciplines.dis_4kEB1WE5r)],
      ['chapters:en:cha_4yiDgZ4cH', JSON.stringify(chapters.cha_4yiDgZ4cH)],
      ['chapters:en:cha_4yoJx~V9r', JSON.stringify(chapters['cha_4yoJx~V9r'])],
      ['slides:en:sli_415pDBG2r', JSON.stringify(slides.sli_415pDBG2r)],
      ['slides:en:sli_666pDBG2r', JSON.stringify(slides.sli_666pDBG2r)],
      ['exitNodes:en:failExitNode', JSON.stringify(exitNodes.failExitNode)],
      ['exitNodes:en:successExitNode', JSON.stringify(exitNodes.successExitNode)]
    ];

    const result = normalizeDisciplineBundle(disciplineBunlde, userLanguage);

    expect(result).toEqual(expectedResult);
  });
});
