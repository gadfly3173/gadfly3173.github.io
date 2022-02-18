---
title: 关于校园一卡通的初探索
layout: post
date: 2019-05-07 23:10:57
categories: RFID
tags:
- RFID
- PROXMARK3
- 校园卡
- NFC
- 一卡通
- 数据分析
- 单片机
permalink:
hide_post_info:
---
>校园一卡通涵盖了我们校园生活中的方方面面，吃饭喝水购物门禁都靠它，对于其工作方式我非常感兴趣，因此做了这次的探索。
>In the world of locked rooms, the man with the key is king.
>-- Moriarty

<!--More-->

### 0×00 写在前面

#### 本文中提到的所有技术仅供学习研究作参考，**请勿将其用于非法用途**

### 0x01 设备

* proxmark3
* 空白UID卡（或其他可以随意写入的13.56MHz高频ISO14443a卡）
* 一台可以使用NFC功能的安卓手机（非必需）
* 一颗爱折腾的心
![](/images/posts/2019/05/PM3.jpg)

### 0x02 一些基础概念

#### proxmark3

Proxmark3是由Jonathan Westhues在做硕士论文中研究Mifare Classic时设计、开发的一款开源硬件，可以用于RFID中嗅探、读取以及克隆等相关操作，如：PM3可以在水卡、公交卡、门禁卡等一系列RFID\NFC卡片和与其相对应的机器读取、数据交换的时候进行嗅探攻击，并利用嗅探到的数据通过XOR校验工具把扇区的密钥计算出来，当然PM3也能用于破解门禁实施物理入侵。

#### M1卡

所谓的M1芯片，是指菲利浦下属子公司恩智浦出品的芯片缩写，全称为NXP Mifare1系列，常用的有S50及S70两种型号，复旦FM1108、AT24C64、AT24C04等芯片与其兼容，利用PVC封装M1芯片、感应天线，然后压制成型后而制作的卡即是智能卡行业所说的M1卡，属于非接触式IC卡。M1卡的优点是可读写、有16个独立的可加密扇区，可应用于16个不同的系统，能够轻易实现一卡多用，多个系统一卡通用。

#### RFID与NFC

NFC是在RFID的基础上发展而来，NFC从本质上与RFID没有太大区别，都是基于地理位置相近的两个物体之间的信号传输。但NFC与RFID还是有区别的，NFC技术增加了点对点通信功能，可以快速建立蓝牙设备之间的P2P（点对点）无线通信，NFC设备彼此寻找对方并建立通信连接。P2P通信的双方设备是对等的，而RFID通信的双方设备是主从关系。NFC相较于RFID技术，具有距离近、带宽高、能耗低等一些特点。NFC只是限于13.56MHz的频段，而RFID的频段有低频（125KHz到135KHz），高频（13.56MHz）和超高频（860MHz到960MHz）之间。NFC工作有效距离小于10cm，所以具有很高的安全性，RFID工作有效距离从几米到几十米都有。因为同样工作于13.56MHz，NFC与现有非接触智能卡技术兼容，所以很多的厂商和相关团体都支持NFC，而RFID标准较多，统一较为复杂（估计是没可能统一的了），只能在特殊行业有特殊需求下，采用相应的技术标准。RFID更多的被应用在生产、物流、跟踪、资产管理上，而NFC则在门禁、公交、手机支付等领域内发挥着巨大的作用。

#### CPU卡

也称智能卡，卡内的集成电路中带有微处理器CPU、存储单元（包括随机存储器RAM、程序存储器ROM（FLASH）、用户数据存储器EEPROM）以及芯片操作系统COS（Chip Operating System）。装有COS的CPU卡相当于一台微型计算机，不仅具有数据存储功能，同时具有命令处理和数据安全保护等功能。

### 0x03 还是直接上手吧

