import { SERVICE_BASEURL } from './config';

export interface WorkerInterface {
  loading: boolean;
  error: string | null;
  workers: { id: number; name: string; photo: any; bio: string }[];
}

interface ActionObjectError extends WorkerInterface {
  payload: string;
}

interface ActionObjectRegistered extends WorkerInterface {
  payload: { id: number; name: string; photo: string; bio: string };
}

interface ActionObjectRemoved extends WorkerInterface {
  payload: number;
}

interface ActionObjectLoaded extends WorkerInterface {
  payload: { id: number; name: string; photo: string; bio: string }[];
}

// setup state
export const initialState: WorkerInterface = {
  loading: false,
  error: null,
  workers: [],
};

export function loading(state: WorkerInterface): void {
  state.loading = true;
  state.error = null;
}

export function error(state: WorkerInterface, action: ActionObjectError): void {
  state.loading = false;
  state.error = action.payload;
}

export function clearError(state: WorkerInterface): void {
  state.error = null;
}

export function registered(
  state: WorkerInterface,
  action: ActionObjectRegistered
): WorkerInterface {
  const worker = action.payload;
  state.workers.push({
    id: worker.id,
    name: worker.name,
    photo: `${SERVICE_BASEURL}/photo/${worker.photo}`,
    bio: worker.bio,
  });
  state.loading = false;
  state.error = null;
  return state;
}

export function removed(
  state: WorkerInterface,
  action: ActionObjectRemoved
): WorkerInterface {
  const idx = state.workers.findIndex((t) => t.id === action.payload);
  state.workers.splice(idx, 1);
  state.loading = false;
  state.error = null;
  return state;
}

export function workersLoaded(
  state: WorkerInterface,
  action: ActionObjectLoaded
): WorkerInterface {
  state.workers = action.payload.map((worker) => ({
    id: worker.id,
    name: worker.name,
    photo: `${SERVICE_BASEURL}/photo/${worker.photo}`,
    bio: worker.bio,
  }));
  state.loading = false;
  state.error = null;
  return state;
}
