import { QueryClient } from '@tanstack/react-query';
// @tanstack/react-query 缓存请求工具 请求 => 数据缓存是否有数据 => 有数据返回数据 => 没有数据请求数据 => 缓存数据 => 返回数据
import React from 'react';

import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import getErrorObjStatusCode from 'lib/errors/getErrorObjStatusCode';

export const retry = (failureCount: number, error: unknown) => {
  const errorPayload = getErrorObjPayload<{ status: number }>(error);
  const status = errorPayload?.status || getErrorObjStatusCode(error);
  if (status && status >= 400 && status < 500) {
    // don't do retry for client error responses
    return false;
  }
  return failureCount < 2;
};

export default function useQueryClientConfig() {
  const [ queryClient ] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry,
        throwOnError: (error) => {
          const status = getErrorObjStatusCode(error);
          // don't catch error for "Too many requests" response
          return status === 429;
        },
      },
    },
  }));

  return queryClient;
}
