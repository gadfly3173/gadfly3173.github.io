---
title: Spring Security 5 中重复的 antMatchers 会覆盖已有的授权规则
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

最近在一个 Homolo Boot 5.2.2 项目里排查文件接口的权限问题：业务项目只在 `authorizeRequestBeforeDefault` 中增加了两条规则，`tk.File` 下的大部分接口反而变得匿名可访问；注释掉这两条规则，框架的默认权限又恢复正常。

这篇文章记录问题的成因、修复方法与排查思路。核心结论是一句话：Spring Security 5.6.2 在构建 URL 授权规则表时会合并重复的 `antMatchers`，后注册的规则替换先前那条规则的授权属性，同时保留它的位置。

> **版本说明：** `5.2.2` 是 Homolo Boot 的版本号。项目的 `homolo-boot` POM 继承 Spring Boot `2.6.6`，由其依赖管理提供 Spring Security `5.6.2`；`homolo-boot-core` 通过 `spring-boot-starter-security` 引入这一组依赖。

> 本文所说的“匿名可访问”，指请求没有被 Spring Security 的 URL 授权规则拦截；接口内部可能还有额外的业务校验。

## 遇到了什么问题

业务项目希望通过两条规则收紧 `tk.File` 的权限：`collection/list` 要求管理员角色，其余接口必须登录。配置写在 `authorizeRequestBeforeDefault` 中：

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

随后，Homolo Boot 基类会注册自己的默认规则：

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

三个配置方法的调用顺序固定为：

```java
authorizeRequestBeforeDefault(registry);
authorizeRequestDefault(registry);
authorizeRequestAfterDefault(registry);
registry.anyRequest().denyAll();
```

按这套配置的写法，业务规则先注册，理应先于默认规则参与匹配；`authenticated()` 也比默认的 `permitAll()` 更严格。带这两条业务规则的版本实测结果如下：

| 请求 | 实际表现 |
| --- | --- |
| `tk.File/x/cropImage` | 匿名可访问 |
| `tk.File/x/meta` | 匿名可访问 |
| `tk.File/x/uploadImage` | 匿名可访问 |
| `tk.File/x/listByIds` | 匿名可访问 |
| `tk.File/x/info` | 匿名可访问 |
| `tk.File/collection/list` | 要求相应角色 |

> 表格中的验证使用不带 `Cookie`、`Authorization` 和 `justice-cloud-proxy-token` 的 `curl` 请求发起，结果不受代理 token 自动登录的影响。

`tk.File/x/list` 的情况需要单独核对：这类请求由 `RestServer` 按 `tk.File.list` 分发；如果 `FileController` 没有定义 `list` 这个 action，请求可能直接返回 action not found。判断它的真实表现之前，应先核实实际请求路径、容器转发和部署版本。

## 原因分析

原因涉及两个环节的共同作用，缺一不可：一是请求匹配时按顺序取第一条命中的规则；二是规则表在构建阶段就会合并重复的 matcher。

### 相同的 pattern 会生成相等的 matcher

在 Spring Security 5.6.2 中，`antMatchers` 创建的对象类型是 `AntPathRequestMatcher`：

```java
// ExpressionUrlAuthorizationConfigurer
public C antMatchers(String... antPatterns) {
    return chainRequestMatchers(RequestMatchers.antMatchers(antPatterns));
}
```

`AntPathRequestMatcher` 实现 `equals()` 和 `hashCode()` 时比较三项内容：URL pattern、HTTP method 和大小写配置：

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

业务规则和默认规则恰好声明了完全相同的 pattern：

```text
/service/rest/tk.File/**
```

两者的 HTTP method 和大小写配置也一致，于是这两个 matcher 满足 `equals()`，对存储规则表的 map 来说是同一个 key。

### 规则表用 LinkedHashMap 存储，重复写入替换 value、保留位置

Spring Security 5.6.2 构建安全元数据时，把所有规则整理进一个有序 map：

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

对 `LinkedHashMap` 来说，向一个已经存在的 key 再次 `put()` 会产生两个效果：

1. entry 数量不增加；
2. value 被新值替换，entry 仍保持在第一次插入时的位置。

把这个行为套到两组规则上，与本问题相关的最终规则表如下（省略 `authorizeRequestAfterDefault` 与末尾的 `anyRequest().denyAll()`）：

