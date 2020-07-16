import type {
  DisciplineCard,
  ChapterCard,
  ContentRecommendation as FinishCourseRecommendation,
} from '../layer/data/_types';
import type {DataLayer} from '../layer/data';
import {getAggregationsByContent} from '../layer/data/progressions';

const isContentStarted = (aggregation: FinishCourseRecommendation): boolean =>
  aggregation.nbSlides >= 1;

const isNotFinished = (aggregation: FinishCourseRecommendation): boolean =>
  aggregation.success === false;

const isOnGoing = (aggregation: FinishCourseRecommendation): boolean =>
  isContentStarted(aggregation) && isNotFinished(aggregation);

export type NotificationContentService = {
  getAllContentByMostRecent: () => Promise<Array<DisciplineCard | ChapterCard | void>>;
};

const getMostRecentContent = (dataLayer: DataLayer) => async () => {
  const {fetchCard} = dataLayer;
  const aggregations = await getAggregationsByContent();
  const ongoingAggregations = aggregations.filter(isOnGoing);
  ongoingAggregations.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  const contents = await Promise.all(
    ongoingAggregations.map((aggregation) => {
      if (!aggregation) return {};
      return fetchCard(aggregation.content);
    }),
  );
  return contents;
};

const service = (dataLayer: DataLayer): NotificationContentService => ({
  getAllContentByMostRecent: getMostRecentContent(dataLayer),
});

export default service;
