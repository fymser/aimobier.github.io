---
categories: 服务器
title: 使用 NodeJS APNS 给你的应用发消息
tags:
  - NodeJS
  - APNs
  - ios
permalink: syNodeJSAPNSgndyyfxx
date: 2017-11-22 17:02:00
---

用到了小米的 MiPushSDK 今天出现了问题，总之无论如何就吃错误。在跟他们的开发人员进行交流的同时，我想看看是谁的问题，所以有了以下的经历。
[Demo Github 地址](https://github.com/aimobier/APNS)

![楼下一个男人病的要死，隔壁的一家唱着留音机。对面是哄孩子，楼上有两个人狂笑，还有打牌声。河边的船上有女人哭着她死去的母亲。人类的悲喜并不相通，我只觉得他们吵闹。——鲁迅](http://image.msiter.com/stock-photo-236362221.jpg)

<!-- more -->


## 创建推送证书

创建推送证书 这个步骤省略

## 导出 证书.p12 和 key.p12

推送证书安装在本地之后

1. 打开 应用 钥匙串访问 找到自己的证书
2. 在需要导出的证书上右键点击 导出 这个东西就是证书.p12 有没有密码都可以 密码会用来一会 openssl 的时候输入
3. 点击这个证书 展开之后会看到一个 Key 右键导出 这个导出的 p12 就是 key.p12 密码设置同上

## 将导出的 p12 生成为 pem

````shell
openssl pkcs12 -clcerts -nokeys -out cert.pem -in cert.p12 # 导出 cert.pem
openssl pkcs12 -in key.p12 -out key.pem -nodes # 导出 key.pem
````
在转换过程中 p12 设置了密码就输入密码 没有输入直接回车就可以    
在设置 key.pem 的过程中 会向你询问是否设置密码，设置密码需要输入两次 分别是密码和确认密码

## 开始创建 Nodejs APNS 服务

### 创建 NodeJs项目

创建一个 NodeJS 项目

````shell
mkdir APNS
cd APNS
npm init
````

按照步骤填写信息，之后在生成的package.json 文件中 引入 对于 apn  的支持
````json
"dependencies": {
  "apn": ""
}
````
总体上看起来是这个样子的
````json
{
  "name": "apn",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "apn": ""
  }
}
````
### 完成

创建一个 index.js 文件

````javascript
var apn = require("apn");

var tokens = ["<<you want push device token>>"];

var service = new apn.Provider({
  "cert": "push/cert.pem", // 根目录下创建 push 文件夹 将文件放置在内，当然你可以放在自己喜欢的位置
  "key": "push/key.pem",
  "production":false
});

var note = new apn.Notification({
  "alert":"Hello World!",
  "sound":"default"
});

// The topic is usually the bundle identifier of your application.
note.topic = "<<you bundle identifier>>";
note.badge = 0;

console.log(`Sending: ${note.compile()} to ${tokens}`);
service.send(note, tokens).then( result => {
    console.log("sent:", result.sent.length);
    console.log("failed:", result.failed.length);
    console.log(result.failed);
});

// For one-shot notification tasks you may wish to shutdown the connection
// after everything is sent, but only call shutdown if you need your
// application to terminate.
service.shutdown();

````

 这里面只进行了一些基本的设置，只设置了标题关于消息内容等设置 可以查阅文档或者直接在

apn/lib/notification/ 目录下查看 设置

目前的版本是存在这些的

````json
["payload", "expiry", "priority", "alert", "body", "locKey",
"locArgs", "title", "subtitle", "titleLocKey", "titleLocArgs", "action",
"actionLocKey", "launchImage", "badge", "sound", "contentAvailable",
"mutableContent", "mdm", "urlArgs", "category", "threadId"]
````

### 测试

````shell
node index.js
````

大功告成
