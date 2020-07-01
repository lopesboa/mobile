import {getExitNode} from './exit-nodes';

import {mapToExitNodeAPIExpectedResult} from './mappers.test';

jest.mock('./core', () => {
  const {EXIT_NODE_TYPE} = require('../../layer/data/_const');
  const {createExitNode} = require('../../__fixtures__/exit-nodes');
  const exitNode = createExitNode({type: EXIT_NODE_TYPE.FAILURE});

  return {
    getItem: () => Promise.resolve(exitNode),
    getItemsPerResourceType: () => Promise.resolve([exitNode]),
  };
});

describe('exitNode', () => {
  it('should find the exit node given his ref', async () => {
    const result = await getExitNode('foo');
    expect(result).toEqual(mapToExitNodeAPIExpectedResult);
  });
});
