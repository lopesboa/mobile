// @flow

import type {Middleware, MiddlewareAPI, Dispatch} from 'redux';

import type {Options} from '../_types';
import type {StoreState} from '../store';
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  SELECT_CARD,
  fetchSuccess,
  fetchError,
  selectCardFailure
} from '../actions/cards';
import {createLevelProgression, createChapterProgression} from '../actions/progression';
import {fetchRequest as fetchDisciplineBundle} from '../actions/discipline-bundle';
import type {Action} from '../actions/cards';
import {CARD_TYPE, RESTRICTED_RESOURCE_TYPE} from '../../layer/data/_const';
import type {Cards, Level, Chapter} from '../../layer/data/_types';

type State = StoreState;

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWM3NTFhYTY4ZjI3MTMwMDFiMzBlMWIzIiwiYnJhbmQiOiJtb2JpbGUiLCJob3N0IjoiaHR0cHM6Ly9tb2JpbGUtc3RhZ2luZy5jb29ycGFjYWRlbXkuY29tIiwiaWF0IjoxNTUxMTc4ODEwLCJleHAiOjIwMDAwMDAwMDAsImF1ZCI6Im1vYmlsZSIsImlzcyI6ImNvb3JwYWNhZGVteS1qd3QifQ.MRRlxll4lX5lel45679Nj-4IDGsVRwybxsUxbrl20Qs';
const HOST = 'https://mobile-staging.coorpacademy.com';

const createMiddleware = ({services}: Options): Middleware<State, Action, Dispatch<Action>> => ({
  dispatch
}: MiddlewareAPI<State, Action, Dispatch<Action>>) => (
  next: Dispatch<Action>
): Dispatch<Action> => (action: Action) => {
  const {type, payload} = action;

  if (type === FETCH_REQUEST) {
    if (!payload || !payload.language) {
      dispatch(fetchError('Invalid payload'));
    } else {
      services.Cards.find(payload.language, HOST, TOKEN)
        .then((result: Cards) => dispatch(fetchSuccess(result, payload.language)))
        .catch(e => {
          dispatch(fetchError(e.toString()));
        });
    }
  } else if (type === FETCH_SUCCESS) {
    if (!payload || !payload.items || !payload.language) {
      dispatch(fetchError('Invalid success payload'));
    } else {
      const courses = payload.items.filter(item => item.type === CARD_TYPE.COURSE);
      courses.forEach(course =>
        // $FlowFixMe union type
        dispatch(fetchDisciplineBundle(course.universalRef, [payload.language]))
      );
    }
  } else if (type === SELECT_CARD) {
    if (!payload || !payload.item) {
      dispatch(selectCardFailure(undefined, 'Invalid payload'));
    } else {
      const item = payload.item;
      switch (item.type) {
        case CARD_TYPE.CHAPTER: {
          // $FlowFixMe union type
          services.Content.find(RESTRICTED_RESOURCE_TYPE.CHAPTER, item.universalRef)
            // $FlowFixMe union type
            .then((chapter: Chapter) => dispatch(createChapterProgression(chapter)))
            .catch(() => {
              dispatch(selectCardFailure(item, 'Chapter progression not created'));
            });
          break;
        }
        case CARD_TYPE.COURSE: {
          const ref = item.modules && item.modules[0] && item.modules[0].universalRef;
          if (!ref) {
            dispatch(selectCardFailure(item, 'Course has no level'));
          }
          // $FlowFixMe union type
          services.Content.find(RESTRICTED_RESOURCE_TYPE.LEVEL, ref)
            // $FlowFixMe union type
            .then((level: Level) => dispatch(createLevelProgression(level)))
            .catch(() => {
              dispatch(selectCardFailure(item, 'Level progression not created'));
            });
          break;
        }
        default:
          dispatch(selectCardFailure(item, 'Unsupported card type'));
      }
    }
  }

  return next(action);
};

export default createMiddleware;
