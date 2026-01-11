export interface MakeBilibiliGreatThanEverBeforeModule {
  id: string,
  name: string,
  description: string,
  defaultEnabled?: boolean,
  alwaysRun?: boolean,
  any?: (hook: MakeBilibiliGreatThanEverBeforeHook) => void,
  onVideo?: (hook: MakeBilibiliGreatThanEverBeforeHook) => void,
  onLive?: (hook: MakeBilibiliGreatThanEverBeforeHook) => void,
  onCV?: (hook: MakeBilibiliGreatThanEverBeforeHook) => void,
  onStory?: (hook: MakeBilibiliGreatThanEverBeforeHook) => void,
  onBangumi?: (hook: MakeBilibiliGreatThanEverBeforeHook) => void,
  onVideoOrBangumi?: (hook: MakeBilibiliGreatThanEverBeforeHook) => void
}

export interface XHRDetail {
  method: string,
  url: string | URL,
  response: unknown | null,
  lastResponseLength: number | null
}
export type XHROpenArgs =
  | [
    method: string,
    url: string | URL,
    async: boolean,
    username?: string | null | undefined,
    password?: string | null | undefined
  ]
  | [
    method: string,
    url: string | URL
  ];

/**
 * If `null` is returned, the fetch will be nullified.
 * If a `Response` is returned, the fetch will be mocaked with the response.
 */
export type FetchArgs = [requestInfo: RequestInfo | URL, requestInit?: RequestInit];
export type OnBeforeFetchHook = (fetchArgs: FetchArgs) => FetchArgs | null | Response;
/**
 * If `null` is returned, the XMLHttpRequest will be nullified.
 */
export type OnXhrOpenHook = (xhrOpenArgs: XHROpenArgs, xhr: XMLHttpRequest) => XHROpenArgs | null;

export interface MakeBilibiliGreatThanEverBeforeHook {
  addStyle(this: void, css: string): void,
  onBeforeFetch(this: void, cb: OnBeforeFetchHook): void,
  onResponse(this: void, cb: (response: Response, fetchArgs: FetchArgs, $fetch: typeof fetch) => Promise<Response> | Response): void,
  onXhrOpen(this: void, cb: OnXhrOpenHook): void,
  onAfterXhrOpen(this: void, cb: (xhr: XMLHttpRequest) => void): void,
  onXhrResponse(this: void, cb: (method: string, url: string | URL, response: unknown, xhr: XMLHttpRequest) => unknown): void,
  onlyCallOnce(this: void, fn: () => void): void
};
