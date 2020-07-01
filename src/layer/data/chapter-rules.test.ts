import {getChapterRulesByContent} from './chapter-rules';

jest.mock('./core', () => {
  const {createChapterRules} = require('../../__fixtures__/chapter-rules');

  return {
    getItem: (type, language, ref) => {
      if (ref === 'ref_chapter_1') {
        return Promise.resolve(undefined);
      }

      const fakeRule = createChapterRules({chapterRef: 'ref_chapter'});
      return Promise.resolve(fakeRule);
    },
  };
});

describe('getChapterRulesByContent', () => {
  it('should get Chapter Rules by content', async () => {
    const {createChapterRules} = require('../../__fixtures__/chapter-rules');
    const result = await getChapterRulesByContent('ref_chapter');
    const rules = createChapterRules({chapterRef: 'ref_chapter'}).rules;

    expect(result).toEqual(rules);
  });

  it('should get an empty array if there is no chapter rules for content', async () => {
    const result = await getChapterRulesByContent('ref_chapter_1');
    expect(result).toEqual([]);
  });
});
