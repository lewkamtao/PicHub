import { Alert } from '../util/alert'
import { FormatZhByMessage } from '../util/util'

import axios from 'axios'
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import router from '../router'

//将axios封装到类中
class xwlRequest {
  instance: AxiosInstance //axios的实例将被保存到这里
  constructor(config: AxiosRequestConfig) {
    //构造器里的config包括baseURL，timeout等
    this.instance = axios.create(config) //创建axios实例
    this.instance.interceptors.request.use(
      //实例中的请求拦截器
      (config: AxiosRequestConfig) => {
        //请求成功的拦截
        let token = localStorage.getItem('token')
        if (token) {
          config.headers = {
            Authorization: `token ${token}`,
          }
        }
        return config
      },
      (error) => {
        console.log(error)
        //请求失败的拦截
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      //实例中的响应拦截器
      (response: AxiosResponse) => {
        //响应成功的拦截
        return response
      },
      (error) => {
        if (error.response.data.message != 'Not Found') {
          Alert({
            type: 'danger',
            text: FormatZhByMessage(error.response.data.message),
          })
        }
        //响应失败的拦截
        return Promise.reject(error)
      }
    )
  }
  request<T>(config: AxiosRequestConfig): Promise<T> {
    //再次封装request方法
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          resolve(res) //将结果返回出去
        })
        .catch((err) => {
          reject(err)
          return err
        })
    })
  }
  get<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }
  post<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }
  put<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' })
  }
  // delete<T>(config: AxiosRequestConfig): Promise<T> {
  //   window.$message.error(`暂无权限`)
  //   return this.request<T>({ ...config, method: 'POST' })
  // }
  delete<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
  patch<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}
export default xwlRequest
