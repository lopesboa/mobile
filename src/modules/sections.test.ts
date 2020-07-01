import {createSections} from '../__fixtures__/sections';
import {Section} from '../types';

// @todo remove concat once we have a section creator
const section = createSections()[0];
const emptySection: Section = {
  ...section,
  cardsRef: [],
};

describe('Sections', () => {
  describe('isEmptySection', () => {
    it('should return false', () => {
      const {isEmptySection} = require('./sections');
      const result = isEmptySection(section);
      expect(result).toBeFalsy();
    });

    it('should return true', () => {
      const {isEmptySection} = require('./sections');
      const result = isEmptySection(emptySection);
      expect(result).toBeTruthy();
    });
  });

  describe('getOffsetWithoutCards', () => {
    it('should return the original offset', () => {
      const {getOffsetWithoutCards} = require('./sections');
      const sections = [undefined, undefined, undefined, undefined, undefined, undefined];
      const result = getOffsetWithoutCards(sections, 0);
      const expected = 0;
      expect(result).toEqual(expected);
    });

    it('should increase the offset to bypass empty sections', () => {
      const {getOffsetWithoutCards} = require('./sections');
      const sections = [emptySection, emptySection, undefined, undefined, emptySection, undefined];
      const result = getOffsetWithoutCards(sections, 0);
      const expected = 2;
      expect(result).toEqual(expected);
    });

    it('should increase the offset to bypass empty sections after the first placeholder', () => {
      const {getOffsetWithoutCards} = require('./sections');
      const sections = [
        emptySection,
        emptySection,
        undefined,
        emptySection,
        emptySection,
        undefined,
      ];
      const result = getOffsetWithoutCards(sections, 1);
      const expected = 5;
      expect(result).toEqual(expected);
    });
  });

  describe('getLimitWithoutCards', () => {
    it('should return the default limit', () => {
      const {getLimitWithoutCards} = require('./sections');
      const sections = [undefined, undefined, undefined, undefined, undefined, undefined];
      const result = getLimitWithoutCards(sections, 0, 4);
      const expected = 4;
      expect(result).toEqual(expected);
    });

    it('should increase the limit to bypass empty sections', () => {
      const {getLimitWithoutCards} = require('./sections');
      const sections = [emptySection, undefined, undefined, undefined, emptySection, undefined];
      const result = getLimitWithoutCards(sections, 0, 4);
      const expected = 6;
      expect(result).toEqual(expected);
    });

    it('should return a limit depending to sections length', () => {
      const {getLimitWithoutCards} = require('./sections');
      const sections = [emptySection, undefined];
      const result = getLimitWithoutCards(sections, 0, 4);
      const expected = 2;
      expect(result).toEqual(expected);
    });
  });
});
