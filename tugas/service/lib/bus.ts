/** @module bus */
import * as nats from 'nats';

let client: nats.Client;

/**
 * Konek message-bus
 * @param url 
 * @param config 
 */
export function connect(url?: string, config?: nats.ClientOpts): Promise<unknown> {
  return new Promise<Error | void>((resolve, reject) => {
    client = nats.connect(url, config);
    client.on('connect', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Publish message ke subscriber
 * @param subject topik
 * @param data pesan
 */
export function publish(subject: string, data: any): void {
  client.publish(subject, JSON.stringify(data));
}

/**
 * Subscribe topik
 * @param subject topik
 * @param callback function callback
 */
export function subscribe(subject: string, callback: Function) {
  return client.subscribe(subject, callback);
}

/**
 * Unsubscribe topik
 * @param sid client id
 */
export function unsubscribe(sid: number): void {
  return client.unsubscribe(sid);
}

/**
 * Menutup koneksi message-bus
 */
export function close() {
  if (!client) {
    return;
  }
  client.close();
}
