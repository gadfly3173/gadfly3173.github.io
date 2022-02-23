---
title: 利用 Github Actions 自动部署 Hexo 博客
layout: post
date: 2021-02-23 19:39:07
categories: 建站
tags:
- 纪实
- 建站
- Hexo
permalink:
hide_post_info:
---
## 介绍

Github Actions 可以很方便实现 CI/CD 工作流，类似 Travis 的用法，来帮我们完成一些工作，比如实现自动化测试、打包、部署等操作。当我们运行`Jobs`时，它会创建一个容器 (runner)，容器支持：`Ubuntu`、`Windows`和`MacOS`等系统，在容器中我们可以安装软件，利用安装的软件帮我们处理一些数据，然后把处理好的数据推送到某个地方。

本文将介绍利用 Github Actions 实现自动部署`hexo`到 Github Pages，在之前我们需要写完文章执行`hexo d -g`来部署，当你文章比较多的时候，可能还需要等待很久，而且还可能会遇到本地安装的`Node.js`版本与`Hexo`不兼容的问题。
目前我就是因为电脑的`Node.js`版本升到`v14`版本导致与`Hexo`不兼容部署不了，才来捣腾 Github Actions 功能的。利用 Github Actions 你将会没有这些烦恼。

## 前提

### 生成部署密钥

一路按回车直到生成成功

```bash
ssh-keygen -f github-deploy-key
```

当前目录下会有`github-deploy-key`和`github-deploy-key.pub`两个文件。

### 配置部署密钥

复制`github-deploy-key`文件内容，在博客源码仓库的 `Settings` -> `Secrets` -> `Add a new secret` 页面上添加。

在`Name`输入框填写`HEXO_DEPLOY_PRI`。
在`Value`输入框填写`github-deploy-key`文件内容。

复制`github-deploy-key.pub`文件内容，在`your.github.io`仓库 `Settings` -> `Deploy keys` -> `Add deploy key` 页面上添加。

在`Title`输入框填写`HEXO_DEPLOY_PUB`。
在`Key`输入框填写`github-deploy-key.pub`文件内容。
勾选`Allow write access`选项。

## 编写 Github Actions

### Workflow 模版

在博客源码仓库下创建`.github/workflows/deploy.yml`文件，我这里是博客仓库的`source`分支，目录结构如下。

```bash
blog (repository)
└── .github
    └── workflows
        └── deploy.yml
```

在 `deploy.yml` 文件中粘贴以下内容。

```yaml
name: Hexo CI

on:
  push:
    branches:
      - source

env:
  GIT_USER: Gadfly
  GIT_EMAIL: gadfly@gadfly.vip
  DEPLOY_REPO: gadfly3173/gadfly3173.github.io
  DEPLOY_BRANCH: master
  TZ: Asia/Shanghai

jobs:
  build:
    name: Build on node ${{ matrix.node_version }} and ${{ matrix.os }}
    runs-on: ubuntu-latest
    strategy:
      matrix:
        os: [ubuntu-latest]
        node-version: [10.x]

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Checkout deploy repo
        uses: actions/checkout@v2
        with:
          repository: ${{ env.DEPLOY_REPO }}
          ref: ${{ env.DEPLOY_BRANCH }}
          path: .deploy_git

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Configuration environment
        env:
          HEXO_DEPLOY_PRI: ${{secrets.HEXO_DEPLOY_PRI}}
        run: |
          mkdir -p ~/.ssh/
          echo "$HEXO_DEPLOY_PRI" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts
          git config --global user.name $GIT_USER
          git config --global user.email $GIT_EMAIL

      - name: Install dependencies
        run: |
          yarn

      - name: Deploy hexo
        run: |
          yarn release
```
