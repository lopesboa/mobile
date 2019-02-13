// @flow

import type {Middleware, MiddlewareAPI, Dispatch} from 'redux';

import type {Options} from '../_types';
import type {StoreState} from '../store';
import {FETCH_REQUEST, fetchSuccess, fetchError} from '../actions/discipline-bundle';
import type {Action} from '../actions/discipline-bundle';
import type {BundledDiscipline} from '../../layer/data/_types';

type State = StoreState;

const createMiddleware = ({services}: Options): Middleware<State, Action, Dispatch<Action>> => ({
  dispatch
}: MiddlewareAPI<State, Action, Dispatch<Action>>) => (
  next: Dispatch<Action>
): Dispatch<Action> => (action: Action) => {
  const {type, payload} = action;

  if (type === FETCH_REQUEST && payload && payload.ref && payload.languages) {
    Promise.all(
      payload.languages.map(async language => {
        const disciplineBundle = await services.DisciplineBundle.findById(payload.ref, language);
        await services.DisciplineBundle.store(disciplineBundle, language);

        return disciplineBundle;
      })
    )
      .then((disciplineBundles: Array<BundledDiscipline>) => {
        const disciplines = Object.keys(disciplineBundles[0].disciplines).reduce(
          (result, key) => ({...result, [key]: payload.languages}),
          {}
        );

        const chapters = Object.keys(disciplineBundles[0].chapters).reduce(
          (result, key) => ({...result, [key]: payload.languages}),
          {}
        );

        return dispatch(fetchSuccess(disciplines, chapters));
      })
      .catch(() => {
        dispatch(fetchError(payload.ref, payload.languages));
      });
  }

  return next(action);
};

export default createMiddleware;
