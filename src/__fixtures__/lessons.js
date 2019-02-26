// @flow strict

import type {Lesson} from '../layer/data/_types';
import {RESOURCE_TYPE} from '../const';

export const createVideo = ({
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
  mediaUrl: `//player.vimeo.com/external/303449523.m3u8?s=998d51ae0dfdc40f80faf413bb78f31f7daacee5&oauth2_token_id=41150307`,
  downloadUrl: `//player.vimeo.com/external/303449523.sd.mp4?s=ee82aad8a793d94b289638b4bd8823c30964ba36&profile_id=164&oauth2_token_id=411503075`,
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

export default {
  createVideo,
  createPdf
};
