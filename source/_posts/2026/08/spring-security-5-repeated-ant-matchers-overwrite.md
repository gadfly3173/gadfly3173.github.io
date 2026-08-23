---
title: Spring Security 5 中重复 antMatchers 如何覆盖授权属性
layout: post
typora-root-url: ..
hide_post_info: false
date: 2026-08-19 17:00:00
categories:
  - 开发
  - Java
  - Spring
  - 安全
tags:
  - Spring Security
  - Spring Boot
  - Java
  - 权限控制
  - antMatchers
permalink:
---

最近排查一个 Homolo Boot 5.2.2 项目的文件接口权限问题。业务项目在 `authorizeRequestBeforeDefault` 中增加两条看起来更严格的规则后，`tk.File` 的大部分接口反而不登录就能访问；注释掉这两条规则后，框架默认权限却恢复正常。

这篇文章记录排查过程，并说明 Spring Security 5.6.2 中一个容易被忽略的细节：重复的 `antMatchers` 不会排成两条独立规则，后注册的规则可能只替换前一条规则的授权属性，同时保留原来的匹配顺序。

> **版本说明：** 文中的 `5.2.2` 是 Homolo Boot 的版本号，不是 Spring Security 的版本号。用于核对依赖的 `homolo-boot` POM 继承 Spring Boot `2.6.6`，由其依赖管理提供 Spring Security `5.6.2`；`homolo-boot-core` 通过 `spring-boot-starter-security` 引入这一组依赖。

> 本文中的“匿名可访问”特指请求没有被 Spring Security 的 URL 授权规则拦截；接口内部仍可能存在额外的业务校验。

## 问题表现

业务项目的安全配置大致如下：

```java
@Override
protected void authorizeRequestBeforeDefault(
        ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry registry) {
    registry
            .antMatchers("/service/rest/tk.File/collection/list")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**")
            .authenticated();
}
```

随后，Homolo Boot 基类注册默认规则：

```java
protected void authorizeRequestDefault(
        ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry registry) {
    registry
            .antMatchers("/service/rest/tk.File/**/cropImage")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**/jcropIframe")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**/info")
            .authenticated()
            .antMatchers("/service/rest/tk.File/**/listByIds")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**/meta")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**/upload")
            .authenticated()
            .antMatchers("/service/rest/tk.File/**/uploadImage")
            .hasRole(Role.ADMIN_ROLE_ID)
            .antMatchers("/service/rest/tk.File/**")
            .permitAll();
}
```

相关配置方法的调用顺序是：

```java
authorizeRequestBeforeDefault(registry);
authorizeRequestDefault(registry);
authorizeRequestAfterDefault(registry);
registry.anyRequest().denyAll();
```

按直觉，业务规则先注册，应该先于默认规则参与匹配；而且业务的 `authenticated()` 看起来也比默认的 `permitAll()` 更严格。但实际结果却是：

| 请求 | 增加两条业务规则后 | 注释两条业务规则后 |
| --- | --- | --- |
| `tk.File/x/cropImage` | 匿名可访问 | 按默认规则处理 |
| `tk.File/x/meta` | 匿名可访问 | 按默认规则处理 |
| `tk.File/x/uploadImage` | 匿名可访问 | 按默认规则处理 |
| `tk.File/x/listByIds` | 匿名可访问 | 按默认规则处理 |
| `tk.File/x/info` | 匿名可访问 | 按默认规则处理 |
| `tk.File/collection/list` | 要求相应角色 | 按默认规则处理 |
| `tk.File/x/list` | 需结合实际部署单独核对 | 需结合实际部署单独核对 |

> “匿名”验证使用不带 `Cookie`、`Authorization` 和 `justice-cloud-proxy-token` 的 `curl` 请求，因此不是代理 token 自动登录造成的结果。

## 先排除常见误判

### 不是线上 jar 错误

线上版本的行为与带这两条配置的代码版本一致，问题不是线上部署了旧 jar，也不存在代码与线上行为不一致。

### 不是 `justice-cloud-proxy-token`

