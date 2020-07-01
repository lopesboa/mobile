import {ContentType} from '../../../progression-engine';
import {Level, Recommendation} from '../models';

export type FindRecommendations = (
  type: ContentType,
  ref: string,
) => Promise<Array<Recommendation>>;
export type GetNextRecommendation = (type: ContentType, ref: string) => Promise<void | Level>;

export type RecommendationsService = {
  find: FindRecommendations;
  getNext: GetNextRecommendation;
};
