// @flow

import type {Middleware, MiddlewareAPI, Dispatch} from 'redux';

import type {Options} from '../_types';
import type {StoreState} from '../store';
import {FETCH_REQUEST, fetchSuccess, fetchError} from '../actions/discipline-bundle';
import type {Action, FetchRequestPayload} from '../actions/discipline-bundle';
import type {BundledDiscipline} from '../../layer/data/_types';

type State = StoreState;

const createMiddleware = ({services}: Options): Middleware<State, Action, Dispatch<Action>> => ({
  dispatch
}: MiddlewareAPI<State, Action, Dispatch<Action>>) => (
  next: Dispatch<Action>
): Dispatch<Action> => (action: Action) => {
  if (action.type === FETCH_REQUEST) {
    // $FlowFixMe union type
    const payload: FetchRequestPayload = action.payload;
    const {ref, languages} = payload;
    if (!ref || !languages) {
      dispatch(fetchError(ref, languages));
    } else {
      Promise.all(
        languages.map(async language => {
          const disciplineBundle = await services.DisciplineBundle.findById(ref, language);
          await services.DisciplineBundle.store(disciplineBundle, language);

          return disciplineBundle;
        })
      )
        .then((disciplineBundles: Array<BundledDiscipline>) => {
          const disciplines = Object.keys(disciplineBundles[0].disciplines).reduce(
            (result, key) => ({...result, [key]: languages}),
            {}
          );

          const chapters = Object.keys(disciplineBundles[0].chapters).reduce(
            (result, key) => ({...result, [key]: languages}),
            {}
          );

          return dispatch(fetchSuccess(disciplines, chapters));
        })
        .catch(() => {
          dispatch(fetchError(ref, languages));
        });
    }
  }

  return next(action);
};

export default createMiddleware;
