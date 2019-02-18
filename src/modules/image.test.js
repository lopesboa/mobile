// @flow strict

import {getImageDimensions} from './image';
import type {Dimensions} from './image';

describe('Image', () => {
  it('should return original dimensions', () => {
    const result = getImageDimensions(640, 480);
    const expected: Dimensions = {
      width: 640,
      height: 480
    };
    expect(result).toEqual(expected);
  });

  it('should return dimensions with ratio aspect set by width', () => {
    const result = getImageDimensions(640, 480, 400);
    const expected: Dimensions = {
      width: 400,
      height: 300
    };
    expect(result).toEqual(expected);
  });

  it('should return dimensions with ratio aspect set by height and width', () => {
    const result = getImageDimensions(640, 480, 400, 180);
    const expected: Dimensions = {
      width: 240,
      height: 180
    };
    expect(result).toEqual(expected);
  });
});
