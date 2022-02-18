---
title: 产品体验优化清单
layout: post
date: 2019-07-03 15:29:14
categories: 优化
tags:
- 优化
- 体验
- 测试
permalink:
hide_post_info:
---
“优化已有产品的体验”，这是用户体验相关岗位职责中常见的描述。我们的产品常常是在快速的迭代过程中不断完善的，就像孩子生下来需要养育才能长大一样，优化已有功能/产品，和设计新功能/产品同样重要，不可偏废。
但是，相比实现新功能，已有功能的优化总是显得没有那么紧迫而且很零散，导致了迭代优化的计划总是被归入“重要不紧急”甚至是“不重要不紧急”的象限，变成了东一棒子西一榔锤的买卖。我们可以通过可用性测试来发现问题，但是测试往往受到时间、用户邀约、场地和设备等条件的限制，可能无法进行。更多时候，设计师需要根据一定的原则（例如可用性准则）进行走查，以快速地发现并解决问题。
这篇小文章关心的问题是：如果想对非娱乐导向产品已有的交互设计进行优化，我们
•    需要从哪些方面考虑
•    遵从什么样的原则
•    如何开始检查现有的设计
•    如何确定优化的优先级

而不涉及：
•    新功能/产品的交互设计过程
•    娱乐导向产品的设计优化
•    产品概念、功能层次的优化
•    适合每一类型产品的tips
•    具体的优化方法

### 一、需要优化什么 (Considerations)

“设计原则的主要目的之一就是优化用户的产品体验。对于生产工具和其他非娱乐导向的产品而言，这意味着将工作负荷降至最低。”——《交互设计精髓》
行为和界面层面的设计原则告诉我们，应该为降低用户的工作负荷而设计。但是我们常常不够贴心，不知不觉就对用户设下了种种考验，让他们抓狂：

#### 1.视觉负担 visual work

•    需要分解布局
•    需要区分内容层次
•    需要区分视觉元素
•    需要努力定位目标信息
•    需要识别阅读起点
•    需要经常变换视线
•    视觉流被干扰、打断

#### 2.认知负担 cognitive work

•    需要理解不熟悉的概念和模式
•    需要理解冗长、生涩的文本内容
•    需要理解混乱的结构和布局
•    需要理解模棱两可的操作
•    需要猜测系统状态、行为、结果

#### 3.记忆负担 memory work

•    需要记住对象的各种属性（名字、位置、大小、颜色）
•    需要记住对象的关联
•    需要记住操作的命令、步骤、结果
•    需要记住以往的操作

#### 4.物理负担 physical work

•    需要长距离移动鼠标
•    需要进行（多次）点击
•    需要执行不同的鼠标手势
•    需要多种操作组合
•    需要切换输入模式
•    需要进出不同的页面/区域
•    需要长时间等待

### 二、优化目标 (Goal)

仔细检查已有的设计，或多或少总是能发现问题。在解决问题之前，我们应该清楚要往什么方向进行优化：

#### 1.基于可用性的目标

##### •    易于识别/定位/阅读

##### •    易于理解/学习/记忆

##### •    易于操作

优化的最重要的目的，是让产品更好用，使设计符合Jakob Nielsen的十条可用性准则：

