// @flow strict

export type QuestionChoiceItem = {|
  selected?: boolean,
  label: string,
  value: string,
  image?: File
|};

export type QuestionType = 'qcm' | 'qcmGraphic';

export type SpaceType = 'tiny' | 'small' | 'base' | 'large' | 'xlarge';

export type MediaType = 'image';

export type Media = {|
  type: MediaType,
  source: File
|};
