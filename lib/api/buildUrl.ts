import { compile } from 'path-to-regexp';

import config from 'configs/app';

import isNeedProxy from './isNeedProxy';
import { RESOURCES } from './resources';
import type { ApiResource, ResourceName, ResourcePathParams } from './resources';

export default function buildUrl<R extends ResourceName>(
  resourceName: R,
  pathParams?: ResourcePathParams<R>,
  queryParams?: Record<string, string | Array<string> | number | boolean | null | undefined>,
): string {
  const resource: ApiResource = RESOURCES[resourceName];
  const baseUrl = isNeedProxy() ? config.app.baseUrl : (resource.endpoint || config.api.endpoint);
  // 路径的资源是否存在basePath，如果不存在则使用api的basePath
  const basePath = resource.basePath !== undefined ? resource.basePath : config.api.basePath;
  const path = isNeedProxy() ? '/node-api/proxy' + basePath + resource.path : basePath + resource.path;
  const url = new URL(compile(path)(pathParams), baseUrl);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    // there are some pagination params that can be null or false for the next page
    value !== undefined && value !== '' && url.searchParams.append(key, String(value));
  });

  return url.toString();
}
