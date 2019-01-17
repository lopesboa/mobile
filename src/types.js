// @flow strict

export type MediaType = 'image';

export type Media = {|
  type: MediaType,
  source: File
|};

export type QuestionChoiceItem = {|
  selected?: boolean,
  label: string,
  value: string,
  media?: Media
|};

export type QuestionType = 'qcm' | 'qcmGraphic';

export type SpaceType = 'micro' | 'tiny' | 'small' | 'base' | 'large' | 'xlarge';

export type CardType = 'tip' | 'keyPoint' | 'correction';

export type Answer = string;
export type Question = string;

export type LevelType = 'base' | 'advanced' | 'coach';
