import axios from 'axios'

const defaultConfig = {
  // 设置baseUr地址,如果通过proxy跨域可直接填写base地址
  baseURL: '/api/v1',
  // 定义统一的请求头部
  headers: {
    get: {
      // 设置默认请求头，当需要特殊请求头时，将其作为参数传入，即可覆盖此处的默认参数
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    post: {
      // 设置默认请求头，当需要特殊请求头时，将其作为参数传入，即可覆盖此处的默认参数(第三个参数即config)
      // 例如：
      //     services.post(`${base.lkBaseURL}/uploads/singleFileUpload`, file, {
      //       headers: { "Content-Type": "multipart/form-data" }
      //     });
      "Content-Type": "application/json;charset=utf-8"
    }
  },
  // 配置请求超时时间
  timeout: 10000,
  // 如果用的JSONP，可以配置此参数带上cookie凭证，如果是代理和CORS不用设置
  withCredentials: true
}

const _axios = axios.create(defaultConfig);

// 请求拦截器
_axios.interceptors.request.use((config) => {
  // 从vuex里获取token
  const token = "";
  // 如果token存在就在请求头里添加
  token && (config.headers.token = token);
  return config
}, (error) => {
  error.data = {};
  error.data.msg = "服务器异常";
  return Promise.reject(error);
})

// 响应拦截器
_axios.interceptors.response.use((response) => {
  if (response.data?.code === 401) {
    localStorage.removeItem("token");
    // 页面刷新
    parent.location.reload();
  }
  if (response.status === 200) {
    // 处理接口中的data
    if (response.data?.data) {
      try {
        const dataObj = JSON.parse(response.data.data);
        if (typeof dataObj == "object" && dataObj) {
          // 为json字符串将其转为json对象
          response.data.data = dataObj;
        }
      } catch (e) {
        // 不是json字符串就不处理
        return response.data;
      }
    }
    return response.data;
  }
}, (error) => {
  return Promise.reject(error);
})

export default _axios;