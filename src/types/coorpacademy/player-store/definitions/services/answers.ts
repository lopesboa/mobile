import {Answer} from '../../../progression-engine';
import {Correction} from '../models';

export type FindCorrection = (
  progressionId: string,
  slideId: string,
  givenAnswers: Answer,
) => Promise<Correction>;

export type AnswersService = {
  findById: FindCorrection;
};
