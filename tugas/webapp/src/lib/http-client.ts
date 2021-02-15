export interface RequestOption {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  customConf?: any;
}

async function client(
  endpoint: string,
  json: boolean,
  options: RequestOption
): Promise<any> {
  let headers;
  headers = { 'Content-Type': 'application/json' };

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
      for (const name in options.body) {
        formData.append(name, options.body[name]);
      }
      config.body = formData;
    }
  }

  let data;
  try {
    const response = await window.fetch(endpoint, config);
    data = await response.json();
    if (!response.ok) {
      throw new Error(data?.statusText ?? 'Gagal request ke API');
    }

    return data;
  } catch (err) {
    return Promise.reject(err?.message || data);
  }
}

client.get = (endpoint: string, customConf: any = {}): Promise<any> => {
  const config: RequestOption = {
    method: 'GET',
    ...customConf,
  };
  return client(endpoint, true, config);
};

client.post = <T>(
  endpoint: string,
  body?: any,
  json?: boolean,
  customConf: any = {}
): Promise<T> => {
  return client(endpoint, json, { method: 'POST', body, ...customConf });
};

client.put = (
  endpoint: string,
  body: any,
  json: boolean,
  customConf: any = {}
): Promise<any> => {
  return client(endpoint, json, { method: 'PUT', body, ...customConf });
};

client.del = (
  endpoint: string,
  body?: any,
  json?: boolean,
  customConf: any = {}
): Promise<any> => {
  return client(endpoint, json, { method: 'DELETE', body, ...customConf });
};

export { client };
