// @flow

export type QuestionChoiceItem = {|
  selected?: boolean,
  label: string,
  value: string,
|};

export type QuestionType = 'qcm';

export type SpaceType = 'tiny' | 'small' | 'base' | 'large' | 'xlarge';
