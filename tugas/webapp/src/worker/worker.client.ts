import { httpClient } from '../lib/http-client';

import { SERVICE_BASEURL } from './config';

export function register(data: any): Promise<any> {
  return httpClient.post(`${SERVICE_BASEURL}/register`, data);
}

export function list(): Promise<any> {
  return httpClient.get(`${SERVICE_BASEURL}/list`);
}

export function remove(id: number): Promise<any> {
  return httpClient.del(`${SERVICE_BASEURL}/remove?id=${id}`);
}

export function info(id: number): Promise<any> {
  return httpClient.get(`${SERVICE_BASEURL}/info?id=${id}`);
}
