import type {QueryParams} from '../../../modules/uri';

export const EDIT = '@@search/EDIT';
export const FETCH = '@@search/FETCH';

type Payload = {
  text?: string;
  params?: QueryParams;
};

export type Action =
  | {
      type: '@@search/TOGGLE';
      payload: boolean;
    }
  | {
      type: '@@search/EDIT';
      payload: Payload;
    }
  | {
      type: '@@search/FETCH';
      payload: boolean;
    };

export const edit = (payload: Payload): Action => ({
  type: EDIT,
  payload,
});

export const fetch = (payload: boolean): Action => ({
  type: FETCH,
  payload,
});
