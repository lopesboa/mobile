import {VideoProvider, VideoTrack, VideoTrackType} from '../models';

export type FindUriById = (id: string, provider: VideoProvider) => Promise<string>;
export type FindTracksById = (id: string, type?: VideoTrackType) => Promise<Array<VideoTrack>>;

export type VideosService = {
  findUriById: FindUriById;
  findTracksById: FindTracksById;
};
