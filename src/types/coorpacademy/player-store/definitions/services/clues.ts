import {Clue} from '../models';

export type FindById = (progressionId: string, slideId: string) => Promise<Clue>;
export type CluesService = {
  findById: FindById;
};