上面复制粘贴了一堆我差点没看懂的基本概念，似乎也没太大用处，只是希望大家能大概明白这些非接触IC卡的工作原理和大致种类23333。下面我来讲讲我是怎么做这次的探索的。
探索这种对我来说全新的领域自然是要吃点亏的，比如最早的时候我买了台没什么用的ACR122u，结果发现这东西对于CPU卡（也就是我们平常生活中使用的大部分非接触式IC卡）并没有什么作用。因为虽然这些卡都兼容MIFARE，但是采用了许多新技术来保障其中的安全，ACR122u针对的只有那些简单的M1卡。所以那台机器被我卖给了某不知名学长去玩23333。
查阅了一些资料后，我对这些东西有了初步的概念，在某UCLA的学长的建议下，我买了台proxmark3来继续探索。proxmark3本质上是一款单片机，可以实现非常多的功能。这玩意在某宝上有很多祖国版。祖国版与原版的区别主要是阉割了一部分电路，但是优化了天线的使用与安装方式，售价200-600不等，个人建议选择200左右的就够了，毕竟我们只需要简单研究，而不是拿去搞黑产（雾。用proxmark3之后我收集到了许多有意思的信息。执行`hf 14a reader`之后，就可以读取到卡片的UID（相当于卡号）、ATQA、SAK、TYPE（卡类型）、ATS等。UID一般用于确认卡的身份，正常情况下是一卡一号，很多门禁系统（比如我们学校）就依靠这个来进行门禁的识别，不过也有些严格的门禁不仅要求UID，还会对整张卡的其他信息有要求（比如上海大学）。然后我用手边的几张卡试了试，发现银行卡、上海公交卡、我的校园卡的卡类型都是`JCOP31 or JCOP41 v2.3.1`，也就是说都是CPU卡，很可能我的校园卡和交通卡一样采用了滚动码加密，难以破解。
>之前基础概念里有提到，M1卡或者兼容它的卡中有16个扇区（0-15），每个扇区中有四个块，也就是有64个块（0-63）。每个扇区都可以分别被不同的密钥所加密，每个扇区有两个密钥，分为keyA和keyB，这两个密钥分别长12个字节，密钥内容可以由任意可重复的12个十六进制数字（0-F）组成，keyA在每个扇区第四个块的前12位，keyB在后12位，中间8位则是控制字。key的验证是在卡内部进行的，读写器只负责给卡提供电并和卡通讯，读写器发送加密的密码到卡，卡内部进行解密验证并发返回值，读写器根据卡的返回值来判断验证是否通过。每个区中的控制字决定验证密码通过后能进行的操作。如果控制字中已将某区锁死，即使密码验证通过也读写不了卡中的数据。默认的控制字数据是无论那个密码验证通过，都可读写区中的数据，keyA是永远不可读的，keyB在默认控制字的情况下可以读，条件是密码必须验证通过。
![](/images/posts/2019/05/blocks_sheet.jpg)
>而这里提到的滚动码加密则是key并不固定，在每次读写后，通过卡内的计数器和与读卡器中保存的相同的特定的加密算法来计算出新的key，从而保证key无法被简单破解，即使侥幸破解后，key也只有一次使用的机会，大大增加了卡本身的安全性，这项技术在公交卡之类的离线储值卡上应用广泛。

### 0x04 一点挫折

这时某UCLA的学长还介绍给了我一个很有趣的APP，叫`Mifare Classic Tool`，Google play地址在这里：<https://play.google.com/store/apps/details?id=de.syss.MifareClassicTool>，Github项目地址在这里：<https://github.com/ikarus23/MifareClassicTool>。这个可以在有NFC功能的手机上读写兼容MIFARE的卡，我用它读了一下校园卡，发现1-6扇区被加密无法读取，7-15扇区则都是默认密钥`FFFFFFFFFFFF`，0扇区的keyA为`010203040506`，keyB没有显示，应该是卡片不允许读取。
![](/images/posts/2019/05/MCT_results.jpg)
用手机能做到的也只有这些了，于是我继续使用proxmark3研究。pm3的GUI软件中有一些自带的破解选项，比如PRNG破解`hf mf mifare`，可以利用MIFARE卡中存在的漏洞来获取某些特定的密码。但是令我意外的是，我没能获取到任何数据。我以为它是不存在这样的漏洞，于是试图使用嗅探功能来获取，却也失败了。这时那位神秘的UCLA学长提醒我是不是固件问题。于是我注意到，某宝上便宜的PM3使用的都是所谓2.0版本的固件，而500+的都是4.0。考虑到这是一款开源硬件，于是我去它的github仓库里找到了固件源码自行编译，并编译了新版本的命令行工具，果然获得了不同的结果。这时再使用PRNG破解，就成功得到了0扇区keyA为`010203040506`（等等，怎么有一种什么都没做的感觉？？？）。
事实上，除了PRNG之外，还有一个操作叫`知一求全``hf mf nested [1-4 也就是1k卡还是其他的什么卡] [第几扇区，从0开始] [A还是B] [key] d`，同样是利用MIFARE卡的漏洞来根据某个密钥计算出其他的密钥。执行之后，我成功得到了我的校园卡的全部密钥。又找了其他同学的卡测试之后发现，这张校园卡并没有什么特殊的加密方式，虽然使用的是比较先进的CPU卡，但却只把它当成普通的M1卡来记录数据。所有卡的0扇区keyA都是`010203040506`，1-6扇区的keyA应该是根据UID计算的一个key，0-6扇区的keyB则是另一个。
分析里面的数据之后发现，0扇区的1块记录了学号，2扇区的8-9块记录了完整的学生姓名和身份证号，5扇区负责洗澡的水费，13扇区则是负责宿舍区净水器喝水的水费。下图是某同学的校园卡读取后的部分数据，为了保障当事人隐私，部分数据已打码。
![](/images/posts/2019/05/dump_data.jpg)

### 0x05 后记

折腾真是件愉快的事情啊，不过总算还是搞出了点东西。最后的最后，本文仅作学习交流之参考，**请绝对不要用这里提到的技术去做违法之事！！！**