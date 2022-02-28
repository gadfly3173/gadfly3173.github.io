---
title: RabbitMQ Docker Compose Deploy
layout: post
typora-root-url: ..
date: 2022-02-24 15:35:07
categories:
  - 消息队列
tags:
  - Docker
  - RabbitMQ
  - Docker Compose
  - 部署
permalink:
hide_post_info:
---
# 安装

rabbitmq 官方文档有详细的指导，但是没有提供 docker-compose 的安装，这里就给出一个简单的安装方法，比较简单，但是不够完整。

docker-compose.yml:

```yaml
version: "3.9"
services:
    rabbitmq:
        image: rabbitmq:3.9.13-management-alpine
        container_name: 'rabbitmq'
        restart: unless-stopped
        ports:
            - 5672:5672
            - 15672:15672
        volumes:
            - /data/rabbitmq/data/:/var/lib/rabbitmq/
            - /data/rabbitmq/log/:/var/log/rabbitmq
        networks:
            - rabbitmq_go_net
networks:
    rabbitmq_go_net:
        driver: bridge
```

rabbitmq 有内置 SSL 支持，不过一般都是内网使用，倒也不必打开。

# 管理

## 用户管理

RabbitMQ 安装完成后，会有一个默认用户(guest guest)

```bash
# 查看用户
rabbitmqctl list_users
# 新增用户
rabbitmqctl add_user developer 123456
# 删除用户
rabbitmqctl delete_user developer
# 修改密码
rabbitmqctl change_password developer 654321
```

## 角色设置

RabbitMQ 中主要有 administrator，monitoring，policymaker，management，impersonator，none 几种角色。
默认的用户 guest 是 administrator 角色，新建的 developer 用户没有设置角色，即为 none。

```bash
# 可以设置多个角色
rabbitmqctl set_user_tags developer administrator monitoring
```

## 权限（vhost）

```bash
# 设置权限
rabbitmqctl set_permissions -p / developer ".*" ".*" ".*"
# 查看所有用户的权限
rabbitmqctl list_permissions
# 查看virtual host为/的所有用户权限
rabbitmqctl list_permissions -p /
# 查看指定用户的权限
rabbitmqctl  list_user_permissions developer
# 清除用户权限
rabbitmqctl  clear_permissions developer
```

# 使用

## 路由设置

rabbitmq 中有交换机（exchange）、路由（routing）、队列（queue）的概念。消息需要被发送到交换机，交换机根据路由将消息转发到队列。
所以创建完交换机和队列后，需要再进入交换机/队列的配置，为其指定路由。在其中一个地方配置后，另一端的配置中就能看到了。然后才可以正常将消息存入队列。
