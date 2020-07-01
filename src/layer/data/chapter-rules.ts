import type {ChapterRule} from '../../types/coorpacademy/progression-engine';
import translations from '../../translations';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {ChapterRules} from './_types';

export const getChapterRulesByContent = async (
  contentRef: string,
): Promise<Array<ChapterRule> | []> => {
  const language = translations.getLanguage();
  // @ts-ignore flow is going crazy here with Resource type
  const ressource: ChapterRules = await getItem(CONTENT_TYPE.CHAPTER_RULE, language, contentRef);
  return (ressource && ressource.rules) || [];
};

export default {getChapterRulesByContent};
