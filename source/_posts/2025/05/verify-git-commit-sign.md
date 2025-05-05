---
title: 校验 git 提交签名
layout: post
typora-root-url: ..
hide_post_info: false
date: 2025-05-02 21:24:08
categories: git
tags:
  - git
  - 签名
  - commit
  - verify
  - signature
  - gpg
  - ssh
permalink:
---

Git 支持使用 GPG 密钥或 SSH 密钥对提交进行签名验证。本文将详细介绍如何配置和使用这两种签名方式。

## 前置要求

- Git 2.34.0+
- OpenSSH 8.8+ (注意: OpenSSH 8.7 版本签名功能异常)
- 如果使用 GPG 签名,需要安装 gpg 工具
- 如果使用 SSH 签名,需要 ED25519 或 RSA 类型的 SSH 密钥

## 签名验证

### 查看提交签名

```bash
# 查看最近的提交签名
git log --show-signature

# 查看指定提交的签名
git verify-commit <commit-hash>
```

### 本地验证 SSH 签名

1. 创建 allowed_signers 文件:

```bash
touch ~/.ssh/allowed_signers

# 添加签名者信息
echo "your_email@example.com namespaces=\"git\" $(cat ~/.ssh/id_ed25519.pub)" >> ~/.ssh/allowed_signers

# 配置 Git 使用此文件
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
```

## 获取并导入他人的密钥

### GitHub

#### SSH 密钥
1. 访问用户个人主页: `https://github.com/{username}.keys`
2. 将获取的公钥添加到 allowed_signers 文件:
```bash
curl https://github.com/{username}.keys | while read key; do
    echo "{their-email} namespaces=\"git\" $key" >> ~/.ssh/allowed_signers
done
```

#### GPG 密钥
1. 访问用户个人主页: `https://github.com/{username}.gpg`
2. 导入公钥:
```bash
curl https://github.com/{username}.gpg | gpg --import
```

### GitLab

#### SSH 密钥
1. 访问用户个人主页: `https://{gitlab-instance}/-/users/{username}/keys`
2. 同 GitHub 方式添加到 allowed_signers

#### GPG 密钥
1. 在用户个人主页找到 GPG Keys 部分
2. 点击 Download 下载公钥
3. 导入公钥:
```bash
gpg --import username_public.gpg
```

### 平台身份验证

GitHub 和 GitLab 的签名验证状态会显示为"已验证"的绿色标记，表明这是平台本身验证过的提交。这些提交通常来自:
- Web 界面的编辑
- PR/MR 的自动合并
- GitHub Actions/GitLab CI 的自动提交

要验证这些签名:
1. 导入平台的公钥:
```bash
# GitHub
curl https://github.com/web-flow.gpg | gpg --import

# GitLab (替换为你的实例地址)
curl https://{gitlab-instance}/-/openid_connect/key | gpg --import
```

## 常见问题

### GPG 签名相关

1. 提示 "secret key not available":
```bash
git config --global gpg.program gpg2
```

2. GPG 密码输入框不弹出:
```bash
export GPG_TTY=$(tty)
```

### SSH 签名相关

1. 确保 SSH 密钥类型正确(ED25519 或 RSA)
2. 验证 OpenSSH 版本是否满足要求(8.8+)
3. 检查 allowed_signers 文件格式是否正确

## 最佳实践

1. 使用强密码保护你的密钥
2. 定期更新密钥
3. 妥善保管私钥文件
4. 配置自动签名避免遗漏
5. 在多设备间同步签名配置

签名验证可以:
- 验证代码提交者身份
- 防止他人冒用身份
- 提高代码可信度

记得将公钥上传到 Git 平台(如 GitHub、GitLab)以便在 Web 界面验证签名。