`archives` 项目确实注册了 `JusticeCloudProxyTokenFilter`，它可以通过 `justice-cloud-proxy-token` 请求头自动登录用户。但去掉认证相关请求头后，匿名 `curl` 仍然可以复现 `cropImage`、`meta`、`uploadImage`、`listByIds` 等接口未被 URL 授权拦截，因此代理自动登录不是本问题的原因。

### 不是 `authenticated()` 失效

如果 `authenticated()` 的语义整体失效，那么所有命中该表达式的接口应该表现一致。实际结果却与请求路径有关：`collection/list` 仍然被拦截，而具体 action 接口被放行。因此，应继续分析最终生成的规则，而不是只检查当前的 `Authentication` 对象。

## 根因：重复 matcher 替换了授权属性

这个问题需要同时理解两个规则：

1. **匹配时按顺序取第一条命中项。** 更具体的路径必须排在更宽泛的路径之前。
2. **构建规则表时，重复的 matcher 会合并。** 后注册项替换前一项的授权属性，但不会自动移动到队尾。

### `antMatchers` 产生的 matcher 可以相等

在 Spring Security 5.6.2 中，`antMatchers` 会创建 `AntPathRequestMatcher`：

```java
// ExpressionUrlAuthorizationConfigurer
public C antMatchers(String... antPatterns) {
    return chainRequestMatchers(RequestMatchers.antMatchers(antPatterns));
}
```

`AntPathRequestMatcher` 的 `equals()` 和 `hashCode()` 会比较 URL pattern、HTTP method 和大小写配置：

```java
@Override
public boolean equals(Object obj) {
    if (!(obj instanceof AntPathRequestMatcher)) {
        return false;
    }
    AntPathRequestMatcher other = (AntPathRequestMatcher) obj;
    return this.pattern.equals(other.pattern)
            && this.httpMethod == other.httpMethod
            && this.caseSensitive == other.caseSensitive;
}

@Override
public int hashCode() {
    int result = this.pattern != null ? this.pattern.hashCode() : 0;
    result = 31 * result + (this.httpMethod != null ? this.httpMethod.hashCode() : 0);
    return 31 * result + (this.caseSensitive ? 1231 : 1237);
}
```

业务规则和基类默认规则中都出现了完全相同的 pattern：

```text
/service/rest/tk.File/**
```

在 matcher 的 HTTP method 和大小写配置也相同的前提下，这两个 `AntPathRequestMatcher` 实例满足 `equals()`，因此会被 `LinkedHashMap` 当作同一个 key。这里被替换的是授权属性，不是 matcher 的匹配逻辑本身。

### `LinkedHashMap` 替换 value，但保留 key 的位置

Spring Security 5.6.2 在构建安全元数据时使用有序的 `LinkedHashMap`：

```java
// AbstractConfigAttributeRequestMatcherRegistry#createRequestMap
final LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>> createRequestMap() {
    LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>> requestMap = new LinkedHashMap<>();
    for (UrlMapping mapping : getUrlMappings()) {
        RequestMatcher matcher = mapping.getRequestMatcher();
        Collection<ConfigAttribute> configAttrs = mapping.getConfigAttrs();
        requestMap.put(matcher, configAttrs);
    }
    return requestMap;
}
```

对 `LinkedHashMap` 来说，向已经存在且 `equals()` 相等的 key 再次调用 `put()` 有两个结果：

1. 不会增加第二个 entry；
2. 会替换原 entry 的 value，但保留原 key 的插入位置。

因此，和本问题直接相关的最终规则顺序可以简化为下面这样（省略 `authorizeRequestAfterDefault` 以及最后的 `anyRequest().denyAll()`）：

```text
/service/rest/tk.File/collection/list  → hasRole(ADMIN)        ← 业务先注册
/service/rest/tk.File/**               → permitAll()           ← 业务位置，value 被默认规则替换
/service/rest/tk.File/**/cropImage     → hasRole(ADMIN)
/service/rest/tk.File/**/jcropIframe   → hasRole(ADMIN)
/service/rest/tk.File/**/info          → authenticated()
/service/rest/tk.File/**/listByIds     → hasRole(ADMIN)
/service/rest/tk.File/**/meta          → hasRole(ADMIN)
/service/rest/tk.File/**/upload        → authenticated()
/service/rest/tk.File/**/uploadImage   → hasRole(ADMIN)
```

