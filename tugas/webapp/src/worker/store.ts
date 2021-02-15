import {
  createAction,
  createReducer,
  configureStore,
} from '@reduxjs/toolkit';
import {
  WorkerInterface,
  initialState,
  error,
  loading,
  registered,
  removed,
  workersLoaded,
  clearError,
} from './reducer';
import thunkMiddleware from 'redux-thunk';

enum ActionType {
  ERROR = 'error',
  LOADING = 'loading',
  REGISTERED = 'registered',
  REMOVED = 'removed',
  WORKER_LOADED = 'workersLoaded',
  CLEAR_ERROR = 'clearError'
}


export const errorAction = createAction<WorkerInterface>(ActionType.ERROR);
export const loadingAction = createAction<WorkerInterface>(ActionType.LOADING);
export const registeredAction = createAction<WorkerInterface>(ActionType.REGISTERED);
export const removedAction = createAction<WorkerInterface>(ActionType.REMOVED);
export const workersLoadedAction = createAction<WorkerInterface>(ActionType.WORKER_LOADED);
export const clearErrorAction = createAction<WorkerInterface>(ActionType.CLEAR_ERROR);

const reducer = createReducer(initialState, {
  [ActionType.ERROR]: error,
  [ActionType.LOADING]: clearError,
  [ActionType.REGISTERED]: loading,
  [ActionType.REMOVED]: registered,
  [ActionType.WORKER_LOADED]: removed,
  [ActionType.CLEAR_ERROR]: workersLoaded,
});

export const store$ = configureStore({
  reducer,
  middleware: [thunkMiddleware],
});
