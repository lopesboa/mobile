import {ContentType} from '../progression-engine';
import {ChapterAPI, LevelAPI, RecommendationAPI} from '.';

export type FindRecommendations = (
  type: ContentType,
  ref: string,
) => Promise<Array<RecommendationAPI>>;
export type GetNextRecommendation = (
  type: ContentType,
  ref: string,
) => Promise<void | ChapterAPI | LevelAPI>;

export type RecommendationsService = {
  find: FindRecommendations;
  getNext: GetNextRecommendation;
};
