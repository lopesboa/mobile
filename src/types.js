// @flow strict

import type {
  ContentType as ContentTypeBase,
  GenericContent as GenericContentBase,
  Lesson
} from '@coorpacademy/progression-engine';

export type QuestionChoiceInputType = 'text' | 'select';

export type MimeType =
  | 'video/mp4'
  | 'application/vimeo'
  | 'image/jpeg'
  | 'image/png'
  | 'application/pdf'
  | 'application/vimeo';

export type SpaceType = 'micro' | 'tiny' | 'small' | 'base' | 'medium' | 'large' | 'xlarge';

export type CardType = 'tip' | 'keyPoint' | 'correction' | 'resource';

export type CardDisplayMode = 'card' | 'cover';

export type AuthorType = 'coorp' | 'verified' | 'custom' | 'marketplace';

export type AnimationType = 'in' | 'out';

export type Question = string;

export type Engine = 'learner' | 'microlearning';

export type ContentType = ContentTypeBase | 'discipline' | 'success' | 'failure' | 'node';

export type Resource = {|
  ...Lesson,
  url: string
|};

export type SliderProps = {|
  minValue?: number,
  minLabel?: string,
  maxValue?: number,
  maxLabel?: string,
  step?: number,
  value?: number
|};

export type GenericContent = $Exact<{|
  ...GenericContentBase,
  type: ContentType
|}>;

export type Progression = {|
  current: number,
  count: number
|};

export type Brand = {|
  name: string,
  host: string,
  contentCategoryName: string,
  colors: {
    primary: string
  },
  images: {
    'logo-mobile': string
  }
|};

export type PermissionStatus = 'authorized' | 'denied' | 'restricted' | 'undetermined';

export type AppState = 'active' | 'background' | 'inactive';
