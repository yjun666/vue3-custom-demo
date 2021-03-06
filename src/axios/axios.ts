import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosPromise,
    AxiosResponse
} from 'axios'; // 引入axios和定义在node_modules/axios/index.ts文件里的类型声明
import store from '../store';
import router from '../router';
import { getToken, getAuthorization } from './auth';

// 使用.env.development里面定义的api
const apiBaseUrl = process.env.VITE_APP_WARN_EASYMOCK_URL;

class HttpRequest {
    // 定义一个接口请求类，用于创建一个axios请求实例
    constructor(public baseUrl: any = apiBaseUrl) {
    // 这个类接收一个字符串参数，是接口请求的基本路径
        this.baseUrl = baseUrl;
    }

    public request(options: AxiosRequestConfig): AxiosPromise {
    // 我们实际调用接口的时候调用实例的这个方法，他返回一个AxiosPromise
        const instance: AxiosInstance = axios.create(); // 这里使用axios.create方法创建一个axios实例，他是一个函数，同时这个函数包含多个属性
        options = this.mergeConfig(options); // 合并基础路径和每个接口单独传入的配置，比如url、参数等
        this.interceptors(instance, options.url); // 调用interceptors方法使拦截器生效
        return instance(options); // 最后返回AxiosPromise
    }

    private interceptors(instance: AxiosInstance, url?: string) {
    // 定义这个函数用于添加全局请求和响应拦截逻辑
    // 在这里添加请求和响应拦截
        instance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                // 接口请求的所有配置，都在这个config对象中，他的类型是AxiosRequestConfig，你可以看到他有哪些字段
                // 如果你要修改接口请求配置，需要修改 axios.defaults 上的字段值
                (config as any).headers['X-Token'] = getToken();
                (config as any).headers.Authorization = getAuthorization();

                return config;
            },
            (error:Error) => {
                return Promise.reject(error);
            }
        );

        instance.interceptors.response.use(
            (res: AxiosResponse) => {
                const { data } = res; // res的类型是AxiosResponse<any>，包含六个字段，其中data是服务端返回的数据
                const { status, msg } = data; // 通常服务端会将响应状态码、提示信息、数据等放到返回的数据中
                if (res.status !== 200) {
                    return Promise.reject(new Error('error'));
                } else {
                    if (data === 'token失败' && res.status === 200) {
                        //   const patharr = window.location.href.split('/')
                        //   const patharrtwo = patharr[patharr.length - 1].split('?')
                        //   if (patharrtwo.indexOf('login') == -1) {
                        //     const redirectUrl = router.currentRoute.value.path == '/' ? location.href + 'login' : location.href.replace(router.currentRoute.value.path, '/login')
                        //     window.location.href = redirectUrl
                        //   }
                        return data;
                    } else {
                        if (status !== '1') {
                            // 这里我们在服务端将正确返回的状态码标为0
                            console.error(msg); // 如果不是0，则打印错误信息，我们后面讲到UI组件的时候，这里可以使用消息窗提示
                        }
                        return data;
                    }
                    // return data
                }
            },
            (error:Error) => {
                // 这里是遇到报错的回调
                return Promise.reject(error);
            }
        );
    }

    private mergeConfig(options: AxiosRequestConfig): AxiosRequestConfig {
    // 这个方法用于合并基础路径配置和接口单独配置
        return Object.assign({ baseURL: this.baseUrl }, options);
    }
}

// 用于定义接口返回的数据类型
export interface ResponseData {
  status: string;
  data?: any;
  msg: string;
}

export default HttpRequest;