```text
/service/rest/tk.File/collection/list  → hasRole(ADMIN)     ← 业务注册，pattern 不同，未被覆盖
/service/rest/tk.File/**               → permitAll()       ← 位置来自业务规则，value 来自默认规则
/service/rest/tk.File/**/cropImage     → hasRole(ADMIN)
/service/rest/tk.File/**/jcropIframe   → hasRole(ADMIN)
/service/rest/tk.File/**/info          → authenticated()
/service/rest/tk.File/**/listByIds     → hasRole(ADMIN)
/service/rest/tk.File/**/meta          → hasRole(ADMIN)
/service/rest/tk.File/**/upload        → authenticated()
/service/rest/tk.File/**/uploadImage   → hasRole(ADMIN)
```

业务声明的 `authenticated()` 就是这样消失的：它写入时的位置在最前面，随后默认规则又声明了一次相同的 matcher，`permitAll()` 替换了原有的授权属性，entry 的位置却没有移动。这条宽泛规则于是继续排在所有具体 action 规则前面，含义却变成了“全部放行”。

### 请求只会命中顺序上的第一条规则

`DefaultFilterInvocationSecurityMetadataSource` 按照上一节的 map 顺序遍历规则，返回第一条命中的规则的授权属性：

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

以 `tk.File/x/cropImage` 为例：请求先命中位于第二行的 `/service/rest/tk.File/**`，拿到的授权属性是 `permitAll()`；后面的 `/service/rest/tk.File/**/cropImage` 再也没有机会参与匹配。`meta`、`listByIds`、`uploadImage`、`info` 等接口同理，全部被这条位置靠前的宽泛规则放行。

### collection/list 正常生效的原因

`/service/rest/tk.File/collection/list` 是另一个 pattern，对应的 matcher 与宽泛规则不相等，进入 map 后独立成条，保留了业务预期的授权属性；同时它排在宽泛规则之前，请求到达时先被它命中，`hasRole` 校验得以正常执行。

### 背景：众多 action 共用一组 URL

这个项目中，`tk.File` 的各个操作共用 `/service/rest/tk.File/...` 一组 URL。控制器的组织方式如下（简化示意）：

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

各方法使用框架自带的 `@RestService` 与 `@ActionMethod` 注解标注，由 `RestServer` 统一分发，因此一个宽泛 matcher 就能覆盖大量接口。这一点解释了问题的波及面为何如此之广；覆盖行为的成因仍在前文的 map 合并逻辑。

## 修复方式

按照业务目标分两种情况处理。

### 目标一：恢复框架默认权限

删除业务中重复声明的宽泛 matcher，只保留那条精确规则：

```java
@Override
protected void authorizeRequestBeforeDefault(
        ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry registry) {
    registry
            .antMatchers("/service/rest/tk.File/collection/list")
            .hasRole(Role.ADMIN_ROLE_ID);

    // 这里不要再声明与默认规则相同的 /service/rest/tk.File/**
}
```

此时默认的各个 action 规则会先于默认的宽泛规则命中，`cropImage`、`meta` 等接口恢复各自的默认权限。

### 目标二：自定义整组 tk.File 权限

让整个 `tk.File` 目录都必须登录时，把整组规则集中到同一个阶段注册：先列出需要特殊权限的具体 action，最后再用宽泛 matcher 收尾：

