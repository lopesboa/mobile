import type {Context, Media} from '../types/coorpacademy/progression-engine';

type Params = {
  title: string;
};

export const mediaContextImage: Media = {
  type: 'img',
  mimeType: 'image/jpeg',
  src: [
    {
      mimeType: 'image/jpeg',
      _id: 'someImage_ID',
      url:
        '//api-staging.coorpacademy.com/api-service/medias?h=400&w=400&q=90&url=http://static.coorpacademy.com/content/CoorpAcademy/content/cockpitRecette-joan/default/corbeau-1501504511632.jpg',
    },
  ],
};

export const mediaContextVideo: Media = {
  type: 'video',
  mimeType: 'application/vimeo',
  src: [
    {
      mimeType: 'application/vimeo',
      url: '//player.vimeo.com/external/85569724.sd.mp4?s=43df5df0d733011263687d20a47557e4',
      _id: 'some_randoMId',
    },
  ],
};

export const mediaContextPDF: Media = {
  _id: 'someContextId',
  type: 'pdf',
  description: 'PDF description',
  mimeType: 'application/pdf',
  mediaUrl:
    '//static.coorpacademy.com/content/CoorpAcademy/content/cockpit-mooc-technique/raw/hierachie-contenu-1494494029567.pdf',
};

export const createContextWithVideo = ({title}: Params): Context => ({
  title,
  description:
    'Lorem ipsum dolor sit amet, vim ad probatus conceptam philosophia. Follow this <a href="https://coorpacademy.com">link</a>.',
  media: {...mediaContextVideo},
});
export const createContextWithPDF = ({title}: Params): Context => ({
  title,
  description:
    'Lorem ipsum dolor sit amet, vim ad probatus conceptam philosophia. Follow this <a href="https://coorpacademy.com">link</a>.',
  media: {...mediaContextPDF},
});
export const createContextWithImage = ({title}: Params): Context => ({
  title,
  description:
    'Lorem ipsum dolor sit amet, vim ad probatus conceptam philosophia. Follow this <a href="https://coorpacademy.com">link</a>.',
  media: {...mediaContextImage},
});

export const createEmptyContext = (): Context => ({
  media: {
    src: [],
    posters: [],
    subtitles: [],
  },
});
