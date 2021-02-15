import { SERVICE_BASEURL } from './config';
import {TaskInterface,WorkerInterface} from '../../../service/tasks/task.interface';

// setup state
export interface Task {
  id: number,
  job: string,
  assignee: string,
  attachment: string,
  done: boolean,
}

export interface Worker {
  id: number,
  name: string,
}

export interface State {
  loading: boolean,
  error: any,
  workers: Worker[],
  tasks: Task[],
};

interface ActionObject {
  type: string;
}

interface ActionObjectError extends ActionObject {
  payload: any;
}

interface ActionObjectAdded extends ActionObject {
  payload: TaskInterface;
}

interface ActionObjectDone extends ActionObject {
  payload: number;
}

interface ActionObjectCanceled extends ActionObject {
  payload: number;
}

interface ActionObjectTasksLoaded extends ActionObject {
  payload: TaskInterface[];
}

interface ActionObjectWorkersLoaded extends ActionObject {
  payload: WorkerInterface[];
}

export const initialState:State = {
  loading: false,
  error: null,
  workers: [],
  tasks: [],
};

export function loading(state: State) {
  state.loading = true;
  state.error = null;
}

export function error(state: State, action: ActionObjectError) {
  state.loading = false;
  state.error = action.payload;
}

export function clearError(state: State) {
  state.error = null;
}

export function added(state: State, action: ActionObjectAdded): State {
  const task = action.payload;
  state.tasks.push({
    id: task.id,
    job: task.job,
    assignee: task?.assignee?.name,
    attachment: `${SERVICE_BASEURL}/attachment/${task.attachment}`,
    done: false,
  });
  state.loading = false;
  state.error = null;
  return state;
}

export function done(state: State, action: ActionObjectDone): State{
  const idx = state.tasks.findIndex((t) => t.id === action?.payload);
  state.tasks[idx].done = true;
  state.loading = false;
  state.error = null;
  return state;
}

export function canceled(state: State, action: ActionObjectCanceled): State {
  const idx = state.tasks.findIndex((t) => t.id === action?.payload);
  state.tasks.splice(idx, 1);
  state.loading = false;
  state.error = null;
  return state;
}

export function tasksLoaded(state: State, action: ActionObjectTasksLoaded): State {
  state.tasks = action.payload
    .filter((t) => !t.cancelled)
    .map((task) => ({
      id: task?.id,
      job: task?.job,
      assignee: task?.assignee?.name,
      attachment: `${SERVICE_BASEURL}/attachment/${task.attachment}`,
      done: task.done,
    }));
  state.loading = false;
  state.error = null;
  return state;
}

export function workersLoaded(state: State, action: ActionObjectWorkersLoaded): State {
  state.workers = action.payload.map((worker) => ({
    id: worker.id,
    name: worker.name,
  }));
  state.loading = false;
  state.error = null;
  return state;
}

