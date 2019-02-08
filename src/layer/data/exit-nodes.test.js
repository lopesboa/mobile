// @flow strict

import {failureExitNode} from '../../__fixtures__/exit-nodes';
import {getExitNode} from './exit-nodes';

import {mapToExitNodeAPIExpectedResult} from './mappers.test';

jest.mock('./core', () => {
  const fixtures = require('../../__fixtures__/exit-nodes');
  return {
    getItem: () => Promise.resolve(fixtures.failureExitNode),
    getItemsPerResourceType: () => Promise.resolve([fixtures.failureExitNode])
  };
});

describe('exitNode', () => {
  it('should find the exit node given his ref', async () => {
    const result = await getExitNode('en')(failureExitNode.ref);
    expect(result).toEqual(mapToExitNodeAPIExpectedResult);
  });
});
