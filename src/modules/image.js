// @flow strict

export type Dimensions = {|
  width: number,
  height: number
|};

export const getImageDimensions = (
  originalWidth: number,
  originalHeight: number,
  width?: number,
  maxHeight?: number
): Dimensions => {
  if (!width) {
    return {
      width: originalWidth,
      height: originalHeight
    };
  }

  let calculatedWidth = width;
  let calculatedHeight = originalHeight * (width / originalWidth);

  if (maxHeight && calculatedHeight > maxHeight) {
    calculatedHeight = maxHeight;
    calculatedWidth = originalWidth * (maxHeight / originalHeight);
  }

  return {
    width: calculatedWidth,
    height: calculatedHeight
  };
};
