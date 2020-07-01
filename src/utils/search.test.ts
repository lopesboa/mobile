import {getAllowedParamsForSearch} from './search';

describe('getAllowedParamsForSearch', () => {
  it('should return only supported params', () => {
    const params = {
      skill: 'skill',
      type: 'coourse',
      search: 'ibm',
      foo: 'bar',
    };

    const expectedResult = {
      skill: 'skill',
      type: 'coourse',
      search: 'ibm',
    };

    const result = getAllowedParamsForSearch(params);
    expect(result).toEqual(expectedResult);
  });
});
