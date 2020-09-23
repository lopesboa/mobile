import {ContentType} from '../progression-engine';

export type FindRecommendations = <RecommendationAPI>(
  type: ContentType,
  ref: string,
) => Promise<Array<RecommendationAPI>>;

export type GetNextRecommendation = <ChapterAPI, LevelAPI>(
  type: ContentType,
  ref: string,
) => Promise<void | ChapterAPI | LevelAPI>;

export type RecommendationsService = {
  find: FindRecommendations;
  getNext: GetNextRecommendation;
};
