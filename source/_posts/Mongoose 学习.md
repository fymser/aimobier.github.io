---
title: Mongoose 学习
date: 2015-07-11 20:53:35
tags: [mongodb,mongoose,nodejs]
categories: Constant learning
---

![](http://image.msiter.com/stock-photo-161742993.jpg "醉后不知天在水，满船清梦压星河。")

> Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.

关于mongodb的优势之类的话，我也就不说什么，因为你既然使用这个数据库的话，我相信你已经对他的基本信息很了解了。
另外本篇文章没有基本的操作。主要是针对，子表和关联表的操作。因为我觉的基本的操作，不是很麻烦，而遍地都是文档，我感觉没什么必要再叨唠一遍了

<!--more-->

## MongoDB 简介

MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。
MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

## 数据库操作

### 连接数据库，创建一个表。

````javascript
///获取Mongoose组件
var mongoose = require('mongoose');
///链接至数据库，Meet则为数据库名称
mongoose.connect('mongodb://localhost/Meet');
````

既然已经连接上的话，那么接下来就该是如何创建表了。

````javascript
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    sinaId: String,
    name: String,
    gender: String,//性别，m：男、f：女、n：未知
    commGround: String,
    signature: String,
    headPhotoKey: String,
    userBacks: [{
        identifier: String,
        index: Number,
        imageKey: String
    }],
    userLabels: [{
        content: String,
        identifier: String,
        createDateTime: {type: Date, default: Date.now}
    }],
    createDateTime: {type: Date, default: Date.now}
}, {collection: "User"});///User就是表名了

/**
中间写其他的一些方法
*/
var User = mongoose.model('User', UserSchema);
````

至此 一个表已经创建完成了，可能你会诧异为什么你启动了服务器并且也连接到了数据库却没有创建表，不要着急，你没有数据的时候，数据库是不会显示的。

## 子表如何操作

大家看我接下来的一张表

````javascript
var UserSchema = new mongoose.Schema({
    sinaId: String,//新浪微博ID
    name: String,//用户名称
    gender: String,//性别，m：男、f：女、n：未知
    commGround: String,//唱出没地
    signature: String,//个性签名
    headPhotoKey: String,//头像地址
    userLabels: [{//用户个人标签集合
        content: String,//内容
        identifier: String,//唯一标示
        createDateTime: {type: Date, default: Date.now}//创建时间
    }],
    createDateTime: {type: Date, default: Date.now},//用户注册时间
    isDelete: {type: Boolean, default: false}//是否删除
}, {collection: "MeetUser"});
````

这是一个基本的用户数据类型。接下来让我们来看看如何操作这个类型那个吧。

### 子表新增数据
````javascript


//创建用户标签方法
UserSchema.statics.createUserLabel = function (userid, identifier, content, createtime, callBack) {
    //首先查看数据库中该用户是否存在这个个人标签，方法会在下面列出
    this.findUserLabel(userid, identifier, function (err, result) {
        if (result) {
            if (callBack)return callBack(err, result);
            return;
        }
        //如果并没有该对象，那么久创建一个新德对象
        var b = {
            identifier: identifier,
            content: content,
            createDateTime: createtime
        }
        //这里就是重点，使用findOneAndUpdate找到高用户，之后使用 $push 新增一个用户个人标签，并且执行
        User.findOneAndUpdate({"_id": mongoose.Types.ObjectId(userid)}, {'$push': {"userLabels": b}}).exec(function (err, result) {
            ///接口需要所以要在增加完成之后，获取这个用户并且返回
            User.findOne({"_id": mongoose.Types.ObjectId(userid)}, function (err, result) {
                callBack(err, result);
            });
        });
    });
};

````
### 子表查找数据
````javascript
///该方法就是上面方法中调用的查找方法
UserSchema.statics.findUserLabel = function (userid, identifier, callBack) {
    this.findOne({
        "_id": mongoose.Types.ObjectId(userid),
        "userLabels.identifier": identifier
    }, function (err, result) {
        if (callBack)return callBack(err, result);
    })
};
````

