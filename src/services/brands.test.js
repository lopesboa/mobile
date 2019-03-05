// @flow strict

import createService from './brands';

describe('Brand service', () => {
  it('find', () => {
    const TOKEN = '__TOKEN__';
    const service = createService();

    return expect(service.find(TOKEN)).resolves.toEqual({
      name: 'mobile',
      baseUrl: 'https://mobile-staging.coorpacademy.com',
      contentCategoryName: 'Mobile'
    });
  });
});
