---
categories: 区块链
title: 区块链 P2P 认识
tags:
  - 区块链
  - p2p
  - dns seed
date: 2018-07-16 15:05:43
---

我们都知道，区块链的不同节点要互相交换数据，无论是交易的发布，以及挖矿成功的发布

我最开始学习这个时候就很疑惑，他是怎么知道我的呢？

本次文章，我打算搞清楚四件事儿
1. 我如何知道别人的
2. 节点间的互相通讯
3. 他是怎么知道我的
4. 我们如何交换数据

<!-- more -->

## 我如何知道别人的

我们可以发现在，[bitcoin的wiki](https://en.bitcoin.it/wiki/Satoshi_Client_Node_Discovery)上有以下方法

1. Nodes discover their own external address by various methods.
    节点通过各种方法发现自己​​的外部地址。
2. Nodes receive the callback address of remote nodes that connect to them.
    节点接收连接到它们的远程节点的回调地址。
3. Nodes makes DNS request to receive IP addresses.
    节点使DNS请求接收IP地址。
4. Nodes can use addresses hard coded into the software.
    节点可以使用硬编码到软件中的地址。
5. Nodes exchange addresses with other nodes.
    节点与其他节点交换地址。
6. Nodes store addresses in a database and read that database on startup.
    节点在数据库中存储地址并在启动时读取该数据库。
7. Nodes can be provided addresses as command line arguments
    节点可以作为命令行参数提供地址
8. Nodes read addresses from a user provided text file on startup
    节点在启动时从用户提供的文本文件中读取地址

我们分开来介绍一下。

###  Nodes discover their own external address by various methods.

大致的意思，就是让我们自己想办法，找到自己的外部ip地址。

客户端里有内置的方法，通过很多公共的服务，比如 checkip.dyndns.org，当然客户端有内置的一系列链接，来获取ip，如果失败，就一直请求下去。直到可以获取完成。

这个方法，目前已经被废除了

在[#3088](https://github.com/bitcoin/bitcoin/pull/3088) 提交中，建议不要使用该方法，具体原因可以自行查看。

目前的代码，我查找到一些位于[net.cpp#L1499](https://github.com/bitcoin/bitcoin/blob/172f984f598f471f970d2ed4bf6379e9aa33901e/src/net.cpp#L1499)代码 ，好像是为了获取本机的外网的代码

````cpp
char externalIPAddress[40];
r = UPNP_GetExternalIPAddress(urls.controlURL, data.first.servicetype, externalIPAddress);
if(r != UPNPCOMMAND_SUCCESS)
    LogPrintf("UPnP: GetExternalIPAddress() returned %d\n", r);
else
{
    if(externalIPAddress[0])
    {
        CNetAddr resolved;
        if(LookupHost(externalIPAddress, resolved, false)) {
            LogPrintf("UPnP: ExternalIPAddress = %s\n", resolved.ToString().c_str());
            AddLocal(resolved, LOCAL_UPNP);
        }
    }
    else
        LogPrintf("UPnP: GetExternalIPAddress failed.\n");
}
````

使用了 `miniupnpc` 库，针对于 upnp的操作

UPNP_GetExternalIPAddress：根据指定设备获得外网ip地址

后面，我才知道这个东西.......庞大.... 后面会做介绍

### Nodes receive the callback address of remote nodes that connect to them.

在版本 0.6.x开始，比特币客户端，默认不在使用IRC引导，并且从0.8.2版本开始，对IRC引导的支持完全删除。

这里，我们还是解释一下的他的工作原理。

在[代码](https://github.com/bitcoin/bitcoin/blob/847593228de8634bf6ef5933a474c7e63be59146/src/irc.cpp#L231)中,我们可以发现， 在我们的客户端初始化后，我们会默认的使用 
````cpp
CService addrConnect("92.243.23.21", 6667); // irc.lfnet.org

CService addrIRC("irc.lfnet.org", 6667, true);
if (addrIRC.IsValid())
    addrConnect = addrIRC;

SOCKET hSocket;
if (!ConnectSocket(addrConnect, hSocket))
{
    printf("IRC connect failed\n");
    nErrorWait = nErrorWait * 11 / 10;
    if (Wait(nErrorWait += 60))
        continue;
    else
        return;
}
````

irc.lfnet.rog 的服务，随机的进入频道 `#bitcoin00-#bitcoin99`。

随后，发布 who 命令，之后线程会解析出现的打印，并且解析IP地址。这是一个循环，直到节点关闭

当我们发现了地址之后，会把当前的时间戳设置给这个地址，但是他会使用51分钟的惩罚,也就是把这个时间增加51分钟... 


该代码位于 [irc.cpp 348 行处](https://github.com/bitcoin/bitcoin/blob/847593228de8634bf6ef5933a474c7e63be59146/src/irc.cpp#L348)

````cpp
if (boost::algorithm::starts_with(strName, "u"))
{
    CAddress addr;
    if (DecodeAddress(strName, addr))
    {
        addr.nTime = GetAdjustedTime();
        if (addrman.Add(addr, addrConnect, 51 * 60))
            printf("IRC got new address: %s\n", addr.ToString().c_str());
        nGotIRCAddresses++;
    }
    else
    {
        printf("IRC decode failed\n");
    }
}
````

为什么。。。我也不知道。。。。这看起来很奇怪，就像你发现这个地址是在51分钟之后....

### Nodes makes DNS request to receive IP addresses.

在启动的时候，如果需要发现对等网络节点，客户端会发起DNS请求，来了解其他对等节点的地址。

客户端会请求DNS服务的主机名列表。 截止到 2018-7-12. l列表来自 [chainparams.cpp](https://github.com/bitcoin/bitcoin/blob/master/src/chainparams.cpp#L132)，包括：

* seed.bitcoin.sipa.be
* dnsseed.bluematt.me
* dnsseed.bitcoin.dashjr.org
* seed.bitcoinstats.com
* seed.bitcoin.jonasschnelli.ch
* seed.btc.petertodd.org
* seed.bitcoin.sprovoost.nl

我们可以使用 `dig` 命令来测试一下

````js
 %  dig dnsseed.bitcoin.dashjr.org

; <<>> DiG 9.10.6 <<>> dnsseed.bitcoin.dashjr.org
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 64930
;; flags: qr rd ra; QUERY: 1, ANSWER: 24, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;dnsseed.bitcoin.dashjr.org.	IN	A

;; ANSWER SECTION:
dnsseed.bitcoin.dashjr.org. 3262 IN	A	94.102.220.92
dnsseed.bitcoin.dashjr.org. 3262 IN	A	82.43.171.91
dnsseed.bitcoin.dashjr.org. 3262 IN	A	18.216.38.201
dnsseed.bitcoin.dashjr.org. 3262 IN	A	35.185.239.122
dnsseed.bitcoin.dashjr.org. 3262 IN	A	213.239.201.46
dnsseed.bitcoin.dashjr.org. 3262 IN	A	178.62.242.100
dnsseed.bitcoin.dashjr.org. 3262 IN	A	109.197.127.221
dnsseed.bitcoin.dashjr.org. 3262 IN	A	95.158.39.64
dnsseed.bitcoin.dashjr.org. 3262 IN	A	67.193.68.147
dnsseed.bitcoin.dashjr.org. 3262 IN	A	18.194.75.63
dnsseed.bitcoin.dashjr.org. 3262 IN	A	24.233.245.188
dnsseed.bitcoin.dashjr.org. 3262 IN	A	52.60.106.162
dnsseed.bitcoin.dashjr.org. 3262 IN	A	14.2.124.84
dnsseed.bitcoin.dashjr.org. 3262 IN	A	101.65.253.15
dnsseed.bitcoin.dashjr.org. 3262 IN	A	75.109.56.138
dnsseed.bitcoin.dashjr.org. 3262 IN	A	18.219.96.50
dnsseed.bitcoin.dashjr.org. 3262 IN	A	82.213.234.197
dnsseed.bitcoin.dashjr.org. 3262 IN	A	111.206.188.73
dnsseed.bitcoin.dashjr.org. 3262 IN	A	117.62.107.81
dnsseed.bitcoin.dashjr.org. 3262 IN	A	18.191.24.206
dnsseed.bitcoin.dashjr.org. 3262 IN	A	76.89.163.33
dnsseed.bitcoin.dashjr.org. 3262 IN	A	18.184.20.43
dnsseed.bitcoin.dashjr.org. 3262 IN	A	18.197.78.199
dnsseed.bitcoin.dashjr.org. 3262 IN	A	221.225.194.182

;; Query time: 26 msec
;; SERVER: 114.114.114.114#53(114.114.114.114)
;; WHEN: Thu Jul 12 16:14:45 CST 2018
;; MSG SIZE  rcvd: 439
````

### Nodes can use addresses hard coded into the software.

在[chainparamsseeds.h](https://github.com/bitcoin/bitcoin/blob/master/src/chainparamsseeds.h)本身存在一批种子节点，这些节点是硬编码在代码中的。

在这里就会获取到一批种子结果，当然，在有可能的情况下，代码会尽量的从种子节点转移到其他节点，避免种子节点过载。

一旦本地有了足够的地址（可以从种子节点获知），链接线程将关闭种子节点链接。

目前的地址为：

````cpp
#ifndef BITCOIN_CHAINPARAMSSEEDS_H
#define BITCOIN_CHAINPARAMSSEEDS_H
/**
 * List of fixed seed nodes for the bitcoin network
 * AUTOGENERATED by contrib/seeds/generate-seeds.py
 *
 * Each line contains a 16-byte IPv6 address and a port.
 * IPv4 as well as onion addresses are wrapped inside an IPv6 address accordingly.
 */
static SeedSpec6 pnSeed6_main[] = {
    {{0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0x13,0x05,0x7f}, 8333},
    {{0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0x1d,0x8b,0x78}, 8333},
    {{0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0x27,0x40,0x07}, 8333},
    {{0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0x27,0xae,0x74}, 8333},
    {{0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0x2d,0x45,0x0d}, 8333},
    {{0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xff,0x05,0x2d,0x4b,0x0f}, 8333},
    ...... more
````

但是，，表示看不懂... 怎么这么多位....

### Nodes exchange addresses with other nodes.

和其他的节点交换地址～

<b style="color: red">bang bang bang！！！ 敲黑板了！  重点了！  重点了！！！</b>

这节，我们会单独到下一个章节，重起一章，进行讲解

###  Nodes store addresses in a database and read that database on startup.
在调用 AddAddress() 时，地址会存储在数据库中。

当 AppInit2() 调用位于 [db.cpp](https://github.com/bitcoin/bitcoin/blob/a139ed74f2a5764afbd678c0e4eb6143455a3a49/src/db.cpp)的 LoanAddress() 时，会在启动时读取地址。

目前该方法，已经在版本删除，代码提交在 [pull #545](https://github.com/bitcoin/bitcoin/pull/545),具体的原因就是 没有人用这玩意。留着没意思....

### Nodes can be provided addresses as command line arguments
    
可以使用命令行，指定要连接的节点
````shell
-addnode <ip>
````
可以指定多个节点。

命令行上提供的地址最初为0时间戳，因此不会相应 `getaddr` 请求而通告他们。
用户还可以使用 `-connect <ip>` 指定要连接的地址。可以指定多个节点。

`-connect`  与 `-addnode` 参数的不同之处在于它并没有将地址添加到数据中，仅仅是使用这些地址

### Nodes read addresses from a user provided text file on startup

客户端会自动读取比特币目录下的名为 `addr.txt`  的文件，并把在其中找到的任何地址添加为节点地址。这些节点没有特别优先于其他地址。

他们被添加时，将被赋予零时间戳，因此他们不会相应 `getaddr` 请求而被通告


### 疑惑！！！

在这里你肯定很疑惑！  零时间戳！  是什么鬼吧？  或者，你也许压根没注意到这个东西... 好吧，接下来我们看看节点间是如何互相通讯的吧

## 节点间的通讯

在这里，我们介绍的事以bitcoin core客户端为例的。

节点必须连接到若干不同的对等节点才能在比特币网络中建立通向比特币网络的种类各异的路径（path）。

由于节点可以随时加入和离开，通讯路径是不可靠的。

因此，节点必须持续进行两项工作：在失去已有连接时发现新节点，并在其他节点启动时为其提供帮助。节点启动时只需要一个连接，因为第一个节点可以将它引荐给它的对等节点，而这些节点又会进一步提供引荐。一个节点，如果连接到大量的其他对等节点，这既没必要，也是对网络资源的浪费。在启动完成后，节点会记住它最近成功连接的对等节点；因此，当重新启动后它可以迅速与先前的对等节点网络重新建立连接。如果先前的网络的对等节点对连接请求无应答，该节点可以使用种子节点进行重启动。

如果已建立的连接没有数据通信，所在的节点会定期发送信息以维持连接。如果节点持续某个连接长达90分钟没有任何通信，它会被认为已经从网络中断开，网络将开始查找一个新的对等节点。因此，比特币网络会随时根据变化的节点及网络问题进行动态调整，不需经过中心化的控制即可进行规模增、减的有机调整。

### 消息的结构

在节点与对等节点交流中，会发送一段数据，这些数据的结构都是以下结构。


|Field Size |Description    |Data type  |Comments|
|-----------|---------------|-----------|--------|
|4  |magic  |uint32_t   |Magic value indicating message origin network, and used to seek to next message when stream state is unknown|
|12 |command    |char[12]   |ASCII string identifying the packet content, NULL padded (non-NULL padding results in packet rejected)|
|4  |length |uint32_t   |Length of payload in number of bytes|
|4  |checksum   |uint32_t   |First 4 bytes of sha256(sha256(payload))|
| ? |payload    |uchar[]    |The actual data|

#### 神奇数


其中 magic 字段，是一个在bitcoin 硬性编码的值。其目的是作为两个消息间的间隔，其值会根据其所在的网络环境进行选择。其位于 [chainparams.cpp](https://github.com/bitcoin/bitcoin/blob/master/src/chainparams.cpp)

````cpp
/**
 * The message start string is designed to be unlikely to occur in normal data.
 * The characters are rarely used upper ASCII, not valid as UTF-8, and produce
 * a large 32-bit integer with any alignment.
 */
pchMessageStart[0] = 0xf9;
pchMessageStart[1] = 0xbe;
pchMessageStart[2] = 0xb4;
pchMessageStart[3] = 0xd9;
nDefaultPort = 8333;
nPruneAfterHeight = 100000;
````

以上只是 主网的神奇数，其他的神奇数如下。


|Network|   Magic value |Sent over wire as|
|-------|---------------|-----------------|
|main   |0xD9B4BEF9 |F9 BE B4 D9|
|testnet|   0xDAB5BFFA| FA BF B5 DA|
|testnet3|  0x0709110B| 0B 11 09 07|
|namecoin|  0xFEB4BEF9| F9 BE B4 FE|



其中在消息中会出现其他的数据结构，在这里也总结一下：

#### Varint

Varint 是一个变长的参数。**Variable length integer**

|Value  |Storage length |Format|
|-------|---------------|------|
|< 0xFD |1  |uint8\_t|
|<= 0xFFFF| 3   |0xFD followed by the length as uint16\_t|
|<= 0xFFFF FFFF |5  |0xFE followed by the length as uint32\_t|
|-  |9  |0xFF followed by the length as uint64_t|


解析的步骤如下:

* 读取第 1 个字节, 假设它的值为 `v1`
* 如果 `v1 < 0xF`, 那么 v1 就是 In-counter 的值
* 如果 `v1 == 0xFD`, 那么再读取 2 个字节, 这 2 个字节以 little-endian 形式存储了 In-counter 值
* 如果 `v1 == 0xFE`, 那么再读取 4 个字节, 这 4 个字节以 little-endian 形式存储了 In-counter 值
* 如果 `v1 == 0xFF`, 那么再读取 8 个字节, 这 8 个字节以 little-endian 形式存储了 In-counter 值

#### Variable length string

可变长度字符串可以使用可变长度整数存储，后跟字符串本身。结构如下：

|Field Size|  Description | Data type |   Comments|
|------|------|------|------|
| ? |  length |  var_int | Length of the string |
| ? | string | char[] | The string itself (can be empty) |

#### Network address

当某处需要网络地址时，使用此结构。网络地址不以版本消息中的时间戳为前缀。

| Field Size |  Description | Data type |  Comments|
|------|------|------|------|
|4  | time  |  uint32 | the Time (version >= 31402). **Not present in version message**.|
|8  | services |   uint64_t  |  same service(s) listed in version|
|16 | IPv6/4 | char[16]   | IPv6 address. Network byte order. The original client only supported IPv4 and only read the last 4 bytes to get the IPv4 address. However, the IPv4 address is written into the message as a 16 byte IPv4-mapped IPv6 address <br/> (12 bytes 00 00 00 00 00 00 00 00 00 00 FF FF, followed by the 4 bytes of the IPv4 address).|
|2  | port  |  uint16_t  |  port number, network byte order|

hexdump:

````
0000   01 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  ................
0010   00 00 FF FF 0A 00 00 01  20 8D                    ........ .

Network address:
 01 00 00 00 00 00 00 00                         - 1 (NODE_NETWORK: see services listed under version command)
 00 00 00 00 00 00 00 00 00 00 FF FF 0A 00 00 01 - IPv6: ::ffff:a00:1 or IPv4: 10.0.0.1
 20 8D                                           - Port 8333
````

#### Inventory Vectors

清单向量用于通知其他节点有关他们拥有的对象或正在请求的数据。

结构如下：

|Field Size | Description Data type  | Comments |
|------|------|------|
|4  | type  |  uint32_t  |  Identifies the object type linked to this inventory |
|32 | hash   | char[32]  |  Hash of the object |

目前的type类型有可能是以下


|Value |  Name |   Description |
|------|------|------|
|0 |  ERROR |  Any data of with this number may be ignored |
|1  | MSG_TX  |Hash is related to a transaction |
|2  | MSG_BLOCK |  Hash is related to a data block |
|3  | MSG_FILTERED_BLOCK  | Hash of a block header; identical to MSG_BLOCK. Only to be used in getdata message. Indicates the reply should be a merkleblock message rather than a block message; this only works if a bloom filter has been set. |
|4  | MSG_CMPCT_BLOCK | Hash of a block header; identical to MSG_BLOCK. Only to be used in getdata message. Indicates the reply should be a cmpctblock message. See[ BIP 152](https://github.com/bitcoin/bips/blob/master/bip-0152.mediawiki) for more info. |

#### command

我们可以看到 第二个参数为 command ，目前bitcoin的 command 列表如下。

* **version** - Information about program version and block count. Exchanged when first connecting.
* **verack** - Sent in response to a version message to acknowledge that we are willing to connect.
* **addr** - List of one or more IP addresses and ports.
* **inv** - "I have these blocks/transactions: ..." Normally sent only when a new block or transaction is being relayed. This is only a list, not the actual data.
* **getdata** - Request a single block or transaction by hash.
* **getblocks** - Request an inv of all blocks in a range.
* **getheaders** - Request a headers message containing all block headers in a range.
* **tx** - Send a transaction. This is sent only in response to a getdata request.
* **block** - Send a block. This is sent only in response to a getdata request.
* **headers** - Send up to 2,000 block headers. Non-generators can download the headers of blocks instead of entire blocks.
* **getaddr** - Request an addr message containing a bunch of known-active peers (for bootstrapping).
* **submitorder, checkorder, and reply** - Used when performing an IP transaction.
* **alert** - Send a network alert.
* **ping** - Does nothing. Used to check that the connection is still online. A TCP error will occur if the connection has died.

以上就是目前所有的消息类型。我们来看看这些命令的，数据结构

### version

我们获取到了对等网络的地址之后，就需要进行握手协议了。也就是向目标地址发送一个 version的消息，其中 [version](https://en.bitcoin.it/wiki/Protocol_documentation#version) 的消息数据结构包含。


|Field Size|    Description |Data type  |Comments|
|----------|----------------|-----------|--------|
|4  |version    |int32_t    |Identifies protocol version being used by the node|
|8  |services   |uint64_t   |bitfield of features to be enabled for this connection|
|8  |timestamp  |int64_t    |standard UNIX timestamp in seconds|
|26 |addr_recv  |net_addr   |The network address of the node receiving this message|
|Fields below require version ≥ 106|
|26 |addr_from  |net_addr   |The network address of the node emitting this message|
|8  |nonce  |uint64_t   |Node random nonce, randomly generated every time a version packet is sent. This nonce is used to detect connections to self.|
| ? |user_agent |var_str|   User Agent (0x00 if string is 0 bytes long)|
|4  |start_height   |int32_t    |The last block received by the emitting node|
|Fields below require version ≥ 70001|
|1  |relay  |bool   |Whether the remote peer should announce relayed transactions or not, see BIP 0037|


对等节点收到version消息后，会回应verack进行确认并建立连接。有时候对等端可能需要互换连接并连回起始节点，此时对等端也会发送该节点的version消息。

参考下图:

![](/publicFiles/images/p2p network/20180512170431878.png "握手协议示意图")

其中具体的数据我们参考


Version 0.3.19 hexdump:
````
0000   F9 BE B4 D9 76 65 72 73  69 6F 6E 00 00 00 00 00   ....version.....
0010   55 00 00 00 9C 7C 00 00  01 00 00 00 00 00 00 00   U....|..........
0020   E6 15 10 4D 00 00 00 00  01 00 00 00 00 00 00 00   ...M............
0030   00 00 00 00 00 00 00 00  00 00 FF FF 0A 00 00 01   ................
0040   20 8D 01 00 00 00 00 00  00 00 00 00 00 00 00 00   ................
0050   00 00 00 00 FF FF 0A 00  00 02 20 8D DD 9D 20 2C   .......... ... ,
0060   3A B4 57 13 00 55 81 01  00                        :.W..U...

Message header:
 F9 BE B4 D9                                                                   - Main network magic bytes
 76 65 72 73 69 6F 6E 00 00 00 00 00                                           - "version" command
 55 00 00 00                                                                   - Payload is 85 bytes long
                                                                               - No checksum in version message until 20 February 2012. See https://bitcointalk.org/index.php?topic=55852.0
Version message:
 9C 7C 00 00                                                                   - 31900 (version 0.3.19)
 01 00 00 00 00 00 00 00                                                       - 1 (NODE_NETWORK services)
 E6 15 10 4D 00 00 00 00                                                       - Mon Dec 20 21:50:14 EST 2010
 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 FF FF 0A 00 00 01 20 8D - Recipient address info - see Network Address
 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 FF FF 0A 00 00 02 20 8D - Sender address info - see Network Address
 DD 9D 20 2C 3A B4 57 13                                                       - Node random unique ID
 00                                                                            - "" sub-version string (string is 0 bytes long)
 55 81 01 00                                                                   - Last block sending node has is block #98645
````

Version 60002 hexdump:

````
0000   f9 be b4 d9 76 65 72 73 69 6f 6e 00 00 00 00 00  ....version.....
0010   64 00 00 00 35 8d 49 32 62 ea 00 00 01 00 00 00  d...5.I2b.......
0020   00 00 00 00 11 b2 d0 50 00 00 00 00 01 00 00 00  .......P........
0030   00 00 00 00 00 00 00 00 00 00 00 00 00 00 ff ff  ................
0040   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
0050   00 00 00 00 00 00 00 00 ff ff 00 00 00 00 00 00  ................
0060   3b 2e b3 5d 8c e6 17 65 0f 2f 53 61 74 6f 73 68  ;..]...e./Satosh
0070   69 3a 30 2e 37 2e 32 2f c0 3e 03 00              i:0.7.2/.>..

Message Header:
 F9 BE B4 D9                                                                   - Main network magic bytes
 76 65 72 73 69 6F 6E 00 00 00 00 00                                           - "version" command
 64 00 00 00                                                                   - Payload is 100 bytes long
 3B 64 8D 5A                                                                   - payload checksum

Version message:
 62 EA 00 00                                                                   - 60002 (protocol version 60002)
 01 00 00 00 00 00 00 00                                                       - 1 (NODE_NETWORK services)
 11 B2 D0 50 00 00 00 00                                                       - Tue Dec 18 10:12:33 PST 2012
 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 FF FF 00 00 00 00 00 00 - Recipient address info - see Network Address
 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 FF FF 00 00 00 00 00 00 - Sender address info - see Network Address
 3B 2E B3 5D 8C E6 17 65                                                       - Node ID
 0F 2F 53 61 74 6F 73 68 69 3A 30 2E 37 2E 32 2F                               - "/Satoshi:0.7.2/" sub-version string (string is 15 bytes long)
 C0 3E 03 00                                                                   - Last block sending node has is block #212672
````

### verack

|value|name|description|
|-------|-------|-------|
|1 |  NODE_NETWORK  |  This node can be asked for full blocks instead of just headers.|
|2  | NODE_GETUTXO |   See [BIP 0064](https://github.com/bitcoin/bips/blob/master/bip-0064.mediawiki)|
|4  | NODE_BLOOM | See [BIP 0111](https://github.com/bitcoin/bips/blob/master/bip-0111.mediawiki)|
|8  | NODE_WITNESS  |  See [BIP 0144](https://github.com/bitcoin/bips/blob/master/bip-0144.mediawiki)|
|1024 |   NODE_NETWORK_LIMITED   | See [BIP 0159](https://github.com/bitcoin/bips/blob/master/bip-0159.mediawiki)|

verack消息以回复版本发送。 此消息仅包含带有命令字符串“verack”的消息头。

verack hexdump:

````
0000   F9 BE B4 D9 76 65 72 61  63 6B 00 00 00 00 00 00   ....verack......
0010   00 00 00 00 5D F6 E0 E2                            ........

Message header:
 F9 BE B4 D9                          - Main network magic bytes
 76 65 72 61  63 6B 00 00 00 00 00 00 - "verack" command
 00 00 00 00                          - Payload is 0 bytes long
 5D F6 E0 E2                          - Checksum
````

### addr

提供有关网络的已知节点的信息。通常3小时后应该忘记未广播的节点

数据结构：

| Field Size |  Description Data type  | Comments |
|------|------|------|
| 1+ | count |  var_int Number of address entries (max: 1000) |
| 30x? |   addr_list |  (uint32_t + net_addr)[] Address of other nodes on the network. version < 209 will only read the first one. The uint32_t is a timestamp (see note below).|

在本本 31402之后，地址需要增加时间戳的前缀，如果这个地址没有时间戳，那么就不该把这个地址分享给其他的对等网络。

是为了最大程度确认该地址最近活动的时间，最大程度的确保分享出去的地址对等网络可以使用

hexdump 数据如下

`````
0000   F9 BE B4 D9 61 64 64 72  00 00 00 00 00 00 00 00   ....addr........
0010   1F 00 00 00 ED 52 39 9B  01 E2 15 10 4D 01 00 00   .....R9.....M...
0020   00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 FF   ................
0030   FF 0A 00 00 01 20 8D                               ..... .

Message Header:
 F9 BE B4 D9                                     - Main network magic bytes
 61 64 64 72  00 00 00 00 00 00 00 00            - "addr"
 1F 00 00 00                                     - payload is 31 bytes long
 ED 52 39 9B                                     - checksum of payload

Payload:
 01                                              - 1 address in this message

Address:
 E2 15 10 4D                                     - Mon Dec 20 21:50:10 EST 2010 (only when version is >= 31402)
 01 00 00 00 00 00 00 00                         - 1 (NODE_NETWORK service - see version message)
 00 00 00 00 00 00 00 00 00 00 FF FF 0A 00 00 01 - IPv4: 10.0.0.1, IPv6: ::ffff:10.0.0.1 (IPv4-mapped IPv6 address)
 20 8D                                           - port 8333
`````

### inv

允许节点广播其对一个或多个对象的数据。它可以是未经请求的，也可以是对getblocks的回复。

有效载荷（最多50,000个条目，刚刚超过1.8兆字节）：

数据结构如下

| Field Size |  Description | Data type  |  Comments |
|-------|-------|-------|-------|
|?  | count |   var_int | Number of inventory entries |
|36x?  |   inventory |   inv_vect[] |  Inventory vectors |

### getdata

getdata用于响应inv，以检索特定对象的内容，并且通常在过滤已知元素之后在接收到inv包之后发送。它可用于检索事务，但仅当它们位于内存池或中继集中时 - 不允许对链中的事务进行任意访问，以避免客户端开始依赖具有完整事务索引的节点（现代节点不具有）。

有效载荷（最多50,000个条目，刚刚超过1.8兆字节）：

> 内存池，是未经确认处理的缓冲区

| Field Size |  Description | Data type  |  Comments |
|-------|-------|-------|-------|
|?  | count |   var_int | Number of inventory entries |
|36x?  |   inventory |   inv_vect[] |  Inventory vectors |

### notfound

notfound是对getdata的响应，如果无法中继任何请求的数据项，则发送该数据，例如，因为请求的事务不在内存池或中继集中。


| Field Size |  Description | Data type  |  Comments |
|-------|-------|-------|-------|
|?  | count |   var_int | Number of inventory entries |
|36x?  |   inventory |   inv_vect[] |  Inventory vectors |

### getblocks

返回一个inv数据包，其中包含在块定位器对象中最后一个已知散列之后开始的块列表，最多为hash_stop或500个块，以先到者为准。

定位器哈希由节点按消息中出现的顺序处理。如果在节点的主链中找到块散列，则通过inv消息返回其子节点列表，并且无论是否达到所请求的限制，都将忽略其余定位符。

要接收下一个块哈希，需要使用新的块定位器对象再次发出getblock。请记住，如果块定位器对象在无效分支上包含散列，则某些客户端可能会提供无效的块。

| ield Size  | Description |Data type |  Comments|
|------|------|------|------|
| 4  | version| uint32_t  |  the protocol version| 
| 1+ | hash count | var_int | number of block locator hash entries|
| 32+| block locator hashes |   char[32] |   block locator object; newest back to genesis block (dense to start, but then sparse)|
| 32 | hash_stop   |char[32] |   hash of the last desired block; set to zero to get as many blocks as possible (500)|

要创建块定位器哈希值，请继续推哈希值，直到返回到创世块。在向后推10个哈希后，向后的步骤会使每个循环加倍：

````cpp
// From libbitcoin which is under AGPL
std::vector<size_t> block_locator_indexes(size_t top_height)
{
    std::vector<size_t> indexes;

    // Modify the step in the iteration.
    int64_t step = 1;

    // Start at the top of the chain and work backwards.
    for (auto index = (int64_t)top_height; index > 0; index -= step)
    {
        // Push top 10 indexes first, then back off exponentially.
        if (indexes.size() >= 10)
            step *= 2;

        indexes.push_back((size_t)index);
    }

    //  Push the genesis block index.
    indexes.push_back(0);
    return indexes;
}
````

请注意，允许将较少的已知哈希值发送到最少只有一个哈希值。但是，块定位器对象的目的是检测调用者主链中的错误分支。如果对等方检测到您不在主链上，它将发送早于最后一个已知块的块哈希。因此，如果你只是发送你最后一次已知的哈希并且它不在主链上，那么对等体将从块＃1开始

### getheaders

返回一个头文件包，其中包含从块定位器对象中最后一个已知哈希之后开始的块头，最多为hash_stop或2000个块，以先到者为准。要接收下一个块头，需要使用新的块定位器对象再次发出getheaders。该getheaders命令使用瘦客户机快速下载块链，其中交易的内容是不相关的（因为他们不是我们的）。请记住，如果块定位器对象在无效分支上包含散列，则某些客户端可能会提供无效的块标头。

有效载荷：

|Field Size | Description | Data type  | Comments |
|-------|-------|-------|-------|
|4  | version| uint32_t  |  the protocol version|
|1+ | hash count | var_int | number of block locator hash entries|
|32+| block locator hashes |   char[32]|    block locator object; newest back to genesis block (dense to start, but then sparse)|
|32 | hash_stop |  char[32]  |  hash of the last desired block header; set to zero to get as many blocks as possible (2000)|

### tx

tx描述了比特币交易，以回复getdata

| Field Size |  Description |Data type |  Comments|
|------|------|------|------|
|4  | version| int32_t |Transaction data format version (note, this is signed)|
|0 or 2 | flag |   optional uint8_t[2]| If present, always 0001, and indicates the presence of witness data|
|1+ | tx_in count| var_int | Number of Transaction inputs (never zero)|
|41+ |tx_in|   tx_in[] | A list of 1 or more transaction inputs or sources for coins|
|1+ | tx_out count   | var_int | Number of Transaction outputs|
|9+ | tx_out | tx_out[] |   A list of 1 or more transaction outputs or destinations for coins|
|0+ | tx_witnesses  |  tx_witness[] |   A list of witnesses, one for each input; omitted if flag is omitted above|
|4 |  lock_time  | uint32_t | The block number or timestamp at which this transaction is unlocked: <br/>  <table class="wikitable"><tbody><tr><th> Value </th><th> Description</th></tr><tr><td> 0 </td><td> Not locked</td></tr><tr><td> &lt; 500000000 </td><td> Block number at which this transaction is unlocked</td></tr><tr><td> &gt;= 500000000 </td><td> UNIX timestamp at which this transaction is unlocked</td></tr></tbody></table> <br/> If all TxIn inputs have final (0xffffffff) sequence numbers then lock_time is irrelevant. Otherwise, the transaction may not be added to a block until after lock_time (see NLockTime).|

Txin 数据结构


| Field Size | Description | Data type |  Comments |
|------|------|------|------|
| 36 | previous_output | outpoint  |  The previous output transaction reference, as an OutPoint structure |
| 1+ | script length |  var_int | The length of the signature script |
| ? | signature |script  |  uchar[]| Computational Script for confirming transaction authorization |
| 4 |   sequence   | uint32_t   | Transaction version as defined by the sender. Intended for "replacement" of transactions when information is updated before inclusion into a block. |

Txout 数据结构


| Field Size | Description| Data type|   Comments|
|------|------|------|------|
| 32 | hash  |  char[32]  |  The hash of the referenced transaction.|
|4 |  index  | uint32_t   | The index of the specific output in the transaction. The first output is 0, etc.|


脚本结构由一系列与交易价值相关的信息和操作组成。（将来要扩展的结构...有关更多信息，请参阅[script.h](https://github.com/bitcoin/bitcoin/blob/master/src/script/script.h)和[script.cpp](https://github.com/bitcoin/bitcoin/blob/master/src/script/script.cpp)以及脚本）
TxOut结构包含以下字段：

| Field Size |  Description | Data type  | Comments|
|------|------|------|------|
|8  | value  | int64_t | Transaction Value|
|1+ | pk_script| length |   var_int Length of the pk_script|
| ? | pk_script  | uchar[] |Usually contains the public key as a Bitcoin script setting up conditions to claim this output.|

TxWitness结构由见证数据组件的var_int计数组成，后跟（对于每个见证数据组件）组件的var_int长度和原始组件数据本身。


````
000000  F9 BE B4 D9 74 78 00 00  00 00 00 00 00 00 00 00   ....tx..........
000010  02 01 00 00 E2 93 CD BE  01 00 00 00 01 6D BD DB   .............m..
000020  08 5B 1D 8A F7 51 84 F0  BC 01 FA D5 8D 12 66 E9   .[...Q........f.
000030  B6 3B 50 88 19 90 E4 B4  0D 6A EE 36 29 00 00 00   .;P......j.6)...
000040  00 8B 48 30 45 02 21 00  F3 58 1E 19 72 AE 8A C7   ..H0E.!..X..r...
000050  C7 36 7A 7A 25 3B C1 13  52 23 AD B9 A4 68 BB 3A   .6zz%;..R#...h.:
000060  59 23 3F 45 BC 57 83 80  02 20 59 AF 01 CA 17 D0   Y#?E.W... Y.....
000070  0E 41 83 7A 1D 58 E9 7A  A3 1B AE 58 4E DE C2 8D   .A.z.X.z...XN...
000080  35 BD 96 92 36 90 91 3B  AE 9A 01 41 04 9C 02 BF   5...6..;...A....
000090  C9 7E F2 36 CE 6D 8F E5  D9 40 13 C7 21 E9 15 98   .~.6.m...@..!...
0000A0  2A CD 2B 12 B6 5D 9B 7D  59 E2 0A 84 20 05 F8 FC   *.+..].}Y... ...
0000B0  4E 02 53 2E 87 3D 37 B9  6F 09 D6 D4 51 1A DA 8F   N.S..=7.o...Q...
0000C0  14 04 2F 46 61 4A 4C 70  C0 F1 4B EF F5 FF FF FF   ../FaJLp..K.....
0000D0  FF 02 40 4B 4C 00 00 00  00 00 19 76 A9 14 1A A0   ..@KL......v....
0000E0  CD 1C BE A6 E7 45 8A 7A  BA D5 12 A9 D9 EA 1A FB   .....E.z........
0000F0  22 5E 88 AC 80 FA E9 C7  00 00 00 00 19 76 A9 14   "^...........v..
000100  0E AB 5B EA 43 6A 04 84  CF AB 12 48 5E FD A0 B7   ..[.Cj.....H^...
000110  8B 4E CC 52 88 AC 00 00  00 00                     .N.R......


Message header:
 F9 BE B4 D9                                       - main network magic bytes
 74 78 00 00 00 00 00 00 00 00 00 00               - "tx" command
 02 01 00 00                                       - payload is 258 bytes long
 E2 93 CD BE                                       - checksum of payload

Transaction:
 01 00 00 00                                       - version

Inputs:
 01                                                - number of transaction inputs

Input 1:
 6D BD DB 08 5B 1D 8A F7  51 84 F0 BC 01 FA D5 8D  - previous output (outpoint)
 12 66 E9 B6 3B 50 88 19  90 E4 B4 0D 6A EE 36 29
 00 00 00 00

 8B                                                - script is 139 bytes long

 48 30 45 02 21 00 F3 58  1E 19 72 AE 8A C7 C7 36  - signature script (scriptSig)
 7A 7A 25 3B C1 13 52 23  AD B9 A4 68 BB 3A 59 23
 3F 45 BC 57 83 80 02 20  59 AF 01 CA 17 D0 0E 41
 83 7A 1D 58 E9 7A A3 1B  AE 58 4E DE C2 8D 35 BD
 96 92 36 90 91 3B AE 9A  01 41 04 9C 02 BF C9 7E
 F2 36 CE 6D 8F E5 D9 40  13 C7 21 E9 15 98 2A CD
 2B 12 B6 5D 9B 7D 59 E2  0A 84 20 05 F8 FC 4E 02
 53 2E 87 3D 37 B9 6F 09  D6 D4 51 1A DA 8F 14 04
 2F 46 61 4A 4C 70 C0 F1  4B EF F5

 FF FF FF FF                                       - sequence

Outputs:
 02                                                - 2 Output Transactions

Output 1:
 40 4B 4C 00 00 00 00 00                           - 0.05 BTC (5000000)
 19                                                - pk_script is 25 bytes long

 76 A9 14 1A A0 CD 1C BE  A6 E7 45 8A 7A BA D5 12  - pk_script
 A9 D9 EA 1A FB 22 5E 88  AC

Output 2:
 80 FA E9 C7 00 00 00 00                           - 33.54 BTC (3354000000)
 19                                                - pk_script is 25 bytes long

 76 A9 14 0E AB 5B EA 43  6A 04 84 CF AB 12 48 5E  - pk_script
 FD A0 B7 8B 4E CC 52 88  AC

Locktime:
 00 00 00 00                                       - lock time
````

### block

响应于getdata消息发送块消息，该消息从块散列请求事务信息。

|Field Size|  Description| Data type |  Comments|
|-----|-----|-----|-----|
|4  | version |int32_t |Block version information (note, this is signed)|
|32 | prev_block|  char[32]  |  The hash value of the previous block this particular block references|
|32 | merkle_root |char[32]  |  The reference to a Merkle tree collection which is a hash of all transactions related to this block|
|4  | timestamp|   uint32_t |   A Unix timestamp recording when this block was created (Currently limited to dates before the year 2106!)|
|4  | bits  |  uint32_t  |  The calculated difficulty target being used for this block|
|4  | nonce  | uint32_t  |  The nonce used to generate this block… to allow variations of the header and compute different hashes|
| ? | txn_count |  var_int| Number of transaction entries|
| ?|  txns |   tx[]  |  Block transactions, in format of "tx" command|

标识每个块（并且必须具有0位运行）的SHA256哈希值是根据此结构的前6个字段计算的（版本，prev_block，merkle_root，时间戳，位，nonce和标准SHA256填充，使得两个64-
所有的字节块）而不是完整的块。
要计算哈希值，SHA256算法只需要处理两个块。
由于nonce字段在第二个块中，因此第一个块在挖掘期间保持不变，因此只需要处理第二个块。
但是，比特币散列是散列的散列，因此每次挖掘迭代都需要两个SHA256循环。
有关详细信息和示例，请参阅[块散列算法](https://en.bitcoin.it/wiki/Block_hashing_algorithm)。

### headers

头包返回块头以响应getheaders包

| Field Size|  Description | Data type |  Comments |
|------|------|------|------|
| ?  |count  | var_int | Number of block headers|
|81x?|    headers | block_header[] | Block headers|

请注意，此数据包中的块头包含事务计数（var_int，因此每个头可能超过81个字节），而不是由矿工进行哈希处理的块头。

### getaddr

getaddr消息向节点发送请求，询问有关已知活动对等体的信息，以帮助查找网络中的潜在节点。
对接收该消息的响应是与来自已知活动对等体的数据库的一个或多个对等体一起发送一个或多个addr消息。
典型的假设是，如果节点在过去三小时内发送消息，则该节点可能处于活动状态。
此消息不会传输其他数据。

### mempool

mempool消息向节点发送请求，询问有关已验证但尚未确认的事务的信息。
接收此消息的响应是一条inv消息，其中包含节点的mempool中所有事务的事务哈希。
此消息不会传输其他数据。
它在[BIP 35](https://github.com/bitcoin/bips/blob/master/bip-0035.mediawiki)中指定。从[BIP 37](https://github.com/bitcoin/bips/blob/master/bip-0037.mediawiki)开始，如果加载了[布隆过滤器](https://en.bitcoin.it/wiki/Protocol_documentation#filterload.2C_filteradd.2C_filterclear.2C_merkleblock)，则只回复与过滤器匹配的事务。

### checkorder , submitorder and  reply

此消息用于[IP事务](https://en.bitcoin.it/wiki/IP_Transactions)。
由于[IP事务](https://en.bitcoin.it/wiki/IP_transaction)已被弃用，因此不再使用它

> Sending bitcoins to an IP address was a convenient way of sending bitcoins to a Bitcoin address along with additional information.
>
> * Your client contacts the IP address to find out if they're actually running Bitcoin and accepting IP transactions. If not, no transaction occurs.
> * Your additional information ("from", "message", etc.) is exchanged with the server.
> * The server generates a brand new Bitcoin public key and sends it to your client.
> * Your client sends coins to this public key.
> Unfortunately, the implementation provided no authentication, so any "man in the middle" could have intercepted your bitcoins during the transaction. When they see that you're sending a Bitcoin payment by IP address, they pretend to be the actual destination and send back their Bitcoin address. You end up sending bitcoins to the wrong person. It's therefore no longer a good idea to send bitcoins in this way, especially if you're using a proxy.

删除原因 参考 [ Remove send to IP address and IP transactions support](http://bitcointalk.org/index.php?topic=9334.0)

### ping

发送ping消息主要是为了确认TCP / IP连接仍然有效。
传输中的错误被假定为闭合连接，并且该地址作为当前对等体被移除。

|Field Size | Description| Data type   |Comments|
|------|------|------|------|
|8  | nonce |  uint64_t  |  random nonce|

### pong

发送pong消息以响应ping消息。
在现代协议版本中，使用ping中包含的随机数生成pong响应。


|Field Size | Description| Data type   |Comments|
|------|------|------|------|
|8  | nonce |  uint64_t  |  nonce from ping |

### reject

拒绝消息时 发送的消息

|Field Size | Description |Data type  | Comments|
|------|------|------|------|
|1+ | message| var_str |type of message rejected|
|1  | ccode |  char   | code relating to rejected message|
|1+ | reason | var_str| text version of reason for rejection|
|0+ | data |   char  |  Optional extra data provided by some errors. Currently, all errors which provide this field fill it with the TXID or block header hash of the object being rejected, so the field is 32 bytes.|

ccode 

|Value   |Name  |  Description|
|------|------|------|
|0x01    |REJECT_MALFORMED    ||
|0x10    |REJECT_INVALID  ||
|0x11    |REJECT_OBSOLETE ||
|0x12    |REJECT_DUPLICATE    ||
|0x40    |REJECT_NONSTANDARD  ||
|0x41    |REJECT_DUST ||
|0x42    |REJECT_INSUFFICIENTFEE  ||
|0x43    |REJECT_CHECKPOINT   |||

### filterload, filteradd, filterclear, merkleblock

这些消息与连接的Bloom过滤有关，并在[BIP 0037](https://github.com/bitcoin/bips/blob/master/bip-0037.mediawiki)中定义。
filterload命令定义如下：

|Field Size | Description | Data type |  Comments |
|-------|-------|-------|-------|
| ? | filter | uint8_t[]  | The filter itself is simply a bit field of arbitrary byte-aligned size. The maximum size is 36,000 bytes.|
|4  | nHashFuncs|  uint32_t  |  The number of hash functions to use in this filter. The maximum value allowed in this field is 50.|
|4  | nTweak  |uint32_t  |  A random value to add to the seed value in the hash function used by the bloom filter.|
|1  | nFlags | uint8_t |A set of flags that control how matched items are added to the filter.|

有关Bloom过滤器算法的说明以及如何为所需的误报率选择nHashFuncs和过滤器大小，请参见下文。
在接收到`filterload`命令后，远程对等体将立即将其宣告的广播事务（在inv数据包中）限制为与过滤器匹配的事务，其中匹配算法在下面指定。
标志控制匹配算法的更新行为。
`filteradd`命令定义如下：

|Field Size | Description| Data type  | Comments|
|-------|-------|-------|-------|
|?|  data  |  uint8_t[] |  The data element to add to the current filter.|

数据字段的大小必须小于或等于520字节（任何可能匹配的对象的最大大小）。
给定的数据元素将添加到Bloom过滤器中。
必须先使用`filterload`提供过滤器。
如果将新密钥或脚本添加到客户端钱包，同时它与网络连接打开时，此命令很有用，它可以避免重新计算并向每个对等方发送全新过滤器的需要（尽管这样做通常建议使用
保持匿名）。

`filterclear`命令根本没有参数。
在设置过滤器之后，节点不仅停止宣布不匹配的事务，它们还可以提供过滤的块。
过滤后的块由merkleblock消息定义，定义如下：

|Field Size|  Description| Data type |  Comments|
|----|----|----|----|
|4   |version |int32_t |Block version information, based upon the software version creating this block (note, this is signed)|
|32  |prev_block | char[32]  |  The hash value of the previous block this particular block references|
|32  |merkle_root| char[32]  |  The reference to a Merkle tree collection which is a hash of all transactions related to this block|
|4   |timestamp |  uint32_t  |  A timestamp recording when this block was created (Limited to 2106!)|
|4   |bits |   uint32_t   | The calculated difficulty target being used for this block|
|4   |nonce |  uint32_t |   The nonce used to generate this block… to allow variations of the header and compute different hashes|
|4   |total_transactions | uint32_t |   Number of transactions in the block (including unmatched ones)|
| ?  |hashes | uint256[]  | hashes in depth-first order (including standard varint size prefix)|
| ?  |flags |  byte[] | flag bits, packed per 8 in a byte, least significant bit first (including standard varint size prefix)|


### alert

Note: Support for alert messages has been removed from bitcoin core in March 2016. Read more [here](https://bitcoin.org/en/alert/2016-11-01-alert-retirement)

### sendheaders
请求直接标题公告。
收到此消息后，允许但不要求节点通过headers命令（而不是inv命令）通知新块。
协议版本> = 70012或比特币核心版本> = 0.12.0支持此消息。
有关更多信息，请参阅[BIP 130](https://github.com/bitcoin/bips/blob/master/bip-0130.mediawiki)。
此消息不会传输其他数据


### feefilter

有效负载总是8个字节长，它编码64位整数值（LSB / little endian）的费用。
该值代表最小费用，以每1000字节的satoshis表示。
在收到“费用过滤器”消息后，该节点将被允许但不是必需的，以过滤低于费用过滤器消息中提供的费用率的交易的交易保护，该费用被解释为每千字节的satoshis。
费用过滤器是附加的，用于交易的布隆过滤器，因此如果SPV客户端要加载布隆过滤器并发送费用过滤器消息，则只有在通过两个过滤器时才会中继交易。
如果存在，则从mempool消息生成的Inv也需要收费过滤器。
通过检查协议版本> = 70013启用功能发现
有关更多信息，请参阅[BIP 133](https://github.com/bitcoin/bips/blob/master/bip-0133.mediawiki)

### sendcmpct

1. sendcmpct 消息被定义为包含1字节整数后跟8字节整数的消息，其中pchCommand ==“sendcmpct”。
2. 第一个整数应解释为布尔值（并且必须具有1或0的值）
3. 第二个整数应解释为little-endian版本号。发送sendcmpct消息的节点当前必须将此值设置为1。
4. 收到第一个和第二个整数设置为1的“sendcmpct”消息后，节点应该通过发送cmpctblock消息来通告新的块。
5. 在收到第一个整数设置为0的“sendcmpct”消息后，节点不应该通过发送cmpctblock消息来通告新块，但是应该通过发送由BIP130定义的inv或头来发布新块。
6. 在收到第二个整数设置为1以外的“sendcmpct”消息时，节点必须将对等体视为没有收到消息（因为它表明对等体将提供意外的编码）
7. cmpctblock和/或其他消息）。这允许将来的版本发送具有不同版本的重复sendcmpct消息，作为未来版本的版本握手的一部分。
8. 在发送sendcmpct消息之前，节点应该检查协议版本> = 70014。
9. 在收到来自该对等体的sendcmpct消息之前，节点不得向对等体发送对MSG_CMPCT_BLOCK对象的请求。
此消息仅受协议版本> = 70014支持

有关更多信息，请参阅[BIP 152](https://github.com/bitcoin/bips/blob/master/bip-0152.mediawiki)。

### cmpctblock

1. cmpctblock消息被定义为包含序列化HeaderAndShortIDs消息和pchCommand ==“cmpctblock”的消息。
2. 在发送sendcmpct消息后收到cmpctblock消息后，节点应该为他们可用的每个未确认的事务（即在他们的mempool中）计算短事​​务ID，并将每个事务ID与cmpctblock消息中的每个短事务ID进行比较。
3. 在找到已经可用的事务之后，没有可用于重建完整块的所有事务的节点应该使用getblocktxn消息来请求丢失的事务。
4. 节点绝不能发送cmpctblock消息，除非它们能够响应请求块中每个事务的getblocktxn消息。
5. 节点必须不发送cmpctblock消息，而不验证标头是否正确提交到块中的每个事务，并且正确地构建在具有有效工作证明的现有链之上。节点可以在验证块中的每个事务有效地花费现有UTXO集条目之前发送cmpctblock。

此消息仅受协议版本> = 70014支持

有关更多信息，请参阅[BIP 152](https://github.com/bitcoin/bips/blob/master/bip-0152.mediawiki)。


### getblocktxn
1. getblocktxn消息被定义为包含序列化BlockTransactionsRequest消息和pchCommand ==“getblocktxn”的消息。
2. 在收到格式正确的getblocktxnmessage后，最近为这种消息的发送者提供了该消息中标识的块散列的cmpctblock的节点必须用适当的blocktxn消息进行响应。这样的blocktxn消息必须完全且仅包含在请求的顺序中在getblocktxn索引列表中指定的索引处的适当块中存在的每个事务。
此消息仅受协议版本> = 70014支持

有关更多信息，请参阅[BIP 152](https://github.com/bitcoin/bips/blob/master/bip-0152.mediawiki)。

### blocktxn
1. blocktxn消息被定义为包含序列化BlockTransactions消息和pchCommand ==“blocktxn”的消息。
2. 在收到格式正确的请求的blocktxn消息后，节点应该尝试通过以下方式重建整个块：
3. 从原始cmpctblock中获取 prefilledtxn事务并将它们放在标记位置。
4. 对于来自原始cmpctblock的每个短事务ID ，按顺序从blocktxn消息或其他源中查找相应的事务，并将其置于块中的第一个可用位置。
5. 一旦块被重建，它将被正常处理，记住短事务ID偶尔会发生冲突，并且节点不得因这些冲突而受到惩罚，无论它们出现在何处。
此消息仅受协议版本> = 70014支持

有关更多信息，请参阅[BIP 152](https://github.com/bitcoin/bips/blob/master/bip-0152.mediawiki)。

## 别人如何知道我的 如何交换数据

其实i 看到这里，我们如何交易数据的就已经很清楚了。

## NAT 与， p2p 和 区块链

### 什么事 NAT
 
 NAT是个什么鬼？它的全称是Network Address Translation，翻译过来就是网络地址转换。好事的人立马就得问了：好端端的为啥要地址转换，直接用IP地址不就行了么？

在TCP/IP协议创建的时候，他的创始人（Robert E.Kahn和Vinton G.Cerf）可能都没有预料到互联网的膨胀速度会如此之快，快到短短二三十年的时间，IPV4的地址就有要枯竭之势。随着越来越多的设备加入到互联网中，IPV4地址不够用的问题成了燃眉之急。

解决IP地址不够用的一个办法是大家已经非常熟悉的IPV6，但是这么多年过去了，IPV6似乎还是不温不火，始终普及不起来。于是就有了NAT的解决方案，可以说正是NAT把IPV4从死亡边缘拉了回来，NAT到底是用了什么方法立下如此奇功，本节我们来简单的了解一下。

平时我们无论是在家里，还是在公司，其实都是在一个私有的局域网，此时电脑上分配到的IP地址是私有IP地址。RFC1918规范里规定了3个保留地址段：10.0.0.0-10.255.255.255，172.16.0.0-172.31.255.255，192.168.0.0-192.168.255.255，这三个范围分别处于A、B、C类的地址段，专门用于组织或者企业内部使用，不需要进行申请。和公有IP地址相比，这些私有IP地址只在企业内部使用，不能作为全球路由地址，出了企业或组织的管理范围，这类私有地址就不在有任何意义。注意：任何一个组织都可以在内部使用这些私有地址，因此两个不同网络中存在相同IP地址的情况是很可能出现的，但是同一个网络中不允许两台主机拥有相同IP地址，否则将发生地址冲突。

当私有网络中的主机想请求公网中服务器的服务时，需要在网络出口处部署NAT网关。NAT的作用就是在报文离开私网进入Internet的时候，把报文中的源IP地址替换为公网地址，然后等服务端的响应报文到达网关时，NAT再把目的地址替换为私网中主机的IP地址。

听上去似乎很简单，NAT不就是替换了一下IP地址么，也没干什么，但是这里需要注意两点：

1. 有了NAT以后，内网的主机不在需要申请公网IP地址，只需要将内网主机地址和端口通过NAT映射到网络出口的公网IP即可，然后通信的两端在无感知的情况下进行通信。这也是为什么前文说NAT挽救了IPV4，因为大量的内网主机有了NAT，只需要很少的公网地址做映射就可以了，如此就可以节约出很多的IPV4地址空间。

2. 当在私网网络出口处部署了NAT网关以后，只能由内网主机发起到外网主机的连接，外网主机无法主动发起连接到内网。这样虽然对外隔离了内网主机，但同时又限制了P2P的通信，这也是NAT带来的一大弊端，下一节介绍NAT穿透技术时会看到针对这一问题有哪些解决手段。

区块链是建立在P2P网络基础上的。在比特币系统中，穿透NAT建立节点之间点对点的P2P网络，采用的就是上一节所说的UPNP技术。比特币使用了开源的miniupnp，基本上就是调用miniupnp封装好的接口，实现比较简单，我们来看看源代码：

比特币系统的初始化大部分都是在init.cpp中的AppInitMain中进行的：
````cpp
 // Map ports with UPnP
if (gArgs.GetBoolArg("-upnp", DEFAULT_UPNP)) {
    StartMapPort();
}
````

### NAT 穿透

前文提到过，使用NAT的缺陷之一就是只能由内网主机发起连接，外网主机无法主动连接到内网。这就意味着外部节点无法和内网主机进行P2P通信，就像第一节中提到的那个场景：因为两个人在不同的局域网中，相互不知道对方的公网地址和端口，所以无法直接建立起点对点连接。解决这个问题的办法就是NAT穿透技术。下面简单介绍几种常见的NAT穿越技术。

#### STUN

STUN全称为Simple Tranversal of UDP through NAT。其穿透原理参考下图：


![](/publicFiles/images/p2p network/20180520171109120.png "STUN 穿透原理")

假设两个不同网络中的设备A和B想穿透NAT进行点对点通信，通过STUN进行NAT穿透的过程如上图，其中STUN SERVER是部署在公网中的STUN服务器。

 1. CLIENT A通过NAT网关向STUN SERVER发送STUN请求消息(UDP)，查询并注册自己经过NAT映射后的公网地址；
 2. STUN SERVER响应，并将CLIENT A经过转换后的公网IP地址和端口填在
 2. CLIENT B通过NAT网关向STUN SERVER发送STUN请求消息(UDP)，查询并注册自己经过NAT映射后
 2. STUN SERVER响应，并将CLIENT B经过转换后的公网IP地址和端口填在
 2. 此时CLIENT A已经知道了自己映射后对应的公网IP地址和端口号，它把这些信息打包在请求中发送给STUN SERVER，请求和
 2. STUN SERVER查询到B注册的公网地址和端口，然后将请求通过NAT网
 2. B从消息中知道A的公网地址和端口，于是通过此地址和端口，向A发送消息，消息中包含B映射后的公网地址和端口号，A收到消息后就知道了B的公网地址及端口，这样在A和B之间建立起了通信通道。


从代码中可以看到，如果在启动bitcoind时开启了upnp选项，将会进行端口映射，如果想将自己的节点加入到比特币p2p网络中，让其他网络中的节点访问，可以开启此选项进行端口映射，然后把映射后的公网ip地址广播给网络中的其他节点。

StartMapPort()中开启了一个线程进行端口映射，线程函数为net.cpp中的ThreadMapPort：

#### TURN

STUN穿透技术的缺点在于无法穿透对称型NAT，这可以通过TURN技术进行改进。TURN的工作过程和STUN非常相似，区别在于在TURN中，公网地址和端口不由NAT网关分配，而是由TURN服务器分配。

TURN可以解决STUN无法穿透对称NAT的问题，但是由于所有的请求都需要经过TURN服务器，所以网络延迟和丢包的可能性较大，实际当中通常将STUN和TURN混合使用。

#### UPNP

UPNP意为通用即插即用协议，是由微软提出的一种NAT穿透技术。使用UPNP需要内网主机、网关和应用程序都支持UPNP技术。

UPNP通过网关映射请求可以动态的为客户分配映射表项，而NAT网关只需要执行地址和端口的转换。UPNP客户端发送到公网侧的信令或者控制消息中，会包含映射之后公网IP和端口，接收端根据这些信息就可以建立起P2P连接。

UPNP穿透的过程大致如下：

1. 发送查找消息：
    一个设备添加到网络以后，会多播大量发现消息来通知其嵌入式设备和服务，所有的控制点都可以监听多播地址以接收通知，标准的多播地址是239.255.255.250：1900。可以通过发送http请求查询局域网中upnp设备，消息形式如下
    ````
    M-SEARCH * HTTP/1.1 \r\n

    HOST 239.255.255.250:1900 \r\n

    ST:UPnP rootdevice \r\n

    MAN:\"ssdp:discover\" \r\n

    MX:\r\n\r\n
    ````
2. 获得根设备描述url
    如果网络中存在upnp设备，此设备会向发送了查找请求的多播通道的源IP地址和端口发送响应消息，其形式如下：
    ````
    HTTP/1.1 200 OK

    CACHE_CONTROL: max-age=100

    DATE: XXXX

    LOCATION:http://192.168.1.1:1900/igd.xml

    SERVER: TP-LINK Wireness Router UPnP1.0

    ST: upnp:rootdevice
    ````
    首先通过200 OK确定成功的找到了设备。然后要从响应中找到根设备的描述URL（例如上面响应报文中的`http://192.168.1.1:1900/igd.xml`），通过此URL就可以找到根设备的描述信息，从根设备的描述信息中又可以得到设备的控制URL，通过控制URL就可以控制UPNP的行为。上面这个响应中表示我们在局域网中成功的找到了一台支持UPNP的无线路由器设备。

3. 通过（2）中找到的设备描述URL的地址得到设备描述URL得到XML文档。发送HTTP请求消息：
    ````
    GET /igd.xml HTTP/1.1

    HOST:192.168.1.1:1900

    Connection: Close
    ````
    然后就能得到一个设备描述文档，从中可以找到服务和UPNP控制URL。每一种设备都有对应的serviceURL和controlURL。其中和端口映射有关的服务时WANIPConnection和WANPPPConnection。
4. 进行端口映射
    拿到设备的控制URL以后就可以发送控制信息了。每一种控制都是根据HTTP请求来发送的，请求形式如下：
    ````
    POST path HTTP/1.1

    HOST: host:port

    SOAPACTION:serviceType#actionName

    CONTENT-TYPE: text/xml

    CONTENT-LENGTH: XXX

    ....
    ````

其中path表示控制url，host:port就是目的主机地址，actionName就是控制upnp设备执行响应的指令。UPNP支持的指令如下：

| actionName | 描述|
|-----|-----|
| GetStatusInfo  | 查看UPNP设备状态|
| AddPortMapping | 添加一个端口映射|
| DeletePortMapping  | 删除一个端口映射|
| GetExternalIPAddress |   查看映射的外网地址|
| GetConnectionTypeInfo  | 查看连接状态|
| GetSpecificPortMappingEntry| 查询指定的端口映射|
| GetGenericPortMappingEntry | 查询端口映射表|

通常我们需要用到的是AddPortMapping进行端口映射，以及GetExternalIPAddress获取到映射的公网地址。
UPNP完整的协议栈比较复杂，有兴趣的读者可以自行查找资料做更加深入的学习。

### UPNP在比特币P2P网络中的应用

````cpp
#ifdef USE_UPNP
static CThreadInterrupt g_upnp_interrupt;
static std::thread g_upnp_thread;
static void ThreadMapPort()
{
    std::string port = strprintf("%u", GetListenPort());
    const char * multicastif = nullptr;
    const char * minissdpdpath = nullptr;
    struct UPNPDev * devlist = nullptr;
    char lanaddr[64];
 
#ifndef UPNPDISCOVER_SUCCESS
    /* miniupnpc 1.5 */
    devlist = upnpDiscover(2000, multicastif, minissdpdpath, 0);
#elif MINIUPNPC_API_VERSION < 14
    /* miniupnpc 1.6 */
    int error = 0;
    devlist = upnpDiscover(2000, multicastif, minissdpdpath, 0, 0, &error);
#else
    /* miniupnpc 1.9.20150730 */
    int error = 0;
    devlist = upnpDiscover(2000, multicastif, minissdpdpath, 0, 0, 2, &error);
#endif
 
    struct UPNPUrls urls;
    struct IGDdatas data;
    int r;
 
    r = UPNP_GetValidIGD(devlist, &urls, &data, lanaddr, sizeof(lanaddr));
    if (r == 1)
    {
        if (fDiscover) {
            char externalIPAddress[40];
            r = UPNP_GetExternalIPAddress(urls.controlURL, data.first.servicetype, externalIPAddress);
            if(r != UPNPCOMMAND_SUCCESS)
                LogPrintf("UPnP: GetExternalIPAddress() returned %d\n", r);
            else
            {
                if(externalIPAddress[0])
                {
                    CNetAddr resolved;
                    if(LookupHost(externalIPAddress, resolved, false)) {
                        LogPrintf("UPnP: ExternalIPAddress = %s\n", resolved.ToString().c_str());
                        AddLocal(resolved, LOCAL_UPNP);
                    }
                }
                else
                    LogPrintf("UPnP: GetExternalIPAddress failed.\n");
            }
        }
 
        std::string strDesc = "Bitcoin " + FormatFullVersion();
 
        do {
#ifndef UPNPDISCOVER_SUCCESS
            /* miniupnpc 1.5 */
            r = UPNP_AddPortMapping(urls.controlURL, data.first.servicetype,
                                port.c_str(), port.c_str(), lanaddr, strDesc.c_str(), "TCP", 0);
#else
            /* miniupnpc 1.6 */
            r = UPNP_AddPortMapping(urls.controlURL, data.first.servicetype,
                                port.c_str(), port.c_str(), lanaddr, strDesc.c_str(), "TCP", 0, "0");
#endif
 
            if(r!=UPNPCOMMAND_SUCCESS)
                LogPrintf("AddPortMapping(%s, %s, %s) failed with code %d (%s)\n",
                    port, port, lanaddr, r, strupnperror(r));
            else
                LogPrintf("UPnP Port Mapping successful.\n");
        }
        while(g_upnp_interrupt.sleep_for(std::chrono::minutes(20)));
 
        r = UPNP_DeletePortMapping(urls.controlURL, data.first.servicetype, port.c_str(), "TCP", 0);
        LogPrintf("UPNP_DeletePortMapping() returned: %d\n", r);
        freeUPNPDevlist(devlist); devlist = nullptr;
        FreeUPNPUrls(&urls);
    } else {
        LogPrintf("No valid UPnP IGDs found\n");
        freeUPNPDevlist(devlist); devlist = nullptr;
        if (r != 0)
            FreeUPNPUrls(&urls);
    }
}

````

1. 首先第一行拿到比特币系统所使用的端口号，默认为8333，之后将要映射此端口到公网ip上；
2. 调用upnpDiscover查找当前局域网中的所有upnp设备；
3. 调用UPNP_GetValidIGD，从（2）中找到的upnp设备列表中找到有效的IGD设备；
4. 如果UPNP_GetValidIGD返回1，表示有一个连接，此时调用UPNP_  GetExternalIPAddress获取公网地址，然后对此公网地址进行DNS查询，将解析到的地址记录到内存中，这些公网地址之后将会被广播给P2P网络中的其他节点，一传十，十传百。
5. 通过UPNP_AddPortMapping进行端口映射，假设内网获取的有效IGD设备的IP地址为192.168.0.1，网关出口的外网地址为192.169.1.1，采用比特币的默认端口8333，则端口映射后就是将内网中192.168.0.1：8333映射到网关出口的公有IP地址和端口：192.169.1.1:8333，之后外部节点通过此公网IP和端口，就可以与内网节点进行通信了。


## 小结

这篇文章，主要介绍了，如何获取节点，以及节点的交流方式。逐个分析了，每个消息的结构。
后面介绍了NAT以及常见的NAT穿透技术。因为建立P2P通信很重要的一步就是穿透NAT以建立起节点之间的通信通道。
常见的NAT穿透技术有STUN，TURN以及UPNP，而比特币P2P组网采用的正是UPNP技术，具体实现时比特币采用了开源的[miniupnp](https://github.com/miniupnp/miniupnp)。


**参考链接**
*  [比特币源码分析--P2P网络初始化](https://blog.csdn.net/ztemt_sw2/article/details/80291705)
*  [比特币源码分析--端口映射](https://blog.csdn.net/ztemt_sw2/article/details/80321600)
*  [Bitcoin wiki - Protocol documentation](https://en.bitcoin.it/wiki/Protocol_documentation#Network_address)
*  [Bitcoin wiki - Network](https://en.bitcoin.it/wiki/Network)