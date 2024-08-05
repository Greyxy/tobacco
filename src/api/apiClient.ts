import { t } from '@/locales/i18n';
import userStore from '@/store/userStore';
import { message as Message, message } from 'antd';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { Result } from '#/api';

// 创建 axios 实例
const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API,
  baseURL: 'https://mgr.sctworks.com:65532/service/',
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 请求拦截
axiosInstance.interceptors.request.use(
  (config) => {
    // 在请求被发送之前做些什么
    // config.headers.Authorization = 'Bearer Token';
    const token = JSON.parse(localStorage.getItem('token') || '{}').accessToken;
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    // 请求错误时做些什么
    return Promise.reject(error);
  },
);

// 响应拦截
axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    // const router = useRouter();
    if (!res.data) throw new Error(t('sys.api.apiRequestFailed'));

    if (typeof res.data != 'object') return res.data;
    const { status, data, msg } = res.data;
    if (status == 30100) {
      message.error('Token失效，请重新登录');
      // const navigate = useNavigate();
      // navigate.push('/login'); // 跳转到登录页
      window.location.href = '/login';
      localStorage.clear();
      // router.replace('/login')
      return;
    } else if (status == 40000) {
      // 服务器错误
      message.error('error: 服务器错误');
    } else if (status == 30000) {
      message.error('error: ' + msg || data);
    } else if (status == 403) {
      message.error('没有权限！');
    } else if (status == 500) {
      message.error(msg);
    } else {
      // 业务请求成功
      //  && status === ResultEnum.SUCCESS
      const hasSuccess = Reflect.has(res.data, 'status');
      if (hasSuccess) {
        return data;
      } else {
        message.error(`Error: ${msg}`);
      }
    }

    // 业务请求错误
    // throw new Error(msg || t('sys.api.apiRequestFailed'));
  },
  (error: AxiosError<Result>) => {
    const { response, message } = error || {};

    const errMsg = response?.data?.message || message || t('sys.api.errorMessage');
    Message.error(errMsg);

    const status = response?.status;
    if (status === 401) {
      userStore.getState().actions.clearUserInfoAndToken();
    }
    return Promise.reject(error);
  },
);

class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}
export default new APIClient();
