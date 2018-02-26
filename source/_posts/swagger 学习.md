---
title: Swagger 初级学习
tags:
  - swagger
  - api
categories: 开发帮助
permalink: Swaggercjxx
date: 2015-07-13 18:41:43
---
![](/publicFiles/images/stock-photo/stock-photo-76133855.jpg "突然想到你，笑了笑自己。")


最开始只是想找一个制作api的工具而已，然后再某一个帖子中发现了这个家伙。他不只是可以让你可以展示服务器的API接口。你甚至可以让客户端受益，生成客户端代码，让客户端开发者直接调用生成代码，使用生成的代码，访问你的接口并且完成数据的获取。So Coll

> Swagge is a simple yet powerful representation of your RESTful API

<!-- more -->

`swagger`的意思是 狂妄自大。但是等我介绍完毕之后你会的觉的他的狂妄绝对是有道理的，没有浮夸。具体来说他是什么呢，正如他自己的介绍，是一个简单而又强大的api发布工具，强大是毋庸置疑的，我现在知道也只是他的几个组件中的几个而已，还有更多的作用的，当然就是这几个作用我就已经获益匪浅了。废话不多说。

本文将从这几个步骤展开讲述：

- 作为服务器，我们应该如何向后端展示API介绍页面呢
 1. 在哪里编写呢？
 2. 怎么编写？
 3. 如何展示？ 仅限`NodJs`
- 作为客户端，我们如何获取数据根据`Swagger`的方式
 1. 如何获取?
 2. 怎么使用? 仅限`swift`

### 在哪里编写呢？
两种是，一种是网络编辑器，第二种本地编辑器。如果你哪里的网络没有很差的话，比较推荐使用第一种方式。毕竟`简单才是王道`

