// @flow strict

import type {
  Choice,
  ContentType as ContentTypeBase,
  GenericContent as GenericContentBase
} from '@coorpacademy/progression-engine';

export type QuestionChoiceItem = {|
  ...Choice,
  selected?: boolean
|};

export type ResourceType = 'video' | 'pdf';

export type MimeType =
  | 'video/mp4'
  | 'application/vimeo'
  | 'image/jpeg'
  | 'image/png'
  | 'application/pdf'
  | 'application/vimeo';

export type SpaceType = 'micro' | 'tiny' | 'small' | 'base' | 'large' | 'xlarge';

export type CardType = 'tip' | 'keyPoint' | 'correction';

export type Question = string;

export type Engine = 'learner' | 'microlearning';

export type ContentType = ContentTypeBase | 'discipline' | 'success' | 'failure';

export type GenericContent = $Exact<{|
  ...GenericContentBase,
  type: ContentType
|}>;
