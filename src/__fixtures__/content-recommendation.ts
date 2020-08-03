import type {ContentRecommendation} from '../layer/data/_types';

export const createContentRecommendation = (
  {
    success = true,
    contentRef = 'foo',
    nbSlides = 10,
    updatedAt = '2019-05-23T16:10:38.486Z',
    progressionId,
  }: {
    success?: boolean;
    contentRef?: string;
    nbSlides?: number;
    updatedAt?: string;
    progressionId: string;
  } = {progressionId: 'defaultProgressionId242424'},
): ContentRecommendation => ({
  content: {
    ref: contentRef,
    type: 'chapter',
    version: '1',
  },
  success,
  nbSlides,
  updatedAt,
  progressionId,
});
