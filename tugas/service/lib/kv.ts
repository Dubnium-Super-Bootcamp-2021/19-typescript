/** @module kv */
import * as redis from 'redis';
import { promisify } from 'util';

let client: redis.RedisClient;
/**
  * Konek ke kv database
  * @param {any} options 
  */
export function connect(options?: redis.ClientOpts): Promise<unknown> {
  return new Promise<Error | void>((resolve, reject) => {
    client = redis.createClient(options);
    client.on('connect', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Simpan data
 * @param db key database
 * @param data value/data yang ingin disimpan
 */
export function save(db : string, data: any): Promise<void> {
  const setAsync = promisify(client.set).bind(client);
  return setAsync(db, data);
}

/**
 * Ambil data 
 * @param db key database
 */
export async function read(db: string): Promise<string> {
  const getAsync = promisify(client.get).bind(client);
  const val = await getAsync(db);
  return JSON.parse(val);
}

/**
 * Hapus data
 * @param db key database
 */
export function drop(db: string): Promise<string> {
  const delAsync = promisify(client.del).bind(client);
  return delAsync(db);
}

/**
 * Tutup koneksi
 */
export function close() {
  if (!client) {
    return;
  }
  if (client.connected) {
    client.end(true);
  }
}