也就是说，业务配置中的 `authenticated()` 没有形成一条独立的规则去覆盖默认的 `permitAll()`。相反，默认规则后注册的 `permitAll()` 替换了相同 matcher 原来的授权属性，同时让这个宽泛 matcher 继续排在所有默认 action 规则之前。

### 匹配时只取第一条命中项

`DefaultFilterInvocationSecurityMetadataSource` 会按照 map 的顺序返回第一条匹配规则：

```java
// DefaultFilterInvocationSecurityMetadataSource#getAttributes
for (Map.Entry<RequestMatcher, Collection<ConfigAttribute>> entry
        : this.requestMap.entrySet()) {
    if (entry.getKey().matches(request)) {
        return entry.getValue();
    }
}
return null;
```

以 `tk.File/x/cropImage` 为例，请求首先命中位于第二行的 `/service/rest/tk.File/**`，取得的授权属性却是 `permitAll()`；后面的 `/service/rest/tk.File/**/cropImage` 根本没有机会参与匹配。

`meta`、`listByIds`、`uploadImage`、`info` 等接口也是同样的原因。

### 为什么 `collection/list` 仍然被拦截

业务配置中的 `/service/rest/tk.File/collection/list` 是另一个 matcher，不会被 `/service/rest/tk.File/**` 的重复 key 替换，而且它位于宽泛 matcher 之前：

```text
/service/rest/tk.File/collection/list  → hasRole(ADMIN)
/service/rest/tk.File/**               → permitAll()
```

所以访问 `collection/list` 时，会先命中精确的角色规则，而不是宽泛的 `permitAll()`。

**注意：** `tk.File/x/list` 与 `collection/list` 是两个不同的业务动作。`x/list` 会由 `RestServer` 按 `tk.File.list` 分发；如果 `FileController` 没有这个 action，它可能返回 action not found，而不是进入 `collection/list` 的精确规则。线上若观察到 `x/list` 被拦截，应继续核对实际请求路径、容器转发和部署版本，不能直接归因于 `collection/list`。

### 为什么多个 action 共享这一组 URL matcher

Homolo Boot 的 `tk.File` 并不是为每个方法单独声明 Spring MVC 的 `@RequestMapping`，而是使用框架自己的服务与 action 注解。下面是简化示意，并非完整源码：

```java
@RestService(name = "tk.File")
public class FileController {
    @ActionMethod
    public Object meta() { /* ... */ }

    @ActionMethod
    public Object info(RequestParameters params) { /* ... */ }
}

@RestController
@RequestMapping("/service/rest")
public class RestServer {
    @GetMapping("/{module}/{resource}/{action}")
    public Object getHandleResourceAction(/* ... */) {
        // 通过 RestServiceRegistry 查找服务和 action
    }
}
```

因此，多个文件操作最终会落在 `/service/rest/tk.File/...` 这一组 URL 下。这个架构解释了为什么一个宽泛 matcher 能覆盖多个 action，但它不是本次问题的根因；根因仍然是重复 matcher 在 `LinkedHashMap` 中替换了授权属性。

## 修复方式

### 只想恢复 Homolo Boot 的默认权限

删除业务中重复声明的宽泛 matcher；如果业务确实需要额外限制 `collection/list`，只保留那条精确规则：

```java
@Override
protected void authorizeRequestBeforeDefault(
        ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry registry) {
    registry
            .antMatchers("/service/rest/tk.File/collection/list")
            .hasRole(Role.ADMIN_ROLE_ID);

    // 不要再次声明与默认规则相同的 /service/rest/tk.File/**
}
```

这样，默认 action 规则会排在默认的宽泛兜底规则之前，`cropImage`、`meta` 等接口会恢复各自的默认权限。

### 业务需要接管整组规则

如果业务目标不是恢复默认权限，而是让整个 `tk.File` 目录都必须登录，就不要把一条宽泛规则拆到 `before`，再把具体规则留给 `default`。应先禁用或调整框架默认规则，然后由同一个 registry 一次性注册完整规则表，并把具体 matcher 放在宽泛 matcher 之前。下面只展示规则顺序，其他需要特殊权限的 action 也应一并列出：

