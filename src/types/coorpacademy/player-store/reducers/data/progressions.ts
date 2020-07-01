import {Progression} from '../../../progression-engine';

export type DataProgressionState = {
  entities: {
    [id: string]: Progression;
  };
};
