// @flow strict

jest.mock('./chapters', () => {
  const {mapToChapterAPIExpectedResult} = require('./mappers.test');

  return {
    find: () => Promise.resolve([mapToChapterAPIExpectedResult])
  };
});

describe('Recommendation data layer', () => {
  describe('find', () => {
    const {find} = require('./recommendations');

    it('should return recommendations', async () => {
      const result = await find('type', 'ref');
      const recommendation = {
        image:
          '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/dataculture1a4-1542378128060.jpg',
        progress: 1,
        ref: 'cha_1',
        time: '8m',
        title: 'Fake chapter',
        type: 'chapter',
        view: 'grid'
      };
      const expected = [recommendation];

      expect(result).toEqual(expected);
    });
  });
});
