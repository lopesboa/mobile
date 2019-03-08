// @flow

import type {Middleware, MiddlewareAPI, Dispatch} from 'redux';

import type {Options} from '../_types';
import type {StoreState} from '../store';
import {FETCH_REQUEST, fetchSuccess, fetchError} from '../actions/discipline-bundle';
import type {Action} from '../actions/discipline-bundle';
import type {BundledDiscipline} from '../../layer/data/_types';
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

    // $FlowFixMe union type
    const payload: FetchRequestPayload = action.payload;
    const {ref, languages} = payload;
    if (!ref || !languages || !token || !brand) {
      dispatch(fetchError(ref, languages));
    } else {
      Promise.all(
        languages.map(async language => {
          const disciplineBundle = await services.DisciplineBundle.findById(
            ref,
            language,
            token,
            brand.host
          );
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
        .catch(e => {
          return Promise.resolve(dispatch(fetchError(ref, languages)));
        });
    }
  }

  return next(action);
};

export default createMiddleware;
