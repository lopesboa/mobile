// @flow
import type {Context, Media} from '@coorpacademy/progression-engine';

type Params = {|
  title: string
|};

export const mediaContextImage: Media = {
  type: 'img',
  mimeType: 'image/jpeg',
  src: [
    {
      mimeType: 'image/jpeg',
      _id: 'someImage_ID',
      url:
        '//api-staging.coorpacademy.com/api-service/medias?h=400&w=400&q=90&url=http://static.coorpacademy.com/content/CoorpAcademy/content/cockpitRecette-joan/default/corbeau-1501504511632.jpg'
    }
  ]
};

export const mediaContextVideo: Media = {
  type: 'video',
  mimeType: 'video/mp4',
  src: [
    {
      mimeType: 'video/mp4',
      url:
        '//player.vimeo.com/external/266296552.m3u8?s=316e71edf867847e1f648655833e41cce19da389&oauth2_token_id=411503075',
      _id: 'some_randoMId'
    }
  ]
};

export const mediaContextPDF: Media = {
  _id: 'someContextId',
  type: 'pdf',
  description: 'PDF description',
  mimeType: 'application/pdf',
  mediaUrl:
    '//static.coorpacademy.com/content/CoorpAcademy/content/cockpit-mooc-technique/raw/hierachie-contenu-1494494029567.pdf'
};

export const createContextWithVideo = ({title}: Params): Context => ({
  title,
  description: 'Lorem ipsum dolor sit amet, vim ad probatus conceptam philosophia. ',
  media: {...mediaContextVideo}
});
export const createContextWithPDF = ({title}: Params): Context => ({
  title,
  description: 'Lorem ipsum dolor sit amet, vim ad probatus conceptam philosophia. ',
  media: {...mediaContextPDF}
});
export const createContextWithImage = ({title}: Params): Context => ({
  title,
  description: 'Lorem ipsum dolor sit amet, vim ad probatus conceptam philosophia. ',
  media: {...mediaContextImage}
});

export const createEmptyContext = (): Context => ({
  media: {
    src: [],
    posters: [],
    subtitles: []
  }
});