* 1.状态可见原则（Visibility of system status ）：系统应该让用户时刻清楚当前发生了什么事情，也就是快速的让用户了解自己处于何种状态、对过去发生、当前目标、以及对未来去向有所了解，一般的方法是在合适的时间给用户适当的反馈，防止用户使用出现错误。
* 2.环境贴切原则（Match between system and the real world）软件系统应该使用用户熟悉的语言、文字、语句，或者其他用户熟悉的概念，而非系统语言。软件中的信息应该尽量贴近真实世界，让信息更自然，逻辑上也更容易被用户理解。
* 3.用户可控原则（User control and freedom）：用户常常会误触到某些功能，我们应该让用户可以方便的退出。这种情况下，我们应该把“紧急出口”按钮做的明显一点，而且不要在退出时弹出额外的对话框。很多用户发送一条消息、总会有他忽然意识到自己不对的地方，这个叫做临界效应
* 4.一致性原则（Consistency and standards）：对于用户来说，同样的文字、状态、按钮，都应该触发相同的事情，遵从通用的平台惯例；也就是，同一用语、功能、操作保持一致。软件产品的一致性包括以下五个方面：
  * 结构一致性：保持一种类似的结构，新的结构变化会让用户思考，规则的排列顺序能减轻用户的思考负担；
  * 色彩一致性：产品所使用的主要色调应该是统一的，而不是换一个页面颜色就不同；
  * 操作一致性：能让产品更新换代时仍然让用户保持对原产品的认知，减小用户的学习成本；
  * 反馈一致性：用户在操作按钮或者条目的时候，点击的反馈效果应该是一致的；
  * 文字一致性：产品中呈现给用户阅读的文字大小、样式、颜色、布局等都应该是一致的；
* 5.错原则（Error prevention）：比一个优秀错误提醒弹窗更好的设计方式，是在这个错误发生之前就避免它。可以帮助用户排除一些容易出错的情况，或在用户提交之前给他一个确认的选项。在此，特别要注意在用户操作具有毁灭性效果的功能时要有提示，防止用户犯不可挽回的错误。
* 6.易取原则（Recognition rather than recall）：通过把组件、按钮及选项可见化，来降低用户的记忆负荷。用户不需要记住各个对话框中的信息。软件的使用指南应该是可见的，且在合适的时候可以再次查看。
* 7.灵活高效原则（Flexibility and efficiency of use）：汽车油门—新手用户常常看不见，而且对于高手来说可以通过它快速与汽车互动。这样的系统可以同时满足有经验和无经验的用户。允许用户定制常用功能。
* 8.优美且简约原则（Aesthetic and minimalist design）：对话中的内容应该去除不相关的信息或几乎不需要的信息。任何不相关的信息都会让原本重要的信息更难被用户察觉。
* 9.容错原则（Help users recognize, diagnose, and recover from errors）：错误信息应该使用简洁的文字（不要用代码），指出错误是什么，并给出解决建议。也就是在用户出错时如何为出错的用户提供及时正确的帮助呢？即要帮助用户识别出错误，分析出错误的原因再帮助用户回到正确的道路上。如果真的不能帮助用户从错误中恢复，也要尽量为用户提供帮助让用户损失降到最低。
* 10.人性化帮助原则（Help and documentation）：即使系统不适用帮助文档是最好的，但我们也应该提供一份帮助文档。任何帮助信息都应该可以方便地搜索到，以用户的任务为核心，列出相应的步骤，但文字不要太多。

#### 2.基于业务目标

需要根据不同产品业务需求进行定义。例如，AARRR，盈利指标等，对于快速注册流程的优化，目的是让用户用最方便完成注册进入目标页面，优化目标可能是最小化输入、最短等待时间等。

### 三、快速检查清单 (Check list)

为了达到优化的目标，整理了一个简易的checklist（pdf版本下载链接请见文末），方便在走查时对架构、布局、内容、行为四个方面对照检查：

#### 1.架构和导航Architecture and navigation

* [ ]    是否采用了用户熟悉或容易理解的结构？
* [ ]    是否能识别当前在网站中的位置？
* [ ]    是否能清晰表达页面之间的结构？
* [ ]    是否能快速回到首页/主要页面？
* [ ]    链接名称与页面名称是否相对应？
* [ ]    当前页面的结构和布局是否清晰？

#### 2.布局和设计Layout and design

* [ ]    是否采用了用户熟悉的界面元素和控件？
* [ ]    界面元素和控件的文字、位置、布局、分组、大小、颜色、形状等是否合理、容易识别、一致？
* [ ]    界面元素/控件之间的关系是否表达正确？
* [ ]    主要操作/阅读区域的视线是否流畅？
* [ ]    其他文本（称谓、提示语、提供反馈）是否一致？

