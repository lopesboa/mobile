describe('environment', () => {
  beforeEach(async () => {
    await jest.resetModules();
  });

  describe('__E2E__', () => {
    it('should return false', () => {
      const {__E2E__: result} = require('./environment');
      const expected = false;
      expect(result).toEqual(expected);
    });

    it('should return true', () => {
      jest.mock('./version', () => ({
        buildFlavor: 'e2e',
      }));
      const {__E2E__: result} = require('./environment');
      const expected = true;
      expect(result).toEqual(expected);
    });
  });

  describe('__STORYBOOK__', () => {
    it('should return false', () => {
      const {__STORYBOOK__: result} = require('./environment');
      const expected = false;
      expect(result).toEqual(expected);
    });

    it('should return true', () => {
      jest.mock('./version', () => ({
        buildFlavor: 'storybook',
      }));
      const {__STORYBOOK__: result} = require('./environment');
      const expected = true;
      expect(result).toEqual(expected);
    });
  });

  describe('__ADHOC__', () => {
    it('should return false', () => {
      const {__ADHOC__: result} = require('./environment');
      const expected = false;
      expect(result).toEqual(expected);
    });

    it('should return true', () => {
      jest.mock('./version', () => ({
        buildType: 'adhoc',
      }));
      const {__ADHOC__: result} = require('./environment');
      const expected = true;
      expect(result).toEqual(expected);
    });
  });

  describe('__DISTRIBUTION__', () => {
    it('should return false', () => {
      const {__DISTRIBUTION__: result} = require('./environment');
      const expected = false;
      expect(result).toEqual(expected);
    });

    it('should return true', () => {
      jest.mock('./version', () => ({
        buildType: 'distribution',
      }));
      const {__DISTRIBUTION__: result} = require('./environment');
      const expected = true;
      expect(result).toEqual(expected);
    });
  });

  afterEach(async () => {
    await jest.resetAllMocks();
  });
});
