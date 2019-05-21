// @flow

import type {Middleware, MiddlewareAPI, Dispatch} from 'redux';

import type {Options} from '../_types';
import type {StoreState} from '../store';
import {FETCH_REQUEST, fetchSuccess, fetchError} from '../actions/bundle';
import type {Action} from '../actions/bundle';
import {CARD_TYPE, CONTENT_TYPE} from '../../layer/data/_const';
import type {BundledDiscipline, BundledChapter} from '../../layer/data/_types';
import {getToken, getBrand} from '../utils/state-extract';

type State = StoreState;

const createMiddleware = ({services}: Options): Middleware<State, Action, Dispatch<Action>> => ({
  dispatch,
  getState
}: MiddlewareAPI<State, Action, Dispatch<Action>>) => (
  next: Dispatch<Action>
): Dispatch<Action> => (action: Action) => {
  if (action.type === FETCH_REQUEST) {
    const state = getState();
    const token = getToken(state);
    const brand = getBrand(state);

    const payload = action.payload;
    const {type, ref, languages} = payload;

    if (!ref || !languages || !token || !brand) {
      dispatch(fetchError(type, ref, languages));
    } else {
      Promise.all(
        languages.map(
          async (language): Promise<BundledDiscipline | BundledChapter> => {
            const bundle = await services.Bundle.findById(
              type === CARD_TYPE.COURSE ? CONTENT_TYPE.DISCIPLINE : CONTENT_TYPE.CHAPTER,
              ref,
              language,
              token,
              brand.host
            );
            await services.Bundle.store(bundle, language);

            return bundle;
          }
        )
      )
        .then((bundles: Array<BundledDiscipline | BundledChapter>) => {
          const disciplines = Object.keys(bundles[0].disciplines || {}).reduce(
            (result, key) => ({...result, [key]: languages}),
            {}
          );

          const chapters = Object.keys(bundles[0].chapters).reduce(
            (result, key) => ({...result, [key]: languages}),
            {}
          );

          return dispatch(fetchSuccess(disciplines, chapters));
        })
        .catch(e => {
          return Promise.resolve(dispatch(fetchError(type, ref, languages)));
        });
    }
  }

  return next(action);
};

export default createMiddleware;
