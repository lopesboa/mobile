import { Slide } from '../../../progression-engine';
import { Chapter, Level } from '../models';

type FindContent = (
    type: string,
    ref: string,
    options?: {
        [key: string]: any;
    }
) => Promise<Chapter | Level | Slide | string>;
type GetInfo = (
    contentRef: string,
    engineRef: string,
    version: string
) => { nbSlides: number };

type ContentService = {
    find: FindContent;
    getInfo: GetInfo;
};

export type { GetInfo, ContentService };