1. 点击[这里](http://editor.swagger.io/#/)进入
2. 首先需要你拥有 nodejs 环境，然后执行以下语句
````shell
git clone https://github.com/swagger-api/swagger-editor.git
cd swagger-editor
npm start
````
其实这两种方式完成之后都会看到编辑页面。当然第一种会简单的很多。
打开页面之后你要看看上面的导航栏哦

1. `file`自然就是文件的一些操作了，比如新建啊，打开自己的，或者打开魔板啊，之类的。、
2. `Preferences` 基本的一些配置，譬如说： 字体大小啊之类的饿，当然也会有其他的设置，但是如果你不是强迫症或者有自己的独特的准则的人，那么这个东西你可以无视
3. `Generate Server` 看他的意思也很明白了，生成服务器代码至于你生成什么语言的服务器就看你自己了。
4. `Generate Client` 生成客户端代码。很明显啦~  哇哈哈哈
5. `help` - can l help you? 界面
### 怎么编写呢
这个就要说起来话就多了，但是我就挑一些重要的吧。毕竟我懒…
这里的编辑需要一种模板语言的基础。
````yaml
######   使用请打开 【http://editor.swagger.io/#/】 或者





################################################################################
#                                 swagger                                      #
################################################################################
#这个是必须的
swagger: '2.0'
################################################################################
#                                 info                                         #
################################################################################
#文档信息
info:
  title: 遇见 Api
  description: 遇见 web Service Api 接口。该接口文档用于开发者更好的根据数据，用于遇见用户的记录和遇见用户动态的整合。
  version: "1.0.0"
  termsOfService: Copyright [2015] [一匡天下]
  license:#可有可无
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
  contact:
    name: 荆文征
    url: msiter.com
    email: msiter@qq.com
# API地址
host: api.msiter.com
# 请求方式
schemes:
  - http
# 这个字段会添加到所有的API前面，当做版本控制字段还是不错的
#basePath: /v1

#MIME类型的api可以产生的列表。这是可以覆盖全球所有API,但在特定的API调用。值必须是所述 http://http://swagger.io/specification/#mimeTypes
consumes:
  - application/json

#MIME类型的api可以产生的列表。这是可以覆盖全球所有API,但在特定的API调用。值必须是所述 http://http://swagger.io/specification/#mimeTypes
produces:
  - application/json
################################################################################
#                                   Tags                                       #
################################################################################
#标签，如果你不写的话，他会自动帮你生成的。如果你自己写的话…请注意到咱们的民族。大中国语言毕竟有些不被世界接受，所以难免不好看。还是希望使用英文吧。
tags:
  - name: 用户
    description: |
      有关于用户的接口API:
      * 关于`注册`
      * 关于`获取`
  - name: 动态
    description: |
      有关于动态的接口API:
      * 关于`创建`
      * 关于`获取`
  - name: 辅助标签
    description: |
      > 单纯的为了好看
################################################################################
#                                 paths                                        #
################################################################################
#接下里就是API主题了
paths:
  /users/registered:
    post:
      summary: 注册用户
      description: 根据用户传入的新浪微博参数,返回数据库里的用户信息.
      parameters:
       - name: source
         required: true
         in: query
         type: string
         format: string
         description: 新浪微博 App Id
       - name: access_token
         required: true
         in: query
         type: string
         format: string
         description: 新浪微博 认证口令
       - name: uid
         required: true
         in: query
         type: string
         format: string
         description: 新浪微博 用户ID.
      tags:
        - 用户
      responses:
        200:
          description: 请求完成，获取用户成功
          schema:
            $ref: '#/definitions/User'
        400:
          description: 请求失败
          schema:
            $ref: '#/definitions/Error'

  /users/obtainbyid:
    get:
      summary: 根据用户id获取用户信息
      description: 根据用户传入的用户id获取用户的信息.
      parameters:
       - name: masterid
         required: true
         in: query
         type: string
         format: string
         description: 主人id
       - name: otherid
         required: false
         in: query
         type: string
         format: string
         description: 要查询的用户id,如果不传递则查询主人id
      tags:
        - 用户
      responses:
        200:
          description: 请求完成，获取用户成功
          schema:
            $ref: '#/definitions/User'
        400:
          description: 请求失败
          schema:
            $ref: '#/definitions/Error'
  /users/obtainallmeetuser:
    get:
      summary: get User By Id
      description: 根据用户id获取用户所有的遇见的人信息.这个接口其实就是获取用户的好友。
      parameters:
       - name: userid
         required: true
         in: query
         type: string
         format: string
         description: 用户id
      tags:
        - 用户
      responses:
        200:
          description: 请求完成，获取用户成功
          schema:
            type: array
            items:
              $ref: '#/definitions/User'
        400:
          description: 请求失败
          schema:
            $ref: '#/definitions/Error'
################################################################################
#                                 Definitions                                  #
################################################################################
#API所需要的模块。
definitions:
  User:
    description: 用户对象
    type: object
    properties:
      _id:
        type: string
        description: 用户id.
      sinaId:
        type: string
        description: 新浪微博唯一标示.
      name:
        type: string
        description: 用户名称.
      gender:
        type: string
        description: 用户性别 m：男、f：女、n：未知.
      commGround:
        type: string
        description: 用户常出没地.
      signature:
        type: string
        description: 用户的个性签名.
      headPhotoKey:
        type: string
        description: 七牛的文件访问标示.
      createDateTime:
        type: string
        format: date-time
        description: 用户注册时间.
      userLabels:
        type: array
        items:
          $ref: '#/definitions/UserLabel'
      userBacks:
        type: array
        items:
          $ref: '#/definitions/UserBack'
  UserBack:
    description: 用户背景对象
    type: object
    properties:
      index:
        type: number
        description: 用户背景的排序表示.
      identifier:
        type: string
        description: 用户背景的唯一标示.
      imageKey:
        type: string
        description: 七牛的文件访问标示.
  UserLabel:
    description: 用户个性签名对象
    type: object
    properties:
      content:
        type: string
        description: 用户背景的排序表示.
      identifier:
        type: string
        description: 用户背景的唯一标示.
      createDateTime:
        type: string
        format: date-time
        description: 七牛的文件访问标示.
  Error:
    description: 错误信息
    properties:
      error:
        type: string
        description: 错误信息.

````

这个我真的不知道怎么说了，代码复制一下，复制到编辑器内。看看效果对照着来，我相信很快就会学会的。当然人家也是提供了一些示例代码了的，你也可以不看我的这个的。


### 怎么展示
那就`so Easy`啦，去导航下载你索对应的服务器语言就OK，找不到？  那么我推荐你使用`NODEJS`。

比如我就是下载的nodejs代码，解压后
````
cd nodejs-server
npm install
node index.js
````

然后[点击](http://localhost:8080/docs)不出现什么重大意外，你现在已经处于api页面了。

### 如何获取?

点击导航内，并下载你所对应的语言

### 怎么使用? - `swift`

我只知道swift的oc 的类似，其他的语言小弟不曾涉猎。抱歉。

下载完成后，解压后进入后：

1. 如果你使用的`cocopod`,只需要把 文件夹内的`SwaggerClient`文件夹一股脑的拽进你的项目就OK，当然你需要查看一下 `Carfile`文件看看需要引入那些第三方，pod install就可以了。
2. `Carthage`是一个第三方加载组件。我之前因为不知道，直接使用`cocopod`也可以,所以尝试了一番，故记下：
  - 安装 `Carthage` - 使用 `brew install Carthage`
  2. 安装完成后，进入文件目录，`Carthage update`
  3. 打开项目，在项目的某个Target -> Build Phases -> Link Library with Libraries，将Carthage/Build目录中希望导入的Framework库拖拽进去。
  4. 添加脚本，添加Input Files
     - 添加脚本
         ```/usr/local/bin/carthage copy-frameworks```     
      - 添加Input Files
     ```$(SRCROOT)/Carthage/Build/iOS/你所需要的.framework```
