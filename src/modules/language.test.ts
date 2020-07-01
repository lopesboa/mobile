import {DEFAULT_LANGUAGE} from '../translations';
import type {SupportedLanguage} from '../translations/_types';
import {getMatchingLanguage} from './language';

describe('Language', () => {
  describe('getMatchingLanguage', () => {
    const defaultPlatformLanguage = 'de';
    const deviceLanguage: SupportedLanguage = 'zh-TW';

    it('should return exact platform matching language', () => {
      const result = getMatchingLanguage(
        ['zh-TW', 'fr', defaultPlatformLanguage],
        defaultPlatformLanguage,
        deviceLanguage,
      );
      const expected = 'zh-TW';

      expect(result).toEqual(expected);
    });

    it('should return short platform matching language', () => {
      const result = getMatchingLanguage(
        ['zh', 'fr', defaultPlatformLanguage],
        defaultPlatformLanguage,
        deviceLanguage,
      );
      const expected = 'zh';

      expect(result).toEqual(expected);
    });

    it('should return default platform language', () => {
      const result = getMatchingLanguage(
        ['fr', defaultPlatformLanguage],
        defaultPlatformLanguage,
        deviceLanguage,
      );
      const expected = defaultPlatformLanguage;

      expect(result).toEqual(expected);
    });

    it('should return default language', () => {
      const result = getMatchingLanguage(['fr'], defaultPlatformLanguage, deviceLanguage);
      const expected = DEFAULT_LANGUAGE;

      expect(result).toEqual(expected);
    });
  });
});