#### 3.内容和可读性Content and readability

* [ ]    文字内容的交流对象是用户吗？
* [ ]    语言是否简洁、易懂、礼貌？
* [ ]    内容表达的含义是否一致？
* [ ]    重要内容是否处于显著位置？
* [ ]    是否在需要时提供必要的信息？
* [ ]    是否有干扰视线和注意力的元素？

#### 4.行为和互动Behavior and interaction

* [ ]    是否告知、引导用户可以做什么？
* [ ]    是否告知需要进行哪些步骤？
* [ ]    是否告知需要多少时间完成？
* [ ]    是否告知第一步做什么？
* [ ]    是否告知输入/操作限制？
* [ ]    是否有必要的系统/用户行为反馈？
* [ ]    是否允许必要的撤销操作？
* [ ]    是否页面上所有操作都必须由用户完成？
* [ ]    是否已将操作步骤、点击次数减至最少？
* [ ]    是否所有跳转都是必须的（无法在当前页面呈现）？

以上只是一个不完全的清单，同学们可以根据自己的实践经验修改，也可以参考更全面、权威的可用性测试检查表，如[普渡大学可用性测试检查列表](http://oldwww.acm.org/perlman/question.cgi?form=PUTQ)。

| 1 | 总的来说，我对使用这个系统的容易程度感到满意   | strongly disagree   |    | strongly agree   |    |
|:----|:----|:----|:----|:----|:----|
| 2 | 使用这个系统很简单   | strongly disagree   |    | strongly agree   |    |
| 3 | 我可以有效地完成我的工作使用这个系统   | strongly disagree   |    | strongly agree   |    |
| 4 | 使用这个系统，我可以很快地完成我的工作   | strongly disagree   |    | strongly agree   |    |
| 5 | 我能够有效地完成我的工作使用这个系统    | strongly disagree   |    | strongly agree   |    |
| 6 | 我觉得使用这个系统很舒服    | strongly disagree   |    | strongly agree   |    |
| 7 | 学会使用这个系统很容易   | strongly disagree   |    | strongly agree   |    |
| 8 | 学会使用这个系统很容易   | strongly disagree   |    | strongly agree   |    |
| 9 | The system gives error messages that clearly tell me how to fix problems    | strongly disagree   |    | strongly agree   |    |
| 10 | Whenever I make a mistake using the system, I recover easily and quickly    | strongly disagree   |    | strongly agree   |    |
| 11 | The information (such as online help, on-screen messages, and other documentation) provided with this system is clear    | strongly disagree   |    | strongly agree   |    |
| 12 | It is easy to find the information I needed    | strongly disagree   |    | strongly agree   |    |
| 13 | The information provided for the system is easy to understand    | strongly disagree   |    | strongly agree   |    |
| 14 | The information is effective in helping me complete the tasks and scenarios    | strongly disagree   |    | strongly agree   |    |
| 15 | The organization of information on the system screens is clear    | strongly disagree   |    | strongly agree   |    |
| 16 | The interface of this system is pleasant    | strongly disagree   |    | strongly agree   |    |
| 17 | I like using the interface of this system    | strongly disagree   |    | strongly agree   |    |
| 18 | This system has all the functions and capabilities I expect it to have    | strongly disagree   |    | strongly agree   |    |
| 19 | 总的来说，我对这个系统很满意    | strongly disagree   |    | strongly agree   |    |

### 四、确定优先级 (Priority)

当我们通过checklist将需要优化的问题筛选出来以后，可以根据问题的严重性和解决的问题的成本（时间、人力等）来综合考虑问题的优先级，例如，问题严重性得分高而且优化成本低的问题，应该优先解决。

### 五、小结

##### Considerations：为降低用户的视觉负担、认知负担、记忆负担以及物理负担而优化设计

##### Goal：使设计易于识别/定位/阅读，易于理解/学习/记忆，易于操作，符合可用性原则和产品目标