import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { API_URL, ENABLE_MIDDLEWARE, MIDDLEWARE_URL } from '../environment';
import { getError } from '../utils/functions/utility';
import { showToast } from '../utils/showToast';
import { useUserData } from './LoginService';

export type Resp<dataType> = {
  data: {
    messages: string[];
    requestTime: string;
    status: {
      code: number;
      message: string;
      flag: boolean;
    };
    content: {
      data: dataType;
      metadata: {
        sortColumn: string;
        sortDirection: string;
        offset: number;
        limit: number;
        quickSearch: string;
        dataSize: number;
      };
    };
    message: string;
  };
};

export function getResp<dataType>(resp: Resp<dataType>) {
  return resp.data.content.data;
}
export function getRespContent<dataType>(resp: Resp<dataType>) {
  return resp.data.content;
}
const Api = axios.create({
  baseURL: API_URL,
});

export const Middleware = axios.create({
  baseURL: MIDDLEWARE_URL,
});

export function getApi() {
  if (ENABLE_MIDDLEWARE) {
    return Middleware;
  }
  return Api;
}

export function AxiosInterceptor() {
  const toast = useToast();
  const user = useUserData();
  const tenantId = user?.entity;
  const accessToken = user?.token;
  Api.interceptors.request.use((config: any) => {
    if (accessToken)
      config.headers.common['Authorization'] = `Bearer ${accessToken}`;
    if (tenantId && ENABLE_MIDDLEWARE)
      config.headers.common['TenantId'] = tenantId;
    return config;
  });
  Middleware.interceptors.request.use((config: any) => {
    if (accessToken)
      config.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return config;
  });
  Api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err !== 'catch')
        showToast({
          toast,
          status: 'error',
          title: 'Erro',
          description: getError(err),
        });
      return Promise.reject('catch');
    }
  );

  Middleware.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err !== 'catch')
        showToast({
          toast,
          status: 'error',
          title: 'Erro',
          description: getError(err),
        });
      return Promise.reject('catch');
    }
  );
  return <></>;
}

export default Api;