```java
// 前提：默认的 tk.File 规则不再另行注册
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

两点提醒：

1. 具体规则与宽泛规则应在同一批次内注册，并且具体的在前。只把具体规则挪进 `authorizeRequestAfterDefault` 行不通——宽泛规则已经写在前面，后置的具体规则永远不会被命中。
2. 仅凭 `before`、`after` 这类方法名推断优先级不够可靠；注册完成后，应核对最终生成的 matcher 列表与各自的授权属性。

## 这一机制的可用之处

理解了覆盖规则，它可以反过来看作一种能力：

- **改写已有规则的授权属性。** 框架先注册了一条默认规则，业务希望调整它的严格程度时，在更晚的阶段（例如 `authorizeRequestAfterDefault`）重新声明相同的 `antMatchers`，新属性会替换旧值。由于 entry 的位置保留不动，一般也不必担心打乱原有排序。
- **明确何时得不到新规则。** 想在同一个 registry 中新增一条独立规则时，要让 matcher 彼此有所区别（限定 HTTP method、使用不同的 pattern 等）。完全相同的 matcher 进入 map 后，得到的效果只是一次属性覆盖，期待中的第二条独立规则并不存在。

本例恰好演示了误用方向：本意是追加一条更严格的规则，实际发生的却是默认值的覆盖，宽泛 matcher 还停留在了最前面。每次声明可能与现有规则重复的 matcher 时，先想清楚需要的是哪一种效果。

## 类似问题的排查方法

排查同类权限问题时，建议按下面的顺序进行。

**第一步：核实运行的代码与预期版本一致。**

确认线上进程的启动时间和实际加载 class 的时间，必要时比对 jar 内容。本例中线上行为与当前代码一致，后续排查才得以聚焦在权限模型本身。

**第二步：用完全匿名的请求复现。**

Cookie、`Authorization`、代理 token、JWT、浏览器已有会话都会改变鉴权结果，验证时应逐项剥离。命令示例：

```shell
curl --noproxy '*' -sS -D - -o /dev/null \
  http://localhost:8182/backend/service/rest/tk.File/x/cropImage
```

同时记录 HTTP status、`Location`、`Set-Cookie` 以及响应体的来源（出自 `RestServer` 还是具体的 `FileController`）。本例在剥离全部凭据后依旧复现，代理 token 自动登录的因素随之排除。

**第三步：检查运行期的最终规则表。**

反复端详 Java 配置的书写顺序收效有限，有效的做法是确认运行期真实的规则集合：

1. `antMatchers` 实际创建的 matcher 类型；
2. matcher 的 `equals()` 与 `hashCode()` 会不会把两条规则判定为同一个 key；
3. 规则最终写入的集合类型及其顺序语义；
4. 重复 key 写入时发生的是追加、覆盖还是抛出异常；
5. 运行期 `FilterInvocationSecurityMetadataSource` 中各 matcher 的顺序与授权属性；
6. 请求路径是否经过容器转发或 context path 重写。

如果有对应版本的 Spring Security 源码包，可以直接查看 `createRequestMap()` 的实现：

```shell
# 将 sources.jar 放在当前目录，版本号按实际依赖调整
unzip -p spring-security-config-5.6.2-sources.jar \
  org/springframework/security/config/annotation/web/configurers/AbstractConfigAttributeRequestMatcherRegistry.java \
  | grep -nE 'createRequestMap|requestMap\.put'
```

## 小结

回顾整个链条：业务的 `authenticated()` 与默认规则的 `permitAll()` 声明了同一个 `/service/rest/tk.File/**`；两个 `AntPathRequestMatcher` 相等，在 `LinkedHashMap` 中后到的 `permitAll()` 覆盖了先前的授权属性，entry 的位置停留在最前面；请求按顺序匹配第一条命中的规则，具体 action 规则再也没有出场机会，`cropImage`、`meta`、`listByIds`、`uploadImage` 等接口就这样对外放行了。

URL 授权规则的行为由两件事共同决定：注册顺序决定 matcher 在规则表中的位置，map 合并决定它的最终授权属性。维护这类配置时，保持每个 matcher 唯一；确需调整已有规则的授权属性时，在其注册之后的阶段重新声明，并核对最终生成的规则表，就能避开这一类隐蔽的权限回归。

## 参考源码

- [ExpressionUrlAuthorizationConfigurer（Spring Security 5.6.2）](https://github.com/spring-projects/spring-security/blob/5.6.2/config/src/main/java/org/springframework/security/config/annotation/web/configurers/ExpressionUrlAuthorizationConfigurer.java)
- [AbstractConfigAttributeRequestMatcherRegistry（Spring Security 5.6.2）](https://github.com/spring-projects/spring-security/blob/5.6.2/config/src/main/java/org/springframework/security/config/annotation/web/configurers/AbstractConfigAttributeRequestMatcherRegistry.java)
- [AntPathRequestMatcher（Spring Security 5.6.2）](https://github.com/spring-projects/spring-security/blob/5.6.2/web/src/main/java/org/springframework/security/web/util/matcher/AntPathRequestMatcher.java)
