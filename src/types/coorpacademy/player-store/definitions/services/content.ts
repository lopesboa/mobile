import {Slide} from '../../../progression-engine';
import {Chapter, Level} from '../models';

export type FindContent = (
  type: string,
  ref: string,
  options?: {
    [key: string]: any;
  },
) => Promise<Chapter | Level | Slide | string>;
export type GetInfo = (
  contentRef: string,
  engineRef: string,
  version: string,
) => {nbSlides: number};

export type ContentService = {
  find: FindContent;
  getInfo: GetInfo;
};
