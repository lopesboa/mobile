import {Slide} from '../../../progression-engine';

export type FindById = (slideId: string) => Promise<Slide>;

export type SlidesService = {
  findById: FindById;
};
