// @flow strict

import {uniqBy} from '.';

describe('Utils', () => {
  it('uniqBy', () => {
    expect(uniqBy(v => v.toString(), [1, 2, 2])).toEqual([1, 2]);
    expect(uniqBy(v => v.toString(), [2, 1, 2])).toEqual([2, 1]);
    expect(uniqBy(v => v, ['A', 'B', 'B'])).toEqual(['A', 'B']);
    expect(uniqBy(v => v, ['B', 'A', 'B'])).toEqual(['B', 'A']);
    expect(uniqBy(v => v.title, [{title: 'A'}, {title: 'B'}, {title: 'B'}])).toEqual([
      {title: 'A'},
      {title: 'B'}
    ]);
    expect(uniqBy(v => v.title, [{title: 'B'}, {title: 'A'}, {title: 'B'}])).toEqual([
      {title: 'B'},
      {title: 'A'}
    ]);
  });
});
