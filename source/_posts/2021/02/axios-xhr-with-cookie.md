---
title: Axios 发送请求时携带 Cookies
layout: post
date: 2021-02-26 17:58:13
categories: 开发
tags:
- javascript
- axios
- 前端
- HTTP
- java
- spring
- 后端
permalink:
hide_post_info:
---
前文提到过，Axios 的核心是 `XMLHttpRequest`。`XMLHttpRequest` 对象在默认情况下并不会发送 `Cookies`，需要设置 `withCredentials: true`才行。但是只有前端设置也是没有用的，涉及跨域的情况下，还需要后端配合。我用的是Spring，就用Spring的配置类演示了。

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

// 其他代码
// ...
```

```java
@Configuration(proxyBeanMethods = false)
public class WebConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 跨域域名绝对不能配置为通配符，必须指定具体的域名，且http和https是算两个域名的，如果两个都要支持就都要写
                .allowedOriginPatterns("http://localhost:18080", "你的域名")
                .allowedMethods("GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true)
                .maxAge(3600)
                .allowedHeaders("*")
                // 允许跨域接受Cookie
                .allowCredentials(true)
                .exposedHeaders(HttpHeaders.CONTENT_DISPOSITION);
    }
}
```

参考：[You Don't Know Axios](https://github.com/chinesedfan/You-Dont-Know-Axios)
