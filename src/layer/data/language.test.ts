import type {SupportedLanguage} from '../../translations/_types';

jest.mock('../../utils/local-token', () => {
  const {createToken} = require('../../__fixtures__/tokens');
  const token = createToken({});

  return {
    get: jest.fn(() => Promise.resolve(token)),
  };
});

jest.mock('../../translations', () => ({
  getInterfaceLanguage: jest.fn(() => 'zh-TW'),
  setLanguage: jest.fn(),
}));

describe('Language', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe('getInterfaceLanguage', () => {
    const translations = require('../../translations');
    const {getInterfaceLanguage} = require('./language');

    const result = getInterfaceLanguage();
    const expected: SupportedLanguage = 'zh-TW';

    // @ts-ignore this function is mocked
    expect(translations.getInterfaceLanguage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expected);
  });

  describe('setLanguage', () => {
    it('should set language', () => {
      const translations = require('../../translations');
      const {setLanguage} = require('./language');

      setLanguage('vi');
      // @ts-ignore this function is mocked
      expect(translations.setLanguage).toHaveBeenCalledTimes(1);
      // @ts-ignore this function is mocked
      expect(translations.setLanguage).toHaveBeenCalledWith('vi');
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
