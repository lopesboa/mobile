// @flow strict

import type {Section} from '../types';

export const isEmptySection = (section: Section): boolean =>
  section && section.cardsRef !== undefined && section.cardsRef.length === 0;

export const getLimitWithoutCards = (
  sections: Array<Section | void>,
  offset: number,
  limit: number
): number => {
  const nextSections = sections.slice(offset);

  const calculatedLimit = nextSections.reduce((result, _, index) => {
    const sectionsNotEmpty = nextSections
      .slice(0, index)
      .filter(section => !(section && isEmptySection(section)));

    if (sectionsNotEmpty.length < limit) {
      return result + 1;
    }

    return result;
  }, 0);

  return calculatedLimit;
};