```java
// 仅在默认 tk.File 规则不会同时注册时使用
registry
        .antMatchers("/service/rest/tk.File/**/cropImage")
        .hasRole(Role.ADMIN_ROLE_ID)
        .antMatchers("/service/rest/tk.File/**/meta")
        .hasRole(Role.ADMIN_ROLE_ID)
        .antMatchers("/service/rest/tk.File/**/upload")
        .authenticated()
        // ... 继续列出其他需要特殊权限的 action
        .antMatchers("/service/rest/tk.File/**")
        .authenticated();
```

不能只把具体 action 规则移动到 `authorizeRequestAfterDefault`：如果 `/service/rest/tk.File/**` 已经位于最终规则表前面，后置的具体规则仍然不会被访问。也不要在同一个 registry 中复制一份默认规则，或仅凭 `before`、`after` 这类方法名推断优先级；应检查最终生成的 matcher 列表和授权属性。

## 排查清单

遇到类似问题时，不要只看 Java 配置的书写顺序，还应检查：

1. `antMatchers` 实际创建的 matcher 类型；
2. matcher 的 `equals()` 和 `hashCode()` 是否会把两条规则视为同一个 key；
3. 规则最终写入的集合类型及其顺序语义；
4. 重复 key 写入时是追加、覆盖，还是抛出异常；
5. 最终 `FilterInvocationSecurityMetadataSource` 中的 matcher 顺序和授权属性；
6. 请求是否携带了 Cookie、代理 token、JWT 或其他会话凭据。

如果手头有对应版本的 Spring Security 源码包，可以直接查看 `createRequestMap()`：

```shell
# 将 sources.jar 放在当前目录，版本号按实际依赖调整
unzip -p spring-security-config-5.6.2-sources.jar \
  org/springframework/security/config/annotation/web/configurers/AbstractConfigAttributeRequestMatcherRegistry.java \
  | grep -nE 'createRequestMap|requestMap\.put'
```

实际请求也应使用完全匿名的方式验证，避免把代理 token、JWT、Cookie 或浏览器已有会话误认为权限来源：

```shell
curl --noproxy '*' -sS -D - -o /dev/null \
  http://localhost:8182/backend/service/rest/tk.File/x/cropImage
```

同时记录：

- HTTP status；
- `Location`；
- `Set-Cookie`；
- 响应体是否来自 `RestServer` 或 `FileController`；
- 当前进程启动时间和实际加载的 class 时间。

## 结论

本次问题的根因既不是 Homolo Boot 没有定义 `tk.File` 默认权限，也不是匿名用户被错误识别为已认证用户，更不是代理 token 自动登录。

实际发生的是两条等价规则先后进入同一个 map：

```text
业务 before 规则：  /service/rest/tk.File/** → authenticated()
框架 default 规则： /service/rest/tk.File/** → permitAll()
```

两个 `AntPathRequestMatcher` 相等，所以后注册的 `permitAll()` 替换了前一条规则的授权属性，却保留了宽泛 matcher 原来的插入位置。它因此在具体的 `cropImage`、`meta`、`listByIds`、`uploadImage` 等规则之前命中，把这些请求从 URL 授权层放行。

> **记住：** Spring Security URL 规则既要看“谁先注册”，也要看“最终 map 如何合并”。不要在同一个授权 registry 中重复注册完全相同的 matcher，尤其不要以为后面的规则一定会追加成第二条规则；在基于 map 的规则集合中，它可能只是一次 value 覆盖。

## 参考源码

- [ExpressionUrlAuthorizationConfigurer（Spring Security 5.6.2）](https://github.com/spring-projects/spring-security/blob/5.6.2/config/src/main/java/org/springframework/security/config/annotation/web/configurers/ExpressionUrlAuthorizationConfigurer.java)
- [AbstractConfigAttributeRequestMatcherRegistry（Spring Security 5.6.2）](https://github.com/spring-projects/spring-security/blob/5.6.2/config/src/main/java/org/springframework/security/config/annotation/web/configurers/AbstractConfigAttributeRequestMatcherRegistry.java)
- [AntPathRequestMatcher（Spring Security 5.6.2）](https://github.com/spring-projects/spring-security/blob/5.6.2/web/src/main/java/org/springframework/security/web/util/matcher/AntPathRequestMatcher.java)
