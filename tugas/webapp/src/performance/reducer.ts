/**
 * @module reducer
 */
export interface Performance {
  loading: boolean;
  error: string | null;
  summary: summaryPerformance;
}

export interface summaryPerformance {
  total_task: number;
  task_done: number;
  task_cancelled: number;
  total_worker: number;
}

interface ActionObject {
  type: string;
}

interface ActionError extends ActionObject {
  payload: string;
}

type ActionObjectLoadPerformance = {
  payload: summaryPerformance;
};

// setup state
export const initialState: Performance = {
  loading: false,
  error: null,
  summary: {
    total_task: 0,
    task_done: 0,
    task_cancelled: 0,
    total_worker: 0,
  },
};

export function loading(state: Performance): void {
  state.loading = true;
  state.error = null;
}

export function error(state: Performance, action: ActionError): void {
  state.loading = false;
  state.error = action.payload;
}

export function summaryLoaded(state: Performance, action: ActionObjectLoadPerformance ): Performance {
  state.summary = action.payload;
  state.loading = false;
  state.error = null;
  return state;
}