### 子表删除数据
由于业务上的需要，所以接下来方法是清空该用户所有的个人标签

````javascript
UserSchema.statics.cleanUserLabels = function (userid, callBack) {
    ///先找到该用户
    this.findOne({"_id": mongoose.Types.ObjectId(userid)}, function (err, result) {
        ///循环遍历用户的个人标签，async 会在另一篇博客中详细讲解
        async.map(result.userLabels, function (item, callback) {
            // 之后使用 $pull 删除用户的个人标签
            User.update({"_id": mongoose.Types.ObjectId(userid)}, {'$pull': {"userLabels": {"identifier": item.identifier}}}, function (err, numberUpdated) {
                callback(null, true)
            });
        }, function (err, results) {
            if (callBack)return callBack(results.length);
        });
    });
};
````

### 子表修改数据

````javascript
UserSchema.statics.modifysUserLabel = function (userid, identifier,content, callBack) {
    this.update({
        "_id": mongoose.Types.ObjectId(userid),
        "userLabels.identifier": identifier
    }, {'$set': {"userLabels.$.content": content}}, function (err, numberUpdated) {
        User.findById(userid, function (err, data) {
            if(callBack)callBack(err, data);
        });
    });
};
````
以上就是子类的增删改查。希望对你有些许帮助。基本的增删改查，我这里就不多多解释了。


##关联表如何操作

在mongodb中并没有关联表这么一说，这也是因为mongodb本身就是非关系型数据库，但是mongoose中的`populate`方法在一定程度上解决了关联问题

首先来查看一些数据库的设计吧。

### 关联表设计

````javascript
//用户表
var UserSchema = new mongoose.Schema({
    name: String
}, {collection: "MeetUser"});

//加入数据库
var User = mongoose.model('User', UserSchema);

//分组表
var GroupSchema = new mongoose.Schema({
    name:String,
    //此时的ref字段要和加入数据库中的model方法内的字段吻合，并且记住一定要写字符串
    users:[{type:mongoose.Schema.ObjectId,ref:'User'}]
},{collection:"MeetGroup"});

var Group = mongoose.model('Group',GroupSchema);

````

### 关联表查询方法

````javascript

GroupSchema.statics.loadGroup = function(callBack){
  Group.find().populate('users').exec(callBack);
};
````

以上是比较基础的查询，但是我们开发的时候遇到的往往没有那么简单，如果我想对字表进行排序或者筛选再或者我只想要子表里的其中一些字段该怎么办呢

### 关联表准确查询

````javascript
GroupSchema.statics.loadGroup = function(callBack){
    var populateQuery = {path:'users',select:'name',match:{
        'name':'Msiter'
    },options:{
        limit:20
    },sort:{'_id':1}};

    Group.findOne({name:"Test"}).select('name users').populate(populateQuery).exec(callBack);
};
````

其中 Path字段是指要查询的 哪一个 关联表，select 则是需要字表的那些字段 ，如果需要多个 中间一个 空格分隔即可，`_id`字段是默认被需要的。match就是对关联表的这些筛选的，options就可以使用分页参数  Skip和limit了 当然也有一些常见的查询参数譬如Sort等；

### 关联表的增加呢？
````javascript
///这里的Userid时mongoose.Schema.ObjectId，即你要关联的对象的Id
GroupSchema.statics.createGroup = function(groupname,userId,callBack){
    var group = new Group({name:groupname});
    group.users.push(userId);
    group.save(callBack);
};
````

### 关联表的删除
````javascript
///这里的Userid时mongoose.Schema.ObjectId，即你要关联的对象的Id
GroupSchema.statics.createGroup = function(groupname,userId,callBack){
    var group = new Group({name:groupname});
    group.users.pull(userId);
    group.save(callBack);
};
````
