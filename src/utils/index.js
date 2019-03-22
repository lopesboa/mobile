// @flow strict
import type {State as CardsState} from '../redux/reducers/cards';
import type {SupportedLanguage} from '../translations/_types';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {CARD_TYPE, RESTRICTED_RESOURCE_TYPE} from '../layer/data/_const';

type ContentInfo = {|
  type: string,
  ref: string,
  version?: string
|};

const values = <K, O>(obj: {[key: K]: O}): Array<O> => Object.keys(obj).map(k => obj[k]);

export const getCurrentContent = (
  cardsState: CardsState,
  {ref, type}: ContentInfo,
  language: SupportedLanguage
): DisciplineCard | ChapterCard | void => {
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

export const uniqBy = <O>(mapper: (obj: O) => string, array: Array<O>): Array<O> => [
  ...array
    .reduce((acc, cur) => {
      const key = mapper(cur);
      if (!acc.has(key)) acc.set(key, cur);
      return acc;
    }, new Map())
    .values()
];
