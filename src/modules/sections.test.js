// @flow

import {createSections} from '../__fixtures__/sections';
import type {Section} from '../types';

// @todo remove concat once we have a section creator
const section = createSections()[0];
const emptySection: Section = {
  ...section,
  cardsRef: []
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
