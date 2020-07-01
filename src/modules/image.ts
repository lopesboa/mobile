import {PixelRatio, ImageProps} from 'react-native';

import {buildUrlQueryParams} from './uri';

const MEDIAS_API = 'https://api.coorpacademy.com/api-service/medias';

export const getResizedImage = (
  url: string,
  {
    maxWidth,
    maxHeight,
    resizeMode,
  }: {
    maxWidth?: number;
    maxHeight?: number;
    resizeMode?: Pick<ImageProps, 'resizeMode'>;
  },
) => {
  if (!maxWidth && !maxHeight) {
    return url;
  }

  let queryParams = {
    url,
    m: !resizeMode || resizeMode === 'cover' ? 'crop' : 'contain',
    q: 90,
  };

  if (maxWidth) {
    queryParams = {
      ...queryParams,
      w: PixelRatio.getPixelSizeForLayoutSize(maxWidth),
    };
  }

  if (maxHeight) {
    queryParams = {
      ...queryParams,
      h: PixelRatio.getPixelSizeForLayoutSize(maxHeight),
    };
  }

  const queryString = buildUrlQueryParams(queryParams);

  return `${MEDIAS_API}?${queryString}`;
};
