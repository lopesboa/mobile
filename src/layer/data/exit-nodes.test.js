// @flow strict

import {failureExitNode} from '../../__fixtures__/exit-nodes';
import {getExitNode} from './exit-nodes';

import {mapToExitNodeAPIExpectedResult} from './mappers.test';

jest.mock('./core', () => {
  const {failureExitNode: exitNode} = require('../../__fixtures__/exit-nodes');

  return {
    getItem: () => Promise.resolve(exitNode),
    getItemsPerResourceType: () => Promise.resolve([exitNode])
  };
});

describe('exitNode', () => {
  it('should find the exit node given his ref', async () => {
    const result = await getExitNode('en')(failureExitNode.ref);
    expect(result).toEqual(mapToExitNodeAPIExpectedResult);
  });
});
