// @flow strict

import type {Lesson} from '@coorpacademy/progression-engine';

import {RESOURCE_TYPE, VIDEO_PROVIDER_MIME_TYPE} from '../const';
import type {VideoProviderMimeType} from '../types';

export const createVideo = ({
  ref,
  description = 'Des données au service de tous',
  poster = '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/vignette_fabernovel_new-1543482536203.png',
  mimeType = VIDEO_PROVIDER_MIME_TYPE.JWPLAYER,
  videoId = 'KovTu3zU'
}: {
  ref: string,
  description?: string,
  poster?: string,
  mimeType?: VideoProviderMimeType,
  videoId?: string
}): Lesson => ({
  _id: ref,
  poster,
  description,
  videoId,
  mediaRef: 'med_jwp_Vy4JQKFhN',
  // $FlowFixMe @todo change Lesson type in progression engine
  mimeType,
  ref,
  type: RESOURCE_TYPE.VIDEO,
  subtitles: [],
  posters: [],
  src: []
});

export const createVimeoVideo = ({
  ref,
  description = 'Des données au service de tous',
  poster = '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/vignette_fabernovel_new-1543482536203.png'
}: {
  ref: string,
  description?: string,
  poster?: string
}): Lesson => ({
  _id: ref,
  poster,
  description,
  videoId: '303449523',
  mediaRef: 'med_vimeo_Vy4JQKFhN',
  mimeType: 'application/vimeo',
  ref,
  // $FlowFixMe img is not defined in progression-engine
  type: RESOURCE_TYPE.VIDEO,
  subtitles: [],
  posters: [],
  src: []
});

export const createPdf = ({
  ref,
  description = 'Des données au service de tous - PDF',
  poster = '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/image-support-de-cours-1543490353160.jpg'
}: {
  ref: string,
  description?: string,
  poster?: string
}): Lesson => ({
  _id: ref,
  poster,
  description,
  mediaRef: 'med_Vy4JQKFhN',
  mediaUrl:
    '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/raw/fabernovel_data_fr_4a4_des-donnees-au-service-de-tous_vdef-1543484261461.pdf',
  mimeType: 'application/pdf',
  ref,
  // $FlowFixMe img is not defined in progression-engine
  type: RESOURCE_TYPE.PDF,
  subtitles: [],
  posters: [],
  src: []
});

export const createImage = ({
  ref,
  description = 'Des données au service de tous - PDF',
  poster = '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/default/image-support-de-cours-1543490353160.jpg'
}: {
  ref: string,
  description?: string,
  poster?: string
}): Lesson => ({
  _id: ref,
  poster,
  description,
  mediaRef: 'med_Vy4JQKFhN',
  mediaUrl:
    '//static.coorpacademy.com/content/CoorpAcademy/content-partnerships-fabernovel/cockpit-fabernovel/raw/fabernovel_data_fr_4a4_des-donnees-au-service-de-tous_vdef-1543484261461.pdf',
  mimeType: 'application/pdf',
  ref,
  // $FlowFixMe img is not defined in progression-engine
  type: RESOURCE_TYPE.IMG,
  subtitles: [],
  posters: [],
  src: []
});

export default {
  createVideo,
  createPdf,
  createImage
};
