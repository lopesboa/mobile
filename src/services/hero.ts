import type {
  DisciplineCard,
  ChapterCard,
  ContentRecommendation as HeroRecommendation,
} from '../layer/data/_types';
import type {DataLayer} from '../layer/data';
import {getAggregationsByContent} from '../layer/data/progressions';

const isStepGTE3 = (aggregation: HeroRecommendation): boolean => aggregation.nbSlides >= 3;

const isNotFinished = (aggregation: HeroRecommendation): boolean => aggregation.success === false;

const isOnGoing = (aggregation: HeroRecommendation): boolean =>
  isStepGTE3(aggregation) && isNotFinished(aggregation);

export type HeroService = {
  get: () => Promise<DisciplineCard | ChapterCard | void>;
};

const get = (dataLayer: DataLayer): Pick<HeroService, 'get'> => async (): Promise<
  DisciplineCard | ChapterCard | void
> => {
  const {fetchRecommendation, fetchCard} = dataLayer;
  const aggregations = await getAggregationsByContent();
  const ongoingAggregations = aggregations.filter(isOnGoing);
  ongoingAggregations.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  const selectedAggregation = ongoingAggregations[0];

  if (selectedAggregation) {
    return fetchCard(selectedAggregation.content);
  }

  return fetchRecommendation();
};

const service = (dataLayer: DataLayer): HeroService => ({
  get: get(dataLayer),
});

export default service;
