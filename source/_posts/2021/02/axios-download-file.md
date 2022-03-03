---
title: Axios 同一实例配置下载文件与 JSON 处理
layout: post
date: 2021-02-26 17:21:15
categories: 开发
tags:
- javascript
- axios
- 前端
- HTTP
permalink:
hide_post_info: false
---
现在有一个接口提供下载服务，在发生异常时，这个接口会返回 JSON 数据，来告诉前端是什么样的异常。默认情况下，Axios 只能处理 JSON 数据，如何让二者兼容是本文讨论的核心。

Axios 的核心是 `XMLHttpRequest`。可以设置 `XMLHttpRequest` 对象的 `responseType` 属性以改变从服务器端获取的预期响应。可接受的值为空字符串（默认）、`arraybuffer`、`blob`、`json`、`text`、`document`。
而 Axios 默认配置为 `json`，如果将其配置为 `blob`，虽然可以处理下载文件了，但是接口返回的 JSON 数据很难**同步**转换为 JSON 进行处理（因为 Blob 转 JSON 需要使用 `FileReader().readAsText()`，这是一个异步的操作）。
因此我们可以设置 `responseType` 为 `arraybuffer`，`ArrayBuffer` 对象用来表示通用的、固定长度的原始二进制数据缓冲区。它是一个字节数组，通常在其他语言中称为“byte array”，`ArrayBuffer`可以简单的转换为 JSON 或 Blob。

```javascript
// ajax 封装插件, 使用 axios
import Vue from 'vue'
import axios from 'axios'
import Config from '@/config'

const config = {
  baseURL: Config.baseURL || process.env.apiUrl || '',
  timeout: 5 * 1000, // 请求超时时间设置
  crossDomain: true,
  withCredentials: true, // Check cross-site Access-Control
  // 定义可获得的http响应状态码
  // return true、设置为null或者undefined，promise将resolved,否则将rejected
  validateStatus(status) {
    return status >= 200 && status < 510
  },
}

// 创建请求实例
const _axios = axios.create(config)

_axios.interceptors.request.use(
  originConfig => {
    const reqConfig = { ...originConfig }

    // step1: 容错处理
    if (!reqConfig.url) {
      /* eslint-disable-next-line */
      console.error('request need url')
      throw new Error({
        source: 'axiosInterceptors',
        message: 'request need url',
      })
    }

    if (!reqConfig.method) {
      // 默认使用 get 请求
      reqConfig.method = 'get'
    }
    // 大小写容错
    reqConfig.method = reqConfig.method.toLowerCase()

    // 参数容错
    if (reqConfig.method === 'get') {
      if (!reqConfig.params) {
        // 防止字段用错
        reqConfig.params = reqConfig.data || {}
      }
    } else if (reqConfig.method === 'post') {
      if (!reqConfig.data) {
        // 防止字段用错
        reqConfig.data = reqConfig.params || {}
      }

      // 检测是否包含文件类型, 若包含则进行 formData 封装
      let hasFile = false
      Object.keys(reqConfig.data).forEach(key => {
        if (typeof reqConfig.data[key] === 'object') {
          const item = reqConfig.data[key]
          if (item instanceof FileList || item instanceof File || item instanceof Blob) {
            hasFile = true
          }
        }
      })

      // 检测到存在文件使用 FormData 提交数据
      if (hasFile) {
        const formData = new FormData()
        Object.keys(reqConfig.data).forEach(key => {
          formData.append(key, reqConfig.data[key])
        })
        reqConfig.data = formData
      }
    } else {
      // TODO: 其他类型请求数据格式处理
      /* eslint-disable-next-line */
      console.warn(`其他请求类型: ${reqConfig.method}, 暂无自动处理`)
    }

    // 你自己的请求头处理，比如Authorization之类的
    // ...

    return reqConfig
  },
  error => {
    Promise.reject(error)
  },
)

// Add a response interceptor
_axios.interceptors.response.use(
  async res => {
    // 返回的内容是文件
    if (res.headers['content-type'].toLowerCase().includes('application/octet-stream')) {
      return res
    }
    // 返回的数据是 arraybuffer，内容是 json
    if (res.request.responseType === 'arraybuffer' && res.data.toString() === '[object ArrayBuffer]') {
      const text = Buffer.from(res.data).toString('utf8')
      res.data = JSON.parse(text)
    }
    if (res.status.toString().charAt(0) === '2') {
      return res.data
    }
    let { code, message } = res.data // eslint-disable-line
    return new Promise(async (resolve, reject) => {

      // 你自己的异常处理
      // ...

      Vue.prototype.$message({
        message,
        type: 'error',
      })
      reject()
    })
  },
  error => {
    if (!error.response) {
      Vue.prototype.$notify({
        title: 'Network Error',
        dangerouslyUseHTMLString: true,
        message: '<strong class="my-notify">请检查 API 是否异常</strong>',
      })
      console.log('error', error)
    }

    // 判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Vue.prototype.$message({
        type: 'warning',
        message: '请求超时',
      })
    }
    return Promise.reject(error)
  },
)

// eslint-disable-next-line
Plugin.install = function(Vue, options) {
  // eslint-disable-next-line
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      },
    },
    $axios: {
      get() {
        return _axios
      },
    },
  })
}

if (!Vue.axios) {
  Vue.use(Plugin)
}

// 导出常用函数

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function post(url, data = {}, params = {}) {
  return _axios({
    method: 'post',
    url,
    data,
    params,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function get(url, params = {}) {
  return _axios({
    method: 'get',
    url,
    params,
  })
}

/**
 * 下载用的实例配置
 * @param {string} url
 * @param {object} params
 */
export function download(url, params = {}) {
  return _axios({
    method: 'get',
    url,
    params,
    // 指定无超时、接收对象为arraybuffer
    timeout: 0,
    responseType: 'arraybuffer',
  })
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function put(url, data = {}, params = {}) {
  return _axios({
    method: 'put',
    url,
    params,
    data,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function _delete(url, params = {}) {
  return _axios({
    method: 'delete',
    url,
    params,
  })
}

export default _axio
```

参考：[Axios 同时支持下载和 JSON 数据格式](http://blog.tubumu.com/2017/12/27/axios-extension-01/)
