import type {Answer} from '../types/coorpacademy/progression-engine';

export const createAnswer = ({values}: {values?: Answer}): Answer =>
  values || [
    'Lorem Elsass ipsum',
    'Chulia Roberstau',
    'Miss Dahlias vulputate salu barapli schnaps blottkopf',
  ];
