/** @module httpClient */

export interface RequestOption {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  customConf?: any;
}

/**
 * ### Basic client untuk request ke `server`
 * @param {string} endpoint target / url endpoint
 * @param {object} json body
 * @param {RequestInit} options tambahan opsi [request](http://localhost)
 * @returns {Promise<any>} hasil request
 */
async function client(endpoint: string, json: any, options: RequestOption): Promise<any> {
  let headers;
  if (json) {
    headers = { 'Content-Type': 'application/json' };
  }

  const config = {
    method: options?.method ?? 'GET',
    ...options?.customConf,
    headers: {
      ...headers,
      ...options?.customConf?.headers,
    },
  };

  if (options?.body) {
    if (json) {
      config.body = JSON.stringify(options?.body);
    } else {
      const formData = new FormData();
      for (const name in options?.body) {
        formData.append(name, options?.body[name]);
      }
      config.body = formData;
    }
  }

  let data;
  try {
    const response = await window.fetch(endpoint, config);
    data = await response.json();
    if (!response.ok) {
      throw new Error(data.statusText);
    }

    return data;
  } catch (err) {
    return Promise.reject(err.message || data);
  }
}

/**
 * request dengan method GET
 * @param {string} endpoint target / url endpoint
 * @param {RequestInit} options tambahan opsi request
 */
client.get = (endpoint: string, customConf: any = {}): Promise<any> => {
  return client(endpoint, true, { method: 'GET', ...customConf });
};

/**
 * request dengan method POST
 * @param {string} endpoint target / url endpoint
 * @param {Object} body konten dari request
 * @param {RequestInit} options tambahan opsi request
 */
client.post = (endpoint: string, body?: any, json?: any, customConf: any = {}): Promise<any> => {
  return client(endpoint, json, { method: 'POST', body, ...customConf });
};

/**
 * request dengan method PUT
 * @param {string} endpoint target / url endpoint
 * @param {Object} body konten dari request
 * @param {RequestInit} options tambahan opsi request
 */
client.put = (endpoint: string, body?: any, json?: any, customConf: any = {}): Promise<any> => {
  return client(endpoint, json, { method: 'PUT', body, ...customConf });
};

/**
 * request dengan method DELETE
 * @param {string}endpoint target / url endpoint
 * @param {Object} body konten dari request
 * @param {Object} json 
 * @param {RequestInit} customConf tambahan opsi request
 */
client.del = (endpoint: string, body?: any, json?: any, customConf: any = {}): Promise<any> => {
  return client(endpoint, json, { method: 'DELETE', body, ...customConf });
};

export { client as httpClient };
