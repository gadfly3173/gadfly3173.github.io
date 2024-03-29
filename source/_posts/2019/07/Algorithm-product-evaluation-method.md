---
title: 算法评估方法
layout: post
date: 2019-07-03 15:34:07
categories: 优化
tags:
- 优化
- 测试
- 笔记
permalink:
hide_post_info: false
---
精确率(precision)、准确率(accuracy)和召回率（recall）

| 实际值 \ 预测值   | 正样本   | 负样本   |
|:----|:----|:----|
| 正   | TP   | FN   |
| 负   | FP   | TN   |

* TP，将正的样本预测为正，True Positive，预测对了
* FN，将正样本预测为负值，False Negtive，预测错了
* TN，将负样本与预测为负值，True  Negtive 预测对了
* FP，将负样本预测为正，False Positive， 预测错了

## 一、召回率（recall）

```text
R  = 预测为正的对的样本/ 实际为正样本
   = TP /(TP+FN)
```

针对我们原来的正样本而言的，它表示的是正例样本中有多少被预测正确了。大白话就是“正例样本里你的预测对了多少”

例如，使用算法扩写文章 100 篇，10 篇没有扩写成功，90 篇成功进行了扩写，人工对于扩写质量给于正反评分，为正的文章 23 篇，那么扩写算法召回率：23/100 = 0.23；

在针对搜索：召回率为查全率：

```text
查全率＝检索出的相关信息量 / 系统中的相关信息总量
```

例如，使用关键词“马云”搜索出一张马云和 100 张马和云的图片，数据库系统中实际上有 10 篇马云，那么查全率：1/10 = 0.10；

## 二、精确率（Precision）

```text
P = 预测对的正样本 / 预测为正预测结果
  = TP/ (TP+FP)
```

预测为正的样本中有多少是真正的正样本。那么预测为正就有两种可能了，一种就是把正类预测为正类(TP)，另一种就是把负类预测为正类(FP)，也就是“ 你预测为正例的里面有多少是对的”

例如，纠错算法，测试 100 个词的文本，识别出错误词有 20 个（TP+FP=20），其中被误判为错词 14 个（FP=14），6 个错词判断正确（TP=6），4 个错词没有识别出来（FN=4），人工对于成功纠出错结果正反打分，6/20 = 0.3 。

在针对搜索：精确率为查准率

```text
查准率 = 检索出的相关信息量 / 检索出的信息总量
```

例如，使用关键词“马云”搜索出一张马云和 99 张马和云的图片，那么查准率：1/100 = 0.01；

## 三、准确率（Accuracy）

```text
A = 预测对的/所有样本
  = (TP+TN)/(TP+TN+FP+FN)
```

针对我们原来所有样本而言的，它表示的是所有样本有多少被准确预测了。

## 四、F1

```text
2/F1 = 1/P + 1/R
```

## F1 值为精确率和召回率的调和平均数，值越大越好

五、误报率和漏报率
误报率（虚报率）和漏报率，误报率=1-查准率，漏报率=1-查全率。
