import * as Busboy from 'busboy';
import * as url from 'url';
import * as mime from 'mime-types';
import { Writable } from 'stream';
import { IncomingMessage, ServerResponse } from 'http';
import {
  register,
  list,
  remove,
  info,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_WORKER_NOT_FOUND,
} from './worker';
import { saveFile, readFile, ERROR_FILE_NOT_FOUND } from '../lib/storage';

export function registerSvc(req: IncomingMessage, res: ServerResponse): void {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    id: 0,
    name: '',
    age: 0,
    bio: '',
    address: '',
    photo: '',
  };

  let finished = false;

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    switch (fieldname) {
      case 'photo':
        try {
          data.photo = await saveFile(file, mimetype);
        } catch (err) {
          abort();
        }
        if (!req.aborted && finished) {
          try {
            const worker = await register(data);
            res.setHeader('content-type', 'application/json');
            res.write(JSON.stringify(worker));
          } catch (err) {
            if (err === ERROR_REGISTER_DATA_INVALID) {
              res.statusCode = 401;
            } else {
              res.statusCode = 500;
            }
            res.write(err);
          }
          res.end();
        }
        break;
      default: {
        const noop = new Writable({
          write(chunk, encding, callback) {
            setImmediate(callback);
          },
        });
        file.pipe(noop);
      }
    }
  });

  busboy.on('field', (fieldname, val) => {
    if (['name', 'age', 'bio', 'address'].includes(fieldname)) {
      data[fieldname] = val;
    }
  });

  busboy.on('finish', async () => {
    finished = true;
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

export async function listSvc(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const workers = await list();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(workers));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

export async function infoSvc(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'] as string;
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const worker = await info(parseInt(id,10));
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(worker));
    res.end();
  } catch (err) {
    if (err === ERROR_WORKER_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end();
    return;
  }
}

export async function removeSvc(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'] as string;
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const worker = await remove(parseInt(id,10));
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(JSON.stringify(worker));
    res.end();
  } catch (err) {
    if (err === ERROR_WORKER_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end();
    return;
  }
}

export async function getPhotoSvc(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const uri = url.parse(req.url, true);
  const objectName = uri.pathname.replace('/photo/', '');
  if (!objectName) {
    res.statusCode = 400;
    res.write('request tidak sesuai');
    res.end();
  }
  try {
    const mimeType = mime.lookup(objectName);
    if(mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
    const objectRead = await readFile(objectName);
    res.statusCode = 200;
    objectRead.pipe(res);
  } catch (err) {
    if (err === ERROR_FILE_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.write('gagal membaca file');
    res.end();
    return;
  }
}
