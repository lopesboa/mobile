// @flow
import type {ChapterRule} from '@coorpacademy/player-services';
import translations from '../../translations';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {ChapterRules} from './_types';

export const getChapterRulesByContent = async (
  contentRef: string
): Promise<Array<ChapterRule> | []> => {
  const language = translations.getLanguage();
  // $FlowFixMe flow is going crazy here with Resource type
  const ressource: ChapterRules = await getItem(CONTENT_TYPE.CHAPTER_RULE, language, contentRef);
  return (ressource && ressource.rules) || [];
};

export default {getChapterRulesByContent};
