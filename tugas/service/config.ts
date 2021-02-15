import * as rc from 'rc';
import  { ConnectionOptions } from 'typeorm';

export interface ServiceConfig {
  database: ConnectionOptions;
  objectStorage: {
    endPoint: string,
    port: number,
    useSSL: boolean,
    accessKey: string,
    secretKey: string,
  }
  server: {
    portWorker: number,
    portTask: number,
    portPerformance: number,
  };
}

const defaultConfig: ServiceConfig = {
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'database',
  },
  objectStorage: {
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'password',
  },
  server: {
    portWorker: 7001,
    portTask: 7002,
    portPerformance: 7003,
  },
};

export const config: ServiceConfig = rc('tm', defaultConfig);