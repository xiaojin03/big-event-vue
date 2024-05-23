//定制请求的实例

//导入axios  npm install axios
import axios from "axios";
import { ElMessage } from "element-plus";
import { useTokenStore } from "@/stores/token.js";
import router from "@/router/index.js";
//定义一个变量,记录公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';
const baseURL = "/api";
const instance = axios.create({ baseURL });

//添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 获取token
    let tokenStore = useTokenStore();
    // 判断是否有token
    if (tokenStore) {
      config.headers.Authorization = tokenStore.token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

//添加响应拦截器
instance.interceptors.response.use(
  (result) => {
    // 判断业务状态码
    if (result.data.code === 0) {
      return result.data;
    }
    // 操作失败
    ElMessage.error(result.data.message ? result.data.message : "操作失败");
    // 将异步操作的状态转换为失败
    return Promise.reject(result.data);
  },
  (err) => {
    // 判断错误状态码，如果为401，则跳转到登录页面
    if (err.response.status === 401) {
      ElMessage.error("登录状态已过期，请重新登录");
      // 跳转到登录页面
      router.push("/login");
    } else {
      ElMessage.error("服务异常");
    }

    return Promise.reject(err); //异步的状态转化成失败的状态
  }
);

export default instance;
