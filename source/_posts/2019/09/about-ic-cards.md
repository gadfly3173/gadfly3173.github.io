---
title: 关于NFC和IC智能卡的一二三
layout: post
date: 2019-09-29 22:37:35
categories: NFC
tags:
- IC卡
- 单片机
- 近场通信
permalink:
hide_post_info:
typora-root-url: ..
---
<small>*本文中提到的`卡片`，若非特别注明，均为非接触式卡片，不再另外声明。*</small>

## 概述

首先分析 NFC 和我们身边的 IC 卡之前，我们需要先介绍一些基本的概念：
>近场通信技术（Near-field communication，NFC）由非接触式射频识别（RFID）演变而来，由飞利浦半导体（现恩智浦半导体）、诺基亚和索尼共同于2004年研制开发，其基础是RFID及互连技术。近场通信是一种短距高频的无线电技术，在13.56MHz频率运行于20厘米距离内。其传输速度有106 Kbit/秒、212 Kbit/秒或者424 Kbit/秒三种。当前近场通信已通过成为ISO/IEC IS 18092国际标准、EMCA-340标准与ETSI TS 102 190标准。NFC采用主动和被动两种读取模式。
>
>每一个完整的NFC设备可以用三种模式工作：
>
>- 卡模拟模式（Card emulation mode）：这个模式其实就是相当于一张采用RFID技术的IC卡。可以替代现在大量的IC卡（包括信用卡）场合商场刷卡、IPASS、门禁管制、车票、门票等等。此种方式下，有一个极大的优点，那就是卡片通过非接触读卡器的RF域来供电，即便是寄主设备（如手机）没电也可以工作。NFC设备若要进行卡片模拟（Card Emulation）相关应用，则必须内置安全组件（Security Element, SE）之NFC芯片或通过软件实现主机卡模拟(Host Card Emulation，HCE)。
>- 读卡器模式（Reader/Writer mode）：作为非接触读卡器使用，比如从海报或者展览信息电子标签上读取相关信息。
>- 点对点模式（P2P mode）：这个模式和红外线差不多，可用于数据交换，只是传输距离较短，传输创建速度较快，传输速度也快些，功耗低（蓝牙也类似）。将两个具备NFC功能的设备链接，能实现数据点对点传输，如下载音乐、交换图片或者同步设备地址薄。因此通过NFC，多个设备如数字相机、PDA、计算机和手机之间都可以交换资料或者服务。
>
><small>*摘自：[zh.wikipedia.org/wiki/近場通訊](https://zh.wikipedia.org/wiki/近場通訊)*</small>

这么大一段话概括一下的话，大致意思是：NFC 是一种使得数据可以在几厘米的范围内进行传输的技术，我们身边常见的大陆二代身份证、电子护照、公交卡等都属于这种技术的具体应用。
NFC 在我们身边的具体应用场景有很多，有时我们会将其错误地认为是其他技术的实现。比如大家常说银行卡、公交卡等“消磁了”，但事实上现在这些卡片已经不再是使用磁条等传统的磁性物质记录数据，而是支持非接触式射频识别（RFID）的电子芯片。他们出现失效的情况一般也不是因为某些磁性物质损坏了，而是其中的线圈或者芯片遭受了物理损伤，比如卡片被弯折等，或者是其他使用类似技术的读写卡器等破坏了其中存储的数据导致无法正常读取。

传统的 RFID 技术我这里就不多做解释，将其理解为某种特殊的无线电通信技术即可。NFC 只是限于 13.56MHz 的频段，而 RFID 的频段有低频（125KHz 到 135KHz），高频（13.56MHz）和超高频（860MHz 到 960MHz）之间。NFC 工作有效距离小于 10cm，所以具有很高的安全性，RFID 工作有效距离从几米到几十米都有。RFID 标准较多，统一较为复杂（估计是没可能统一的了），只能在特殊行业有特殊需求下，采用相应的技术标准。
传统 RFID 最常见的应用是图书馆的书籍，不是特别寒酸的图书馆的藏书上都会贴有特殊的标签，这种标签可以在一个比较大的范围内被读取，这样就可以实现简便的自助化的图书借阅管理，读者将书放在特定的区域就可以被读取到借阅了哪些书，而不像以前的图书馆需要管理员将扉页上的藏书条形码进行人工扫描，大大提升了效率。许多物流运输也通过类似的方法来管理运输箱，通过机器就可以远程分拣，也方便管理。NFC 就是在这样的技术上发展而来，更适合一般日常生活的使用。

## 生活中的各种可以刷的卡都是NFC么

答案显然是否定的。要看一张卡是不是支持 NFC 技术的卡有以下几种方法：

1. 用一张支持 NFC 的安卓手机刷一下
    虽然手机厂商在宣传 NFC 时有很多会说什么“全功能 NFC”之类的，但是那只是针对之前 wikipedia 上提到的“卡模拟模式”说的，在读取 NFC 卡片这件事情上，除了 iPhone 以外，大家都没有特别大的区别。这边推荐一个名为“MIFARE 经典工具”的 app，在 GitHub 和 Google Play 上都可以下载：

    + Play： [de.syss.MifareClassicTool](https://play.google.com/store/apps/details?id=de.syss.MifareClassicTool)
    + GitHub： [ikarus23/MifareClassicTool](https://github.com/ikarus23/MifareClassicTool)
    + F-Droid：[de.syss.MifareClassicTool](https://f-droid.org/packages/de.syss.MifareClassicTool/)
    + *可用的国内镜像我之后再补充*
    使用这个 app 可以读取到 NFC 卡片中的部分信息，不过这个 app 并非支持所有的 NFC 卡片，只支持 MIFARE 系列及相似技术的模拟卡（这个问题稍后再说）。首先这个 app 能识别的肯定是 NFC 卡片，如果 app 没有反应，但是手机中的其他应用，比如 QQ、微信、金融类 app 等对其有反应，那么这张卡片也是 NFC 卡片的一种。

2. 如果卡片本身不是特别厚，并且是一般的长方形卡片，则可以用手电筒等能在较小的范围内聚集大量光源的设备照亮这张卡。如果发现里面的小芯片在卡片的某一边，外面有一圈贴近卡片边缘的线圈，形如下图，那么这一般也是 NFC 技术的卡片。
![](/images/posts/2019/09/ic_coil.png)
3. 如果卡片上没有 10+8 位的数字，也没有 8-10 位的数字，并且没有标注 HID 之类的字样，那么这张卡一般也是一种 NFC 卡片。

那么如果我们平时使用的非接触式卡片不是 NFC 的卡片的话，那么又是什么卡片呢？最常见的就是 ID 卡了。
>ID卡全称为身份识别卡（Identification Card），是一种不可写入的感应卡，含固定的编号。ID卡与磁卡一样，都仅仅使用了“卡的号码”而已，卡内除了卡号外，无任何加密存储功能，其“卡号”是公开、裸露的。ISO标准ID卡的规格为：85.5x54x0.80±0.04mm（高/宽/厚），市场上也存在一些厚、薄卡或异型卡。

最常见的异型卡就是下图右边这种，统称为钥匙扣：
![](/images/posts/2019/09/id_card.png)
![](/images/posts/2019/09/id_coil.png)
而 NFC 卡片则一般统称为 IC 卡：
>智能卡（英语：Smart card或IC Card），又称智慧卡、聪明卡、集成电路卡及IC卡。是指粘贴或嵌有集成电路芯片的一种便携式卡片塑胶。卡片包含了微处理器、I/O接口及存储器，提供了数据的运算、访问控制及存储功能，卡片的大小、接点定义当前是由ISO规范统一，主要规范在ISO7810中。常见的有电话IC卡、身份IC卡，以及一些交通票证和存储卡。
>
><small>*摘自：[zh.wikipedia.org/wiki/智慧卡](https://zh.wikipedia.org/wiki/智慧卡)*</small>

不过 IC 卡不是只有非接触式的，手机使用的 sim 卡、银行卡上那个裸露的金属芯片也是 IC 卡，但是是接触式的。本文中则只讨论非接触式 IC 卡。

## 非接触式IC卡

既然技术已经存在，那么就需要一定的标准来将其统一、规范化。
非接触式 IC 卡一般有三种国际规范：ISO/IEC 14443 Type A、ISO/IEC 14443 Type B、ISO/IEC 15693。三个规范都规定了工作在 13.56Mhz 下智能标签和读写器的空气接口及数据通信规范，但是类型不同。我们生活中更常见的是 ISO/IEC 14443 Type A 和 ISO/IEC 14443 Type B 规范的设备，15693 则与公众关系不太密切，因此本文作为科普暂不讨论。

### 14443-A

14443-A 最为常见，其中最为知名的是前文提到的 MIFARE 系列，国内的复旦卡等早期均是模仿 MIFARE 系列开发的，MIFARE 的解决方案最为流行，也是大家都兼容的方案。
>MIFARE是恩智浦半导体公司（NXP Semiconductors）拥有的一系列非接触式智能卡和近傍型卡技术的注册商标。
MIFARE 包括一系列依循 ISO/IEC 14443-A 规格，利用无线射频识别（频率为 13.56MHz）的多种非接触式智能卡专有解决方案。这项技术是最早是 1994 年由米克朗集团（Mikron Group）开发，在 1998 年转售给飞利浦电子公司（2006 年更名为恩智浦半导体公司）。近年来 MIFARE 已经普遍在日常生活当中使用，如大众运输系统付费、商店小额消费、门禁安全系统、借书证等。
>
><small>*摘自：[zh.wikipedia.org/wiki/MIFARE](https://zh.wikipedia.org/wiki/MIFARE)*</small>

![](/images/posts/2019/09/jiagou.png)
上图为 MIFARE 卡片的架构，
>UID：唯一标识符（Unique Identifier）， RID：安全随机标识符（Random Security Identifier）
>
>- 卡片架构：卡片上面有一组唯一标识符、通信接口（包含天线及调制解调器）以及一个ASIC里面包含了通信逻辑电路、加密控制逻辑电路与数据存储区（ EEPROM），可以作为电子钱包或其它门禁、差勤考核、借书证等用途。
>
> - 数据存储区块：可分16个区段（sector 0-15）， 每个区段由4个区块（block 0-3）组成，而每个区块都是独立的单元，每1个区块的容量有16Byte。而每个区段的最后一个区块则用来存放2组密钥（KeyA、KeyB），以及密钥对应各自的访问权限（Access bit）。
> - 每张卡片第一区段的第一区块（sector 0，block 0）只能读取无法写入数据，称为制造商代码（Manufacturer Code）, 第1－4byte为UID。第5byte为比特计数检查码（bit count check)，其余的存放卡片制造商的数据。所以每张卡片实际能使用的只有15个区段，即便如此也可用于15个不同的应用。
>
>- 读写卡机架构：读卡器包含CPU、电源模块、读（写）模块、记忆模块、控制模块等，有些还有显示模块、定时模块等其他模块。
>- 工作流程：当卡片接近读写卡机进入通信天线的感应范围（约2.5公分至10公分）之后，读写卡机便会提供微量电力（约达2伏特之后）驱动卡片上的电路。此时卡、机各以曼彻斯特编码（MANCHESTER Encoding）及米勒编码（Miller encoding）加密通信内容后再以振幅偏移调制（Amplitude Shift Keying，ASK）透过调制解调器收发无线电波信号互相验证是否为正确卡片，如果验证结果正确读写卡机就会确认要访问的数据存储区块，并对该区块进行密码校验，在卡、 机三重认证无误之后，就可以透过加密进行实际工作通信。这个过程大约只需要0.1秒就可以完成。如果同时有多张卡片进入读写卡机感应范围，读写卡机会将卡 片编号并选定1张卡片进行验证直到完成所有卡片验证（称为防碰撞机制）或是离开感应范围为止。
>
> - 卡 机三重认证步骤：1.卡片产生一个随机数RB发送到读卡器。2.读卡器会将接收到的随机数RB依公式加密编码后的TokenAB数值并发送回卡片。3.卡片接 收到TokenAB后，会把加密部分解译出来然后比对参数B、随机数RB。同时并依据收到的随机数RA，引用公式编码后产生TokenBA发送回读卡器。4. 读卡器接收到TokenBA后，又把加密过的部分解译，比较随机数RB，RA与TokenBA中解出之RB、RA是否相符，正确的就可以完成指令（扣款、打 开门锁或是登记其他事项）。
>
><small>*摘自：[zh.wikipedia.org/wiki/MIFARE](https://zh.wikipedia.org/wiki/MIFARE)*</small>

MIFARE 系列最常用的就是各种 1K 卡，也就是存储容量为 1Kbytes 的卡。简单来说，1K 卡将整张卡片的数据区域分割为 16 个扇区，4 个区块，每个区块长度为 32 位，每一位都是 0-F 的 16 进制数，每 2 位为 1Byte，所以每一块为 16Bytes，总容量`16 * 4 * 16 = 1024Bytes = 1K`。每个扇区各自独立，正常情况下，0 扇区 0 块：第 1－4byte 为 UID，第 5byte 为比特计数检查码（bit count check)，其余的存放卡片制造商的数据，包括卡片类型等。整个 0 扇区一般无法被更改。剩下 15 个扇区中每个扇区只有三个块可用，每个扇区的最后一个块的结构为：12 位 KeyA+8 位控制字+12 位 KeyB。控制字负责控制整个扇区的读写状态，KeyA 和 B 用于开发者自行根据需要来控制使用不同 Key 的权限。一定程度上算是安全的，但是每个密钥均为固定，所以通过一定的暴力破解和逆向手段，也有可能获得卡片的全部密钥，安全性不足。（下图为数据区块示意图）（没看懂也没事，下文会详细分析的）
![](/images/posts/2019/09/blocks.png)

### 14443-B

14443-B 则用于安全性更高的产品，如二代身份证、电子护照等。事实上，针对 14443-B 的破解手段也非常罕见，因此我也难以展开细讲。

## MIFARE卡片的破解

刚介绍了一些原理什么的，我们就开始对其进行破解，是不是哪里不太对？其实这边介绍破解的技术和思路可以更容易地理解 MIFARE 卡片的原理。之前讲的都是理论概念，这里开始实际操作。

首先，针对 MIFARE 卡片的研究，我们可以使用由 Jonathan Westhues 在做硕士论文中研究 Mifare Classic 时设计、开发的一款开源硬件**Proxmark3**，可以用于 RFID 中嗅探、读取以及克隆等相关操作。（其他的还有 PN532、ACR122U 等，这里不展开细说）这个名为 Proxmark3 的设备在某宝即可获得，售价几百元不等，一般学习的话选择最便宜的即可。一般卖家会给你提供这样的一个软件以便操作。
![](/images/posts/2019/09/pm3_easy_gui.png)
具体的操作参考卖家给出的教程即可，这里主要对技术问题进行分析。

### 默认密码和PRNG

教程中一般会提到：使用默认密码扫描无法被破解的卡片可以用 PRNG 破解功能来进行下一步操作。那么默认密码是什么？
由于 MIFARE 的机制，导致卡片中每一个扇区都必须存在密码才能使用，因此需要存在约定俗称的几个普通密码，使用这些常见的密码可以方便在未激活时修改数据，必要时将其更改为更可靠的密码即可。默认密码中一般有：

- FFFFFFFFFFFF
- A0A1A2A3A4A5
- 000000000000
- (...)
其他还有很多，不同的地方定义不同，但是共同点都是非常简单，很容易猜测。如果卡片中存在这样的密码可以被扫描到，那么这张卡的安全性非常薄弱，克隆甚至修改都不成问题。
如果不存在默认密码，那么难道只能穷尽所有的可能，逐一尝试密码吗？事实上 MIFARE 卡片本身的机制也存在一定的问题，这个问题导致了 darkside 攻击的存在：PRNG 破解。
卡片密钥破解的关键是让卡片发送加密数据，再通过算法解出密钥，所以需要欺骗卡片发出加密数据。我们考虑首先要把卡片中的密钥相关的数据骗出来，也就是让卡片发送出来一段加密的数据，我们通过这段加密的数据才能把密钥破解出来，如果卡片不发送加密的数据给我们，那就没法破解了。而第一次验证的时候卡片会发送明文的随机数给读卡器，然后验证读卡器发送加密数据给卡片，卡片验证失败就停止，不会发送任何数据了，不过，经过研究人员大量的测试后发现卡片算法中存在漏洞，当读卡器发出的密文中某 8bit 数据正确时，读卡器就会回复一个 4bit 的密文，而这个密文就包含了密钥的信息，再通过解密算法即可解出密钥。Linux 下的 mfcuk（MiFare Classic Universal toolKit）就是这样一个基于 darkside 原理攻击全加密卡的程序。GitHub：[nfc-tools/mfcuk](https://github.com/nfc-tools/mfcuk)。因此，通过这个原理，就可以使用读卡器进行 darkside 攻击，也就是一般所说的 PRNG 破解。
关于 PRNG 的详细内容可以看以下资料：

>伪随机数生成器（pseudo random number generator，PRNG），又被称为确定性随机比特生成器（deterministic random bit generator，DRBG），是一个生成数字序列的算法，其特性近似于随机数序列的特性。PRNG生成的序列并不是真随机，因此它完全由一个初始值决定，这个初始值被称为PRNG的随机种子（seed，但这个种子可能包含真随机数）。尽管接近于真随机的序列可以通过硬件随机数生成器生成，但伪随机数生成器因为其生成速度和可再现的优势，在实践中也很重要。
>PRNG是模拟（例如，蒙特卡洛方法）、电子游戏（例如过程生成）以及密码学等应用的核心。加密应用程序要求不能从以前的输出中预测输出，而且更复杂的、不具有简单PRNGs线性特性的算法是必要的。
>良好的统计特性，是PRNG的核心。通常，需要严格的数学分析来证明PRNG生成的序列足够接近真随机以满足预期用途。John von Neumann（约翰·冯·诺伊曼）警告不要把PRNG错误地解释为真随机数生成器。
>
>PRNG通过设定随机种子可以从任意初始值开始生成。同样的初始值总是生成同样的序列。PRNG的周期定义为：所有初始值的最大长度的无重复前缀序列。周期受状态数的限制，通常用比特位数表示。然而，每增加一个比特位，周期长度就可能增加一倍，所以构建周期足够长的PRNG对于许多实际应用程序来说是很容易的。
>如果PRNG的内部状态包含n位，那么它的周期不会超过2n，甚至可能非常短。对于大多数PRNG，周期长度的计算并不需要遍历整个周期。线性反馈移位寄存器（LFSR）的周期通常正好是2n−1。线性同余方法的周期可以通过因式分解进行计算。 尽管PRNG在达到周期之后会出现重复的结果，但重复序列的出现并不意味着到达了一个周期，因为它的内部状态可能比输出要大很多。对于输出为1位的PRNGs，这一点尤其明显。
>
><small>*摘自：[zh.wikipedia.org/wiki/伪随机数生成器](https://zh.wikipedia.org/wiki/伪随机数生成器)*</small>

### nested authentication 攻击（大家常说的验证漏洞攻击）

首先我们需要了解卡片本身的验证逻辑：
第一次验证时，读卡器首先验证 0 扇区的密码，卡片给读卡器发送一个随机数 n1（明文），然后读卡器通过跟密码相关的加密算法加密 n1，同时自己产生一个密文随机数 n2，发送给卡片。卡片用自己的密码解密之后，如果解密出来的就是自己之前发送的 n1，则认为正确，然后通过自己的密码相关的算法加密读卡器的随机数 n2 成为密文 n3，发送给读卡器。读卡器解密之后，如果跟自己之前发送的随机数 n2 相同，则认为验证通过，之后所有的数据都通过此算法加密传输。
![](/images/posts/2019/09/nested.png)
首先记住这里面只有第一次的 n1 是明文，之后都是密文，而且 n1 是卡片发送的，也就是验证过程中，卡片是主动先发随机数的。我们破解的时候，读卡器中肯定没有密码（如果有就不用破解了），那么卡片发送一个 n1 给读卡器之后，读卡器用错误的密码加密之后发送给卡片，卡片肯定解密错误，然后验证中断，这个过程中，我们只看到卡片发送的明文随机数，卡片根本没有把自己保存的密码相关的信息发送出来，那怎么破解呢？
所以，要已知一个扇区的密码，第一次验证的时候，使用这个扇区验证成功之后，后面所有的数据交互都是密文，读其他扇区数据的时候，也需要验证，也是卡片首先发送随机数 n1，但是这里的 n1 是加密的数据。既然每个扇区的密码是独立的，那么现在的加密实际上就是通过卡片被读取的，相对于第一个读取的扇区的“其他扇区”的密码相关的算法加密的 n1，这个数据中就包含了这个扇区的密码信息，所以我们才能够通过算法漏洞继续分析出扇区的密码是什么。
这也是为什么 nested authentication 攻击必须要知道某一个扇区的密码，然后才能破解其他扇区的密码。

### 嗅探

以上两个破解方式组合就可以解决大部分的 M1 卡片了，但是可能出现例外，所以我们还有一种方法是嗅探攻击。由于卡片和读卡器之间的通信是在几厘米之内的无线通信，所以使用 Proxmark3 也可以对其进行监控分析。
![](/images/posts/2019/09/snoop.png)
如上图，刷一次卡后，拿开等待几秒，电脑会返回嗅探到的数据。注意寻找 60 或者 61 开头的数据，60 含义是使用 A 密码访问，61 是使用 B 密码。开头是 RDR 的是读卡机发出的指令，TAG 则是卡片发出的指令。红圈中表示读卡机访问了第 21 个块。21 是十六进制，转换成十进制是 33 块第一个方框“b2a6de1d”是卡片 UID，第二个方框“f80eee3c”是 tag challenge(卡片挑战数)，第三个方框“4ec88403”是 reader challenge(读卡器挑战数)，第四个方框“d2dd5180”是 reader respones(读卡器响应数)，第五个方框“2bb17b5e”是 tag respones(卡片回应数)，依次填入“crapto1gui.exe”这个软件中。
![](/images/posts/2019/09/crapto1.png)
点击 crak key 即可计算出密匙，结论是：读卡机使用 KeyA 访问了第 33 块，使用的密码是 FFFFFFFFFFFF。
由于 M1 卡在读卡机和卡片交互数据和密码时，使用了 crypto1 算法。即便同一张卡，同样的密码，嗅探得到交互数据也是随机的，但是他存在破解算法 crapto1。只要获得前面提到的四组随机数组，以及 UID，就可以反解出密匙。通过 crapto1 之类的计算工具就可以计算出需要的数据。

## 白卡

通过以上的破解分析，我们了解了 M1 卡的运行原理和安全漏洞。根据这些安全漏洞，万能的华强北制作出了许多仿制 M1 的白卡，又被国外称之为 Chinese Magic Card。同时也存在后门指令，被称为 chinese magic backdoor command。

### UID卡

- 所有区块可被重复读写
- 卡片 UID 可改且使用后门指令更改 UID
- UID 可被重复修改
- 响应后门指令(意味着可被使用后门指令检测是否为克隆卡的机器发现)

### CUID卡

- 所有区块可被重复读写
- 卡片 UID 可改且使用普通写指令更改 UID
- 不响应后门指令(意味着不容易被反克隆系统发现)

### FUID卡

- 0 扇区可写且仅可写入一次
- 写入后 0 扇区不可更改
- 不响应后门指令

这些卡某宝售价大约 0.2-1 元一张，非常便宜，异形卡则稍微贵一点。UID 卡只要通过读卡器验证是否存在后门指令即可识别，因此反克隆技术非常成熟（然而我们学校并没有 ORZ）。

## CPU卡

那么手机中的 NFC 模块有公交卡、银行卡闪付，甚至还有模拟门禁卡的功能，这是使用的以上几种白卡的技术完成的吗？事实上并不是。手机中的 NFC 模块目前多为全功能的 NFC 模组，可以实现 NFC 技术的大部分读写功能，也可以自行模拟为 CPU 卡。CPU 卡是 MIFARE 之后发展出的全新卡种，卡内的集成电路中带有微处理器 CPU、存储单元（包括随机存储器 RAM、程序存储器 ROM（FLASH）、用户数据存储器 EEPROM）以及芯片操作系统 COS。装有 COS 的 CPU 卡相当于一台微型计算机，不仅具有数据存储功能，同时具有命令处理和数据安全保护等功能。一般内部运行一个 Java 虚拟机，可以写入简单的程序，接受与 MIFARE 不同的指令，安全性取决于本身程序的安全程度，更难以被破解。目前最常用的就是 JCOP 系列。
>Java Card OpenPlatform (JCOP) is a smart card operating system for the Java Card platform developed by IBM Zürich Research Laboratory. On 31 January 2006 the development and support responsibilities transferred to the IBM Smart Card Technology team in Böblingen, Germany. Since July 2007 support and development activities for the JCOP operating system on NXP / Philips silicon are serviced by NXP Semiconductors.
>
>The title originates from the standards it complies with:
>
>- Java Card specifications
>- GlobalPlatform (formerly known as Visa Inc OpenPlatform) specifications
>A Java Card JCOP has a Java Card Virtual Machine (JCVM) which allows it to run applications written in Java programming language.
>
><small>*摘自：[zh.wikipedia.org/wiki/Java_Card_OpenPlatform](https://en.wikipedia.org/wiki/Java_Card_OpenPlatform)*</small>

手机 NFC 则一般基于这样的技术开发，CPU 卡本身与 MIFARE 不兼容，为了保证推广，许多厂商在制作时会利用 JCOP 本身的特性去模拟 M1 卡，国内手机中的模拟门禁卡就是这样的技术产生的。由于这种技术属于灰色地带，海外手机出厂一般不自带，国内前两年可以模拟的范围还比较广，现在则大大限制，只能模拟一般密钥为 FFFFFFFFFFFF 的普通卡。

手机 NFC 中的闪付、公交卡等也不是直接模拟实体卡，而是由发卡方下发密钥，为手机本身发放新卡，因此卡号等也与实体卡不同，公交卡也需要另交押金。由于这样的网络下发的卡属于异形卡，传统上公交卡公司并不愿意提供注销服务（谁愿意把收到手里的押金退掉呢？滑稽( ﹁ ﹁ ) ~→）。不过强如 Apple 倒是有资本和公交卡公司谈，于是 iPhone 用户就可以享受到可退卡的服务了。你问为啥华为小米这样的公司谈不下来？这可就是未解之谜了呢┑(￣Д ￣)┍，技术上是不存在障碍的，那么障碍在哪里呢？

## 收尾

好了，本篇关于 NFC 技术的科普就告一段落了。不得不说国内这方面的资料少的可怜，许多知识都是我从论坛或者大佬那里学来的，在这里也非常感谢 UCLA 的 BH4EXD 大佬在我研究这些技术时为我提供的帮助，希望这篇文章能帮助到对于射频技术感兴趣，却没有就读相关专业的你，少走一些弯路。

最后，引用一句罗老师的名言吧（绝对不是广告）：
> 生命不息，折腾不止。————罗永浩
>![](/images/posts/2019/09/zheteng.jpg)

<br>
<br>
<br>

***
参考资料：

- [RFID破解三两事 - FreeBuf互联网安全新媒体平台](https://www.freebuf.com/articles/wireless/8792.html)
- [详谈Mifare Classic 1K卡 - 知乎](https://zhuanlan.zhihu.com/p/67532665)
- [维基百科](https://zh.wikipedia.org)