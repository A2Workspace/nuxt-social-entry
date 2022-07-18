import { AxiosResponse } from 'axios';

export function getParam(key: string): string {
  return new URLSearchParams(window.location.search).get(key);
}

export function resetParams(): void {
  window.history.replaceState(
    {},
    window.document.title,
    window.location.href.split('?')[0]
  );
}

export function getPayload(response: AxiosResponse): any {
  let payload = response.data;

  if (typeof payload === 'object' && typeof payload.data === 'object') {
    return payload;
  }

  return payload;
}
