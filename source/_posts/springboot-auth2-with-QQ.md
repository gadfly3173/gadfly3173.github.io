---
title: Spring Boot 开发笔记 - 使用 Spring Boot 完成 Server-Side 模式的 QQ 第三方登录
layout: post
date: 2020-04-08 17:29:38
categories: 开发
tags:
- java
- spring
- 后端
permalink:
visible:
---
写这个主要是为了整理开发思路与记录，顺便表示 QQ 的接口真的写的很奇怪。。。
<!--More-->
整个项目是一个课程作业，我选择了后端使用 Spring Boot，前端使用 Vue.js 作为项目的技术栈。首先说一下 Auth 2.0。这个在QQ的文档里倒也写的很清楚 [OAuth2.0简介 — QQ互联WIKI](https://wiki.connect.qq.com/oauth2-0%E7%AE%80%E4%BB%8B)。它采用第三方应用在客户端根据自己的 AppId 和 Redirect URI（回调地址）来请求QQ的授权页面，用户授权后将 Authentication Code 作为 params 跳转到回调地址，回调地址将这个 Code 传给后端，由后端根据 AppId 和 Secret 再向 QQ 申请用户登录的 Access Token，根据这个 Token 后端才能去获取用户授权的相关信息。第三方应用中每个用户都有一个唯一的 OpenId 用于对应唯一的用户，但是不同第三方应用对相同的用户拿到的 OpenId 则是不同的。开发中参考了 [使用java后端的springboot环境下实现网站接入QQ第三方登录](https://segmentfault.com/a/1190000020181967)，因此避免了很多坑。

### 获取 Access Token

QQ 官方文档在这里 [传送门](https://wiki.connect.qq.com/%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C_oauth2-0)。这份文档对于没有开发经验的人来说坑实在是太多，不过相比其他平台还是比较友好的。参考文章中是使用了读取配置的方式，我则是写了一个返回secret等内容的工具类来获取 QQ 相关配置。
基本代码如下：

```java
@PostMapping(value = "/login/callback", consumes= { MediaType.APPLICATION_JSON_VALUE})
public GlobalJSONResult handleCallbackCode(@RequestBody LoginCode reqParams) throws JsonProcessingException {
    String authorization_code = reqParams.getCode();
    if (StringUtils.isBlank(authorization_code)) {
        return GlobalJSONResult.errorMsg("code无效，请重新授权！");
    }
    //client端的状态值。用于第三方应用防止CSRF攻击。
    String state = reqParams.getState();
    if (!state.equals("login")) {
        return GlobalJSONResult.errorMsg("state无效，请确认是否为本人操作！");
    }
    String access_token = getAccessToken(authorization_code);
    if (StringUtils.isBlank(access_token)) {
        return GlobalJSONResult.errorMsg("access_token获取失败，请重新授权！");
    }
    // 下略
}

private String getAccessToken(String authorization_code) {
    String urlForAccessToken = getUrlForAccessToken(authorization_code);
    String firstCallbackInfo = restTemplate.getForObject(urlForAccessToken, String.class);
    String[] params = firstCallbackInfo.split("&");
    String access_token = null;
    for (String param : params) {
        String[] keyvalue = param.split("=");
        if (keyvalue[0].equals("access_token")) {
            access_token = keyvalue[1];
            break;
        }
    }
    return access_token;
}

private static String getUrlForAccessToken(String authorization_code) {
    String grant_type = "authorization_code";
    String client_id = QQLoginUtil.getQQLoginClientId();
    String client_secret = QQLoginUtil.getQQLoginClientSecret();
    String redirect_uri = QQLoginUtil.getQQLoginRedirectUri();

    String url = String.format("https://graph.qq.com/oauth2.0/token" +
                    "?grant_type=%s&client_id=%s&client_secret=%s&code=%s&redirect_uri=%s",
            grant_type, client_id, client_secret, authorization_code, redirect_uri);

    return url;
}
```

其中 `GlobalJSONResult` 是我编写的全局 JSON 返回类，有空会在其他文章中说明。QQ 在文档中要求生成 CSRF Token 一类的东西作为 state 参数上传，以避免 CSRF 攻击，不过由于我的登录系统是只有授权 QQ 登录之后才会生成账户，因此基本没有这方面的风险，就把 state 写死了。接收的 `reqParams` 则是直接前端将路由中的参数返回，Vue.js 中使用 `this.$route.query` 就可以将参数以 JSON 形式获取。

#### 解析接口返回的数据

>之后就是跳转这个URL去获取 access_token，这里就是第一个坑了，按照官方文档，搞得好像这次我们跳转到这个获取 access_token 的URL后，腾讯那边会跳转我们设定的回调地址并带上我们需要的参数，就像之前获取 authorization code 一样。但完全不是这样的！！！你按照要求向这个获取 access_token 的URL发送请求后，对方并不会再跳转，而是直接返回你一个数据，希望你获得这个数据然后处理。这有点像前端JS的异步请求后后回调函数处理data。

所以这里使用了 `restTemplate` 来发起请求。虽然很多教程里都会说使用 `@Autowired` 来注入实例，但是你会发现 IDEA 中会提示这种写法不被推荐，使用构造函数注入是更好的选择。

```java
//注入实例
private final UserInfoRepository userInfoRepository;
private final RestTemplate restTemplate;

public LoginController(UserInfoRepository userInfoRepository, RestTemplate restTemplate) {
    this.userInfoRepository = userInfoRepository;
    this.restTemplate = restTemplate;
}
```

restTemplate可以接收所有的返回参数，然而 QQ 这里采用了一个非常神奇的接口返回形式：`access_token=FE04**CCE2&expires_in=7776000&refresh_token=88E4**BE14`。请**不要**认为这是在回调地址后面加上的参数，这个就是 token 接口返回的一个**字符串**。这接口真是绝了，写的人不觉得别扭吗？？？拿到这个字符串之后只能根据 & 和 = 拆分来获取数据了。

我这边使用前端将参数上传而不是直接把回调地址设为后端地址的原因主要是考虑到拿到 Code 之后，后端处理需要一定的时间，如果不能在前端展示动画之类的内容，容易让用户不明所以，因此前端拿到参数再提交给后端，同时前端展示等待动画是更好的选择。

### 获取 Open Id

拿到这个 token 之后就可以去获取用户的 openid 了。

```java
// 上略
  String url = String.format("https://graph.qq.com/oauth2.0/me?access_token=%s", access_token);
  //第二次模拟客户端发出请求后得到的是带openid的返回数据,格式如下
  //callback( {"client_id":"YOUR_APPID","openid":"YOUR_OPENID"} );
  String secondCallbackInfo = restTemplate.getForObject(url, String.class);
  //正则表达式处理
  String regex = "\\{.*\\}";
  Pattern pattern = Pattern.compile(regex);
  Matcher matcher = pattern.matcher(secondCallbackInfo);
  if (!matcher.find()) {
      logger.error("异常的回调值: " + secondCallbackInfo);
      return GlobalJSONResult.errorMsg("异常的回调值: " + secondCallbackInfo);
  }

  //调用jackson
  ObjectMapper objectMapper = new ObjectMapper();
  HashMap<String, String> hashMap = objectMapper.readValue(matcher.group(0), HashMap.class);

  String openid = hashMap.get("openid");
// 下略
```

这里 QQ 又返回了什么呢，返回了一个 JSONP 。。。形如：`callback( {"client_id":"YOUR_APPID","openid":"YOUR_OPENID"} )`不是，腾讯你们这玩意是分了几个人写啊，怎么每个接口返回格式都这么奇怪啊喂！！！处理这个则是使用正则，先把 `callback` 里的对象取出来，用 Spring Boot 自带的 Jackson 解析为 Map。

>这里有两点值得一说
>
>其一，为什么String regex = "&#92;&#92;{.*&#92;&#92;}";，正则表达式中有&#92;&#92;这东西呢？这时因为正则表达式中{和}都是有意义的，非字符的，我们希望正则表达式把它们理解成字符，就需要对它们进行转义，所以这里需要一个转义符&#92;，但&#92;自身在java字符串中并不是字符，所以我们还要转义&#92;自身，所以会出现&#92;&#92;。
>
>其二，matcher如果不经历matcher.find()，则就算有合适的匹配内容，也仍然不会有任何匹配能得到。所以matcher.find()是必须的，同时matcher.find()一次后再来一次，那完了，返回false。

### 获取用户信息与登录 Token 下发

教程到这里结束了，而我还需要完成获取用户信息等操作才能完成整个登录接口。

```java
  // 上略
    // 获取QQ用户信息
    String user_info_url = getUserInfoUrl(access_token, openid);
    String user_result = restTemplate.getForObject(user_info_url, String.class);
    Map<String, Object> user_info_qq = objectMapper.readValue(user_result, Map.class);
    if ((int) user_info_qq.get("ret") != 0) {
        return GlobalJSONResult.errorMsg("用户信息获取失败，请重试");
    }

    String token = getToken(openid, user_info_qq);

    user_info_qq.put("token", token);
    return GlobalJSONResult.ok(user_info_qq);
  // 下略

private static String getUserInfoUrl(String access_token, String openid) {
    String client_id = QQLoginUtil.getQQLoginClientId();
    String url = String.format("https://graph.qq.com/user/get_user_info" +
            "?access_token=%s&oauth_consumer_key=%s&openid=%s", access_token, client_id, openid);
    return url;
}

private String getToken(String openid, Map<String, Object> user_info_qq) {
    String uid = UUID.nameUUIDFromBytes(openid.getBytes()).toString();
    String access_level;
    if (userInfoRepository.existsById(uid)) {
        UserInfo userInfo = userInfoRepository.findById(uid).get();
        userInfo.setNickname(user_info_qq.get("nickname").toString());
        userInfo.setAvatarUrl(user_info_qq.get("figureurl_2").toString());
        userInfoRepository.save(userInfo);
        access_level = userInfo.getAccessLevel();
    } else {
        UserInfo userInfo = new UserInfo(uid, openid, user_info_qq.get("nickname").toString(),
                user_info_qq.get("figureurl_2").toString(), System.currentTimeMillis());
        userInfoRepository.save(userInfo);
        access_level = userInfo.getAccessLevel();
    }
    return JWTUtil.sign(openid, access_level);
}
```

获取用户信息的接口正常多了，返回的是 JSON。主要可以聊聊的是 JWT，不过这个也放到下次再讲吧。
