import trim from 'lodash.trim';

export default class RedirectRequest {
  private targetUrl: string;
  static make: Function;

  constructor(targetUrl: string) {
    this.targetUrl = targetUrl;
  }

  redirect(): void {
    window.location.assign(this.targetUrl);
  }

  getTargetUrl(): string {
    return this.targetUrl;
  }
}

RedirectRequest.make = function (
  uri: string,
  params: object = {}
): RedirectRequest {
  if (!uri.match(/^https?:\/\//)) {
    uri = trim(window.location.href, '/') + '/' + trim(uri, '/');
  }

  const targetUrl = new URL(uri);

  for (const [key, value] of Object.entries(params)) {
    targetUrl.searchParams.set(key, value);
  }

  return new RedirectRequest(targetUrl.toString());
};
