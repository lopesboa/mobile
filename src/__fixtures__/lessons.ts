import type {Lesson, VideoMimeType} from '../types/coorpacademy/progression-engine';

import {RESOURCE_TYPE, RESOURCE_MIME_TYPE, VIDEO_MIME_TYPE} from '../const';

export const createVideo = ({
  ref,
  description = 'Des données au service de tous',
  poster = '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/vignette_fabernovel_new-1543482536203.png',
  videoId = 'KovTu3zU',
}: {
  ref: string;
  description?: string;
  poster?: string;
  mimeType?: VideoMimeType;
  videoId?: string;
}): Lesson => ({
  _id: ref,
  poster,
  description,
  videoId,
  mediaRef: 'med_jwp_Vy4JQKFhN',
  mimeType: VIDEO_MIME_TYPE.JWPLAYER,
  ref,
  type: RESOURCE_TYPE.VIDEO,
  subtitles: [],
  posters: [],
  src: [],
});

export const createVideoYoutube = ({
  ref,
  description = 'Des données au service de tous',
  poster = '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/vignette_fabernovel_new-1543482536203.png',
}: {
  ref: string;
  description?: string;
  poster?: string;
}): Lesson => ({
  _id: ref,
  poster,
  description,
  videoId: '5qap5aO4i9A',
  mediaRef: 'med_youtube_Vy4JQKFhN',
  mimeType: VIDEO_MIME_TYPE.YOUTUBE,
  ref,
  type: RESOURCE_TYPE.VIDEO,
  subtitles: [],
  posters: [],
  src: [],
});

export const createVideoOmniPlayer = ({
  ref,
  description = 'Des données au service de tous',
  poster = '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/vignette_fabernovel_new-1543482536203.png',
}: {
  ref: string;
  description?: string;
  poster?: string;
}): Lesson => ({
  _id: ref,
  poster,
  description,
  videoId: '5e6126fdbe444d66709afab1',
  mediaRef: 'med_omniPlayer_Vy4JQKFhN',
  mimeType: VIDEO_MIME_TYPE.OMNIPLAYER,
  ref,
  type: RESOURCE_TYPE.VIDEO,
  subtitles: [],
  posters: [],
  src: [],
});

export const createVimeoVideo = ({
  ref,
  description = 'Des données au service de tous',
  poster = '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/vignette_fabernovel_new-1543482536203.png',
}: {
  ref: string;
  description?: string;
  poster?: string;
}): Lesson => ({
  _id: ref,
  poster,
  description,
  videoId: '303449523',
  mediaRef: 'med_vimeo_Vy4JQKFhN',
  mimeType: VIDEO_MIME_TYPE.VIMEO,
  ref,
  type: RESOURCE_TYPE.VIDEO,
  subtitles: [],
  posters: [],
  src: [],
});

export const createPdf = ({
  ref,
  description = 'Des données au service de tous - PDF',
  poster = '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/image-support-de-cours-1543490353160.jpg',
}: {
  ref: string;
  description?: string;
  poster?: string;
}): Lesson => ({
  _id: ref,
  poster,
  description,
  mediaRef: 'med_Vy4JQKFhN',
  mediaUrl:
    '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/raw/fabernovel_data_fr_4a4_des-donnees-au-service-de-tous_vdef-1543484261461.pdf',
  mimeType: RESOURCE_MIME_TYPE.PDF,
  ref,
  type: RESOURCE_TYPE.PDF,
  subtitles: [],
  posters: [],
  src: [],
});

export const createImage = ({
  ref,
  description = 'Des données au service de tous - PDF',
  poster = '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/image-support-de-cours-1543490353160.jpg',
}: {
  ref: string;
  description?: string;
  poster?: string;
}): Lesson => ({
  _id: ref,
  poster,
  description,
  mediaRef: 'med_Vy4JQKFhN',
  mediaUrl:
    '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/raw/fabernovel_data_fr_4a4_des-donnees-au-service-de-tous_vdef-1543484261461.pdf',
  mimeType: RESOURCE_MIME_TYPE.PDF,
  ref,
  type: RESOURCE_TYPE.IMG,
  subtitles: [],
  posters: [],
  src: [],
});

export default {
  createVideo,
  createPdf,
  createImage,
};
