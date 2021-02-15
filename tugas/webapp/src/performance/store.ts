/**
 * @module store
 */
import {
  createAction,
  createReducer,
  configureStore,
} from '@reduxjs/toolkit';
import { initialState, error, loading, summaryLoaded, Performance, summaryPerformance } from './reducer';
import thunkMiddleware from 'redux-thunk';

enum ActionType {
  LOADING = 'loading',
  ERROR = 'error',
  LOAD_SUMMARY = 'summaryLoaded',
}

export const errorAction = createAction<string>(ActionType.ERROR);
export const loadingAction = createAction<boolean>(ActionType.LOADING);
export const summaryLoadedAction = createAction<summaryPerformance>(ActionType.LOAD_SUMMARY);

const reducer = createReducer(initialState, {
  [ActionType.ERROR]: error,
  [ActionType.LOADING]: loading,
  [ActionType.LOAD_SUMMARY]: summaryLoaded,
});

export const store$ = configureStore({
  reducer,
  middleware: [thunkMiddleware],
});
