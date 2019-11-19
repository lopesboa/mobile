// @flow strict

import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {middlewares, reducers as storeReducers} from '@coorpacademy/player-store';
import type {ReduxState} from '@coorpacademy/player-store';

import type {State as NavigationState} from './reducers/navigation';
import navigation from './reducers/navigation';
import type {State as CatalogState} from './reducers/catalog';
import resetOnLogout from './utils/reset-on-logout';
import type {State as PermissionsState} from './reducers/permissions';
import type {State as AuthenticationState} from './reducers/authentication';
import type {State as VideoState} from './reducers/video';
import type {State as GodModeState} from './reducers/god-mode';
import type {State as FastSlideState} from './reducers/fast-slide';
import type {State as ErrorsState} from './reducers/ui/errors';
import type {State as SelectState} from './reducers/ui/select';
import catalog from './reducers/catalog';
import authentication from './reducers/authentication';
import permissions from './reducers/permissions';
import video from './reducers/video';
import godMode from './reducers/god-mode';
import fastSlide from './reducers/fast-slide';
import errors from './reducers/ui/errors';
import select from './reducers/ui/select';
import ResetDisplayedProgression from './middlewares/reset-displayed-progression';
import ProgressionsSynchronization from './middlewares/progressions-synchronization';
import UpdateCardOnProgressionUpdate from './middlewares/update-card-on-progression-update';
import ErrorHandler from './middlewares/error-handler';
import type {Options, ReduxDevTools} from './_types';

export type UiState = $PropertyType<ReduxState, 'ui'>;
export type DataState = $PropertyType<ReduxState, 'data'>;
export type StoreState = $Exact<{|
  ...$Exact<ReduxState>,
  navigation: NavigationState,
  catalog: CatalogState,
  authentication: AuthenticationState,
  permissions: PermissionsState,
  video: VideoState,
  errors: ErrorsState<void>,
  select: SelectState,
  godMode: GodModeState,
  fastSlide: FastSlideState
|}>;

const {ErrorLogger, ReduxThunkMemoized} = middlewares;
const {data, ui} = storeReducers;

const reducers = combineReducers({
  data: resetOnLogout(data),
  ui: resetOnLogout(ui),
  errors,
  select,
  navigation,
  catalog: resetOnLogout(catalog),
  authentication: resetOnLogout(authentication),
  permissions,
  video,
  godMode,
  fastSlide
});

const createMiddlewares = (options: Options, reduxDevTools?: ReduxDevTools) => {
  return compose(
    // $FlowFixMe error applying middlewares with multiple types
    applyMiddleware(
      ReduxThunkMemoized(options),
      ErrorLogger(options),
      ResetDisplayedProgression(options),
      ProgressionsSynchronization(options),
      UpdateCardOnProgressionUpdate(options),
      ErrorHandler()
    ),
    // $FlowFixMe
    reduxDevTools || (f => f)
  );
};
const create = (options: Options, reduxDevTools?: ReduxDevTools) =>
  // $FlowFixMe
  createStore(reducers, {}, createMiddlewares(options, reduxDevTools));

export default create;
