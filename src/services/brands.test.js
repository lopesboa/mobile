// @flow strict

import {createBrand} from '../__fixtures__/brands';
import type {DataLayer} from '../layer/data';
import createService from './brands';

describe('Brand service', () => {
  it('find', () => {
    const TOKEN = '__TOKEN__';
    const BRAND = createBrand();

    const fetchBrand = jest.fn();
    fetchBrand.mockImplementationOnce(
      (token => {
        expect(token).toEqual(TOKEN);
        return Promise.resolve(BRAND);
      }: $PropertyType<DataLayer, 'fetchBrand'>)
    );

    // $FlowFixMe
    const service = createService({fetchBrand});

    return expect(service.find(TOKEN)).resolves.toEqual(BRAND);
  });
  it('find with error', () => {
    const TOKEN = '__TOKEN__';

    const fetchBrand = jest.fn();
    fetchBrand.mockImplementationOnce(
      (token => {
        expect(token).toEqual(TOKEN);
        return Promise.reject(new Error());
      }: $PropertyType<DataLayer, 'fetchBrand'>)
    );

    // $FlowFixMe
    const service = createService({fetchBrand});

    return expect(service.find(TOKEN)).rejects.toThrow(new Error());
  });
});
