import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { toast } from "react-toastify";
import { authActions } from '../redux/Auth';
import { uiActions } from "../redux/Ui";

// Need for using fully inited redux store
let store: any;

export const injectStore = (_store: any) => {
  store = _store
}

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

export const refreshAuthLogic = (failedRequest?: any) => {
  return httpClient.get<{ token: string }>('/auth/refresh')
    .then(tokenRefreshResponse => {
      store.dispatch(authActions.updateAccessToken(tokenRefreshResponse.data.token));
      if (failedRequest) {
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.token;
      }
      return Promise.resolve();
    }).catch(error => {
      store.dispatch(authActions.logOut());
      return Promise.reject(error);
    });
}
createAuthRefreshInterceptor(httpClient, refreshAuthLogic);
// request abort controller for canceling request if needed (ex: on navigation)
export let abortControllers: { url: string, controller: AbortController }[] = [];

const onRequest = (config: AxiosRequestConfig) => {
  abortControllers.push({ url: config.url ?? 'no_url', controller: new AbortController() });
  // Set loader
  if (!config.onUploadProgress && config?.headers?.disableGlobalLoader !== 1) {
    store.dispatch(uiActions.addLoadRequest(`${config.url}`))
  }
  // Set Auth header if has jwt token
  if (store.getState().auth.accessToken && config && config.headers) {
    config.headers.Authorization = 'Bearer ' + store.getState().auth.accessToken;
  }
  config.signal = abortControllers[abortControllers.length - 1].controller.signal;
  return config;
}

const onRequestError = (error: AxiosError) => {
  return Promise.reject(error);
}

const onResponse = (response: AxiosResponse) => {
  if (response) {
    store.dispatch(uiActions.removeLoadRequest(`${response.config.url}`));
  }
  return response;
}

const onResponseError = (error: AxiosError<any>) => {
  store.dispatch(uiActions.removeLoadRequest(`${error.config.url}`));
  // check for errorHandle config
  if (error.config?.hasOwnProperty('errorHandle') && error.config.errorHandle === false) {
    return Promise.reject(error);
  }
  if (error.response?.status === 400) {
    toast.error(error.response?.data);
  }
  if (error.response?.status === 403) {
    toast.error('403 Sessiya bitdi');
    store.dispatch(authActions.logOut());
  }
  if (error.response?.status === 404) {
    toast.error(`404 Not Found ${error.response?.config.url}`);
  }
  // if has response show the error
  if (error.response?.data?.message) {
    toast.error(`${error.response.data.message}`);
  }
  if (error.response?.data?.name && error.response?.data?.name === 'SequelizeDatabaseError') {
    toast.error(error.response?.data.original?.sqlMessage);
  }
  if (error.response?.status === 500) {
    toast.error('Server xətası')
  }
}

httpClient.interceptors.request.use(onRequest, onRequestError);
httpClient.interceptors.response.use(onResponse, onResponseError);

export { httpClient };
