/** @module performance */

import { read, save } from '../lib/kv';

export const TASK_TOTAL_KEY = 'task.total';
export const TASK_DONE_KEY = 'task.done';
export const TASK_CANCELLED_KEY = 'task.cancelled';
export const WORKER_TOTAL_KEY = 'worker.total';

/**
 * Mendapatkan summary dari worker dan task
 * @returns {Promise<Performance>} daftar summary worker dan task
 */
export interface summaryPerformance {
  total_task: number,
  task_done: number,
  task_cancelled: number,
  total_worker: number
}
export async function summary():Promise<summaryPerformance> {
  const data = {
    total_task: parseInt((await read(TASK_TOTAL_KEY)) || '0', 10),
    task_done: parseInt((await read(TASK_DONE_KEY)) || '0', 10),
    task_cancelled: parseInt((await read(TASK_CANCELLED_KEY)) || '0', 10),
    total_worker: parseInt((await read(WORKER_TOTAL_KEY)) || '0', 10),
  };
  return data;
}

export async function increaseTotalTask(): Promise<void> {
  const raw = await read(TASK_TOTAL_KEY);
  let val = parseInt(raw || '0', 10);
  val++;
  await save(TASK_TOTAL_KEY, val);
}

export async function increaseDoneTask(): Promise<void> {
  const raw = await read(TASK_DONE_KEY);
  let val = parseInt(raw || '0', 10);
  val++;
  await save(TASK_DONE_KEY, val);
}

export async function increaseCancelledTask(): Promise<void> {
  const raw = await read(TASK_CANCELLED_KEY);
  let val = parseInt(raw || '0', 10);
  val++;
  await save(TASK_CANCELLED_KEY, val);
}

export async function increaseTotalWorker(): Promise<void> {
  const raw = await read(WORKER_TOTAL_KEY);
  let val = parseInt(raw || '0', 10);
  val++;
  await save(WORKER_TOTAL_KEY, val);
}

export async function decreaseTotalWorker(): Promise<void> {
  const raw = await read(WORKER_TOTAL_KEY);
  let val = parseInt(raw || '0', 10);
  if (val > 0) {
    val--;
  }
  await save(WORKER_TOTAL_KEY, val);
}