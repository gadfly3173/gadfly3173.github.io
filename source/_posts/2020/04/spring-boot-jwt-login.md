---
title: Spring Boot 开发笔记 - JSON Web Token 与登录鉴权设计
layout: post
date: 2020-04-09 12:49:04
categories: 开发
tags:
- java
- spring
- 后端
permalink:
hide_post_info:
---
Spring Boot 开发笔记系列第二弹，这次来聊聊 JWT 和登录鉴权系统的设计。
<!--More-->
阮一峰的 [JSON Web Token 入门教程](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html) 里把 JWT 的概念都讲得很清楚了。既然它被称为 Token，那么自然是作为令牌，用来验证身份的存在。传统的 Session, Cookie 等都承担着类似的功能。JWT 的独特之处在于它可以承载一定的信息，是一种无状态的令牌。验证其是否有效的工作可以不需要经过数据库或者缓存等，如果加密 JWT 的密钥在后端是固定的或者通过其承载的信息可以算出来的，那么验证与下发都可以极大的减少服务器压力。而它本身可以承载的信息中可以加上不敏感的内容，比如用户 id 或者用户名等等，在不经过数据库操作的时候就能判断用户的合法性，完成一定的操作。
当然这样的设计也有局限性，比如我的项目中需要保证用户不会在多处同时登录，但是 JWT 验证 Token 只根据它其中包含的过期时间信息，后端不能在用户使用第二台设备登录时作废第一台设备的登录信息，这可能导致一定的安全隐患。因此我在项目中引入了 Redis 缓存，每次下发 Token 时生成随机密钥，这个密钥与用户信息绑定，与 Token 拥有相同的过期时间并存在 Redis 中。Redis 的原理使得这样的操作不会增加太多的开销，又能让 JWT 依然承担传递信息的任务。

### JWT 相关的设计

首先来一个 JWT 的工具类：

```java
@Component
public class JWTUtil {
    private final RedisUtils nonStaticRedisUtils;

    private static RedisUtils redisUtils;

    public JWTUtil(RedisUtils nonStaticRedisUtils) {
        this.nonStaticRedisUtils = nonStaticRedisUtils;
    }

    @PostConstruct
    public void init() {
        redisUtils = nonStaticRedisUtils;
    }

    // 过期时间7天
    private static final long EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000;

    /**
     * 生成签名,7days后过期
     *
     * @param openid qq_openid
     * @return 加密的token
     */
    public static String sign(String openid, String access_level) {
        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);
        if (redisUtils.hasKey(openid)) {
            redisUtils.del(openid);
        }
        String secret = UUID.randomUUID().toString();
        Algorithm algorithm = Algorithm.HMAC256(secret);
        redisUtils.set(openid, secret, EXPIRE_TIME);
        logger.info(openid + "&" + secret);

        // 附带openid信息
        return JWT.create()
                .withClaim("openid", openid)
                .withClaim("access_level", access_level)
                .withExpiresAt(date)
                .sign(algorithm);
    }

    /**
     * 校验token是否正确
     *
     * @param token  密钥
     * @return 是否正确
     */
    public static boolean verify(String token, String openid, String access_level) {
        try {
            String secret = redisUtils.get(openid);
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withClaim("openid", openid)
                    .withClaim("access_level", access_level)
                    .build();
            DecodedJWT jwt = verifier.verify(token);
        } catch (JWTVerificationException exception) {
            return false;
        }
        return true;
    }

    /**
     * 获得token中的信息无需secret解密也能获得
     *
     * @return token中包含的openid
     */
    public static String getOpenid(String token) {
        DecodedJWT jwt = JWT.decode(token);
        return jwt.getClaim("openid").asString();
    }
    public static String getAccessLevel(String token) {
        DecodedJWT jwt = JWT.decode(token);
        return jwt.getClaim("access_level").asString();
    }

}
```

这里我使用的是 `com.auth0.java-jwt`，换成 `io.jsonwebtoken.jjwt` 也不会有太大的区别，都是对 JWT 标准的实现，只是接口上不太相同。我在 JWT 的载荷中存放了用户的 open id 和权限级别，这样在不查询数据库的情况下就可以判断用户是否有权操作部分敏感接口。签名部分的加密方式选择了默认的 SHA-256，换成其他的也可以。至于上面那一串非静态方法注入，则是因为我在 Redis 的工具类中做成了非静态方法，这个 JWT 工具类又做成了静态方法，而把这个静态方法都换成非静态方法又遇到了一堆问题，于是我就直接把非静态方法注入这个类，再去用静态对象调用这个非静态方法。。。
下面贴一下 Redis 的工具类：

```java
@Component
public class RedisUtils {
    private final StringRedisTemplate redisTemplate;

    public RedisUtils(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public static RedisUtils redisUtils;

    /**
     * 实现命令：DEL key，删除一个key
     *
     * @param key
     */
    public void del(String key) {
        redisTemplate.delete(key);
    }

    /**
     * 实现命令：HAS key，返回bool
     *
     * @param key
     */
    public boolean hasKey(String key) {
        return redisTemplate.hasKey(key);
    }

    /**
     * 实现命令：SET key value EX seconds，设置key-value和超时时间（秒）
     *
     * @param key
     * @param value
     * @param timeout
     *            （以ms为单位）
     */
    public void set(String key, String value, long timeout) {
        redisTemplate.opsForValue().set(key, value, timeout, TimeUnit.MILLISECONDS);
    }

    /**
     * 实现命令：GET key，返回 key所关联的字符串值。
     *
     * @param key
     * @return value
     */
    public String get(String key) {
        return redisTemplate.opsForValue().get(key);
    }
}

```

本身写的时候还有很多其他方法，这里就只展示用到的了。总的来说比较简单，Redis 也是属于 non-SQL 数据库，只有键值对，操作很方便。需要注意的是 `redisTemplate` 设置过期时间时，默认是以秒为单位，有需要的话就在后面加上 `TimeUnit`。

### 鉴权系统的设计

显然鉴权处理不应该在每个 Controller 里分别判断，而应该作为一个全局方法，在请求到达 Controller 之前就处理完成。Spring Boot 自带 `HandlerInterceptor` 接口，因此我们只需要将其实现。

```java
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("X-token");
        if ("".equals(token) || token == null || !JWTUtil.verify(token, JWTUtil.getOpenid(token), JWTUtil.getAccessLevel(token)))  {
            returnJson(response, GlobalJSONResult.errorTokenMsg("登录信息无效，请重新登录！"));
            return false;
        }
        return true;
    }


    private void returnJson(HttpServletResponse response, Object json) throws Exception{
        ObjectMapper mapper = new ObjectMapper();
        String strJson = mapper.writeValueAsString(json);
        PrintWriter writer = null;
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        try {
            writer = response.getWriter();
            writer.write(strJson);

        } catch (IOException e) {
        } finally {
            if (writer != null)
                writer.close();
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
}
```

由于我按照 Restful API 的思路来构建的后端，因此登录处理失败时的返回也应该为 JSON。然而正常情况下在这里只能返回文字流。于是我在这里做了一个 `returnJson` 的方法，将我需要返回的 JSON 转为 String，再在返回的 Header 上加上 ContentType，使得客户端浏览器将其转为 JSON。鉴权则很简单，客户端发起请求时把 Token 放在请求头里，这里从 `HttpServletRequest` 中获得请求头中的字段进行认证即可。
现在完成了登录的鉴权处理，但是后端接收的请求并不会自己跑过来，需要配置一个全局拦截器。Spring Boot 有着 `WebMvcConfigurer` 的接口，将其实现即可完成我们的想法。

```java
@Configuration
@EnableWebMvc
public class CustomWebConfigurer implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor()).addPathPatterns("/**").excludePathPatterns("/login/**");
    }
}
```

把它注册为一个配置类，在其中注册刚才的登录拦截器，添加 `/**` 路径，把所有请求都转到拦截器中，当然，登录之类的接口不能走拦截器，因此还要添加例外。

这样，一个基本的未登录用户的拦截功能就做完了。由于我的项目中权限只有两级，敏感权限也没几个，所以只是另外写了个工具类判断是否有高级权限，并没有做进拦截器里。
