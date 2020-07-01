import {Section} from '../types';

export const isEmptySection = (section: Section): boolean =>
  section && section.cardsRef !== undefined && section.cardsRef.length === 0;

export const getOffsetWithoutCards = (sections: Array<Section | void>, offset: number): number => {
  const calculatedOffset = sections.reduce((result, _, index) => {
    const sectionsRange = sections.slice(0, index);
    const sectionsNotEmpty = sectionsRange.filter(
      (section) => !(section && isEmptySection(section)),
    );
    const lastSection = sectionsRange[sectionsRange.length - 1];
    const isLastSectionEmpty = lastSection && isEmptySection(lastSection);

    if (
      sectionsNotEmpty.length < offset ||
      (sectionsNotEmpty.length === offset && isLastSectionEmpty)
    ) {
      return result + 1;
    }

    return result;
  }, 0);

  return calculatedOffset;
};

export const getLimitWithoutCards = (
  sections: Array<Section | void>,
  offset: number,
  limit: number,
): number => {
  const nextSections = sections.slice(offset);

  const calculatedLimit = nextSections.reduce((result, _, index) => {
    const sectionsNotEmpty = nextSections
      .slice(0, index)
      .filter((section) => !(section && isEmptySection(section)));

    if (sectionsNotEmpty.length < limit) {
      return result + 1;
    }

    return result;
  }, 0);

  return calculatedLimit;
};
