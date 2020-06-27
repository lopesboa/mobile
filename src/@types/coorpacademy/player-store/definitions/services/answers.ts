import { Answer } from '../../../progression-engine';
import { Correction } from '../models';

type FindCorrection = (
    progressionId: string,
    slideId: string,
    givenAnswers: Answer
) => Promise<Correction>;

type AnswersService = {
    findById: FindCorrection;
};

export type { FindCorrection, AnswersService };
