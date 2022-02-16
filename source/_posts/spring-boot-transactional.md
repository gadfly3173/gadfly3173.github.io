---
title: Spring Boot 开发笔记 - @Transactional 注解使用浅析
layout: post
date: 2020-04-12 15:08:19
categories: 开发
tags:
- java
- spring
- 后端
permalink:
hide_post_info:
---
Spring Boot 中对方法开启事务管理非常轻松，只需要 `@Transactional` 注解就可以让方法开启事务，然而不了解其机制时使用可能会导致其失效。
<!--More-->
`@Transactional` 本质是一个 AOP 动态代理，不需要开发者干预。下面来一个代码例子：

```java
@Service
public class UserService {

 @Autowired
 private UserMapper userMapper;

 @Transactional(propagation=Propagation.REQUIRED,isolation=Isolation.DEFAULT,readOnly=false)
 public void insert01(User u){
  this.userMapper.insert(u);
  throw new RuntimeException("测试插入事务");
 }

 public void insert02(User u){
  this.insert01(u);
  throw new RuntimeException("测试插入事务");
 }
```

在这个例子中，调用 `insert01` 时，事务的执行不会有任何问题，但是调用 `insert02` 时，异常被正常抛出，但是数据依然被插入了数据库，说明事务没有被正常执行。
在外部调用 `insert01` 时，调用的就是被动态代理的 `insert01`，但是如果在一个类里自调用时，这样是无法调用到代理对象的，所以 `insert02` 中调用的不是代理对象 `insert01`，而是原本的方法。当然，原本的对象中是没有切片做事务增强的，自然也不能进行事务回滚。

一般的事务代理机制：
![](/images/posts/2020/04/20170608105830399.jpg)

自调用时，通过 `this` 只能取到原本的方法：
![](/images/posts/2020/04/20170608110005451.jpg)

那么如何解决自调用失效的问题呢？

- 最佳实践自然是不要产生自调用。
- 如果无法避免的话，那么可以只在 `insert02` 上注解事务。（如果两个方法都要被外部调用，那就两个都写上）
- `insert01` 开启事务，并且在 `insert02` 中不使用 `this` 调用，而是获取代理

  ```java
  public void insert02(User u){
      getService().insert01(u);
    }
    private UserService getService(){
      // 采取这种方式的话
      // @EnableAspectJAutoProxy(exposeProxy=true,proxyTargetClass=true)
      // 必须设置为true
      return AopContext.currentProxy() != null ? (UserService)AopContext.currentProxy() : this;
    }
  ```

- 从 `beanFactory` 中获取对象。Controller 中的 `UserService` 是代理对象，它是从 `beanFactory` 中得来的，那么 Service 类内调用其他方法时，也先从 `beanFacotry` 中拿出来就OK了。

  ```java
  public void insert02(User u){
    getService().insert01(u);
  }
  private UserService getService(){
    return SpringContextUtil.getBean(this.getClass());
  }
  ```

有关 AOP 和代理的问题可以看 [从代理机制到Spring AOP](https://juejin.im/post/5b90e648f265da0aea695672) 和 [Spring AOP就是这么简单啦](https://juejin.im/post/5b06bf2df265da0de2574ee1)。这两篇文章讲得很清楚了。

除了代理导致的自调用失效，还有一个问题是方法抛出异常时，事务也没有回滚。这个则是因为 `@Transactional` 中捕获的异常只有 `RuntimeException`。
DefaultTransactionAttribute.java 源码中写的是：

```java
@Override
public boolean rollbackOn(Throwable ex) {
  return (ex instanceof RuntimeException || ex instanceof Error);
}
```

所以需要捕获其他异常时，必须把注解写成

```java
@Transactional( rollbackFor = Exception.class )
```

更详细的使用要点可以看来自 IBM Developer 的 [透彻的掌握 Spring 中@transactional 的使用](https://www.ibm.com/developerworks/cn/java/j-master-spring-transactional-use/index.html)
