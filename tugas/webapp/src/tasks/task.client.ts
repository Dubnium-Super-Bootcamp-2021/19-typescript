import { client } from '../lib/http-client';

import { SERVICE_BASEURL } from './config';
import { DataTask } from '../../../service/tasks/task';
import { TaskInterface } from '../../../service/tasks/task.interface';

export function add(data: DataTask): Promise<TaskInterface> {
  return client.post(`${SERVICE_BASEURL}/add`, data);
}

export function list(): Promise<TaskInterface[]> {
  return client.get(`${SERVICE_BASEURL}/list`);
}

export function cancel(id: number) {
  return client.put(`${SERVICE_BASEURL}/cancel?id=${id}`);
}

export function done(id: number) {
  return client.put(`${SERVICE_BASEURL}/done?id=${id}`);
}
