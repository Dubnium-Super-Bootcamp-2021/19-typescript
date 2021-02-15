import { createAction, createReducer, configureStore } from '@reduxjs/toolkit';
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
  CLEAR_ERROR = 'clearError',
}

export const errorAction = createAction<string>(ActionType.ERROR);
export const loadingAction = createAction(ActionType.LOADING);
export const registeredAction = createAction<{
  id: number;
  name: string;
  photo: any;
  bio: string;
}>(ActionType.REGISTERED);
export const removedAction = createAction<number>(ActionType.REMOVED);
export const workersLoadedAction = createAction<
  { id: number; name: string; photo: any; bio: string }[]
>(ActionType.WORKER_LOADED);
export const clearErrorAction = createAction(ActionType.CLEAR_ERROR);

const workerReducer = createReducer(initialState, {
  [ActionType.ERROR]: error,
  [ActionType.LOADING]: loading,
  [ActionType.REGISTERED]: registered,
  [ActionType.REMOVED]: removed,
  [ActionType.WORKER_LOADED]: workersLoaded,
  [ActionType.CLEAR_ERROR]: clearError,
});

export const store$ = configureStore({
  reducer: workerReducer,
  middleware: [thunkMiddleware],
});
