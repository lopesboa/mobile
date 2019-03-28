// @flow strict
import type {State as CardsState} from '../redux/reducers/cards';
import type {SupportedLanguage} from '../translations/_types';
import type {DisciplineCard, ChapterCard, CardLevel} from '../layer/data/_types';
import {CARD_TYPE, RESTRICTED_RESOURCE_TYPE} from '../layer/data/_const';
import type {UnlockedLevelInfo} from '../types';

type ContentInfo = {|
  type: string,
  ref: string,
  version?: string
|};

type Card = DisciplineCard | ChapterCard;

const values = <K, O>(obj: {[key: K]: O}): Array<O> => Object.keys(obj).map(k => obj[k]);

export const getCurrentContent = (
  cardsState: CardsState,
  {ref, type}: ContentInfo,
  language: SupportedLanguage
): Card | void => {
  const cards = values(cardsState.entities).map(
    (o: $Values<$PropertyType<CardsState, 'entities'>>) => o[language]
  );
  switch (type) {
    case RESTRICTED_RESOURCE_TYPE.LEVEL: {
      return cards.find(card => {
        if (card && card.type !== CARD_TYPE.COURSE) return false;
        const module_ = card.modules.find(
          module__ =>
            (module__ && module__.ref === ref) || (module__ && module__.universalRef === ref)
        );
        return !!module_;
      });
    }
    case RESTRICTED_RESOURCE_TYPE.CHAPTER: {
      return cards.find(card => {
        if (card && card.type !== CARD_TYPE.CHAPTER) return false;
        return (card && card.ref === ref) || (card && card.universalRef === ref);
      });
    }
    default: {
      return;
    }
  }
};

const getModule = (modules, moduleRef): CardLevel => {
  // $FlowFixMe
  return modules.find(mod => mod.ref === moduleRef || mod.universalRef === moduleRef);
};

export const didUnlockLevel = (
  {ref, type}: ContentInfo,
  currentContent: Card,
  nextContent: Card
): UnlockedLevelInfo | void => {
  if (nextContent) {
    if (type === RESTRICTED_RESOURCE_TYPE.LEVEL) {
      // $FlowFixMe
      const currentContentModules = currentContent && currentContent.modules;

      const currentModule = getModule(currentContent && currentContentModules, ref);
      const index = currentContentModules.indexOf(currentModule) + 1;
      if (index >= currentContentModules.length) {
        throw new Error('No next level');
      }
      // $FlowFixMe
      const nextModule = nextContent && nextContent.modules[index];
      const currentModuleLevel = currentModule && currentModule.level;
      const nextModuleLevel = nextModule && nextModule.level;
      if (currentModuleLevel === nextModuleLevel) {
        return {isUnlocked: false, levelName: nextModuleLevel};
      }
      return {isUnlocked: true, levelName: nextModuleLevel};
    }
    return;
  }
  return {isUnlocked: false, levelName: ''};
};

export const uniqBy = <O>(mapper: (obj: O) => string, array: Array<O>): Array<O> => [
  ...array
    .reduce((acc, cur) => {
      const key = mapper(cur);
      if (!acc.has(key)) acc.set(key, cur);
      return acc;
    }, new Map())
    .values()
];
