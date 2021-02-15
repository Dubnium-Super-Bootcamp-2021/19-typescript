import mime from 'mime-types';
import { Client } from 'minio';

export const ERROR_REQUIRE_OBJECT_NAME = 'error wajib memasukan nama objek';
export const ERROR_FILE_NOT_FOUND = 'error file tidak ditemukan';

let client: any;
let bucketname: string;

/**
 * Konek ke object storage
 * @param _bucketname nama bucket
 * @param options konfigurasi
 */
export async function connect(_bucketname: string, options?: any): Promise<void> {
  client = new Client({
    ...options,
    useSSL: false,
  });
  bucketname = _bucketname || 'photo';
  try {
    await client.makeBucket(bucketname);
  } catch (err) {
    if (err?.code === 'BucketAlreadyOwnedByYou') {
      return;
    }
    throw err;
  }
}

/**
 * Acak nama file
 * @param mimetype
 */
export function randomFileName(mimetype: string): string {
  return (
    new Date().getTime() +
    '-' +
    Math.round(Math.random() * 1000) +
    '.' +
    mime.extension(mimetype)
  );
}

/**
 * Simpan file ke object storage
 * @param file 
 * @param mimetype 
 */
export function saveFile(file: any, mimetype: string): Promise<unknown> {
  const objectName = randomFileName(mimetype);
  return new Promise((resolve, reject) => {
    client.putObject(bucketname, objectName, file, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(objectName);
    });
  });
}

/**
 * Baca file dari object storage
 * @param objectName 
 */
export async function readFile(objectName: string): Promise<any> {
  if (!objectName) {
    throw ERROR_REQUIRE_OBJECT_NAME;
  }
  try {
    await client.statObject(bucketname, objectName);
  } catch (err) {
    if (err?.code === 'NotFound') {
      throw ERROR_FILE_NOT_FOUND;
    }
    throw err;
  }
  return client.getObject(bucketname, objectName);
}
