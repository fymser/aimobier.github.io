---
categories: IOS
title: 创建自己的Cocoapods 源
tags:
  - cocoapods
  - IOS
date: 2018-05-18 11:14:00
---

这个问题和Maven的自己的本地源一样，就是想向 Cocoapods Spac 一样的工作。那么接下来我们就来结合一个我现实中遇到的实例来实现这个问题

最近公司需要引入百度的人脸识别，以及身份证等文字识别两个sdk，但是百度这种大公司，根本不会让你很舒服的引入，只能手动引入，但是我不是很喜欢，所以我就使用本地 Cocoapods 来完成这个事情。

在使用的时候，遇到了一些问题，特此记录一下

<!-- more -->

## 本地设置文字识别Frameworks

最开始，我第一个制作的是 文字识别

我们只需要创建一个 PodSpec文件
````ruby
Pod::Spec.new do |spec|
  spec.name         = 'AipOcr'
  spec.version      = '0.0.1'
  spec.license      = { :type => 'MIT' }
  spec.homepage     = 'https://ai.baidu.com/sdk#ocr'
  spec.authors      = { 'baidu .Inc' => 'https://baidu.com' }
  spec.summary      = 'Baidu ocr [idcard,bankcard...].'
  spec.source       = { :git => 'git@github.com:aimobier/AipOcr.git', :tag => '0.0.1' }
  spec.vendored_frameworks = 'AipBase.framework','AipOcrSdk.framework', 'IdcardQuality.framework'
end
````
将该文件，放置在本地的文件夹中,一般放置在根目录。
比如在根目录下，创建一个 AipOcr 文件夹

将需要的
````
spec.vendored_frameworks = 'AipBase.framework','AipOcrSdk.framework', 'IdcardQuality.framework'
````
三个文件，放置在 AipOcr 下，在 [pod](https://guides.cocoapods.org/syntax/podfile.html#pod) 文件中使用

````ruby
pod 'AipOcr', :path => 'AipOcr'
````

即可。

## 人脸识别 SDK 引入

但是在这里，我出现了问题，最主要的问题就是。人脸识别包含两个库，一个简单来说就是 FaceSDK，一个是 FaceUISdk

其中 FaeUISDK需要 FaceSDK。

````ruby
spec.vendored_frameworks = ''
````
最开始使用这个方式，来进行导入依赖。但是，编译中发现， 系统认为 FaceUISDK 是 FaceSDK的，所以不对外公开

我们只能使用

````ruby
    spec.dependency 'FaceSDK'
````

 但是这里出现的问题就是，我并不想提交 FaceSDK到实际的 Spce仓库中，只希望自己用用。

 ## 私人源

其实私人源，特别简单，就是在pod install，你需要告诉Cocoapods，要在哪里查找这些依赖的第三方插件。

### 直接在 Podfile文件中增加源

我们在 Podfile 文件中，增加源的配置方法。

````ruby
source 'https://github.com/CocoaPods/Specs.git'
source 'https://github.com/aimobier/Specs.git'
````

###  使用命令增加源

````ruby
pod repo add master https://git.coding.net/CocoaPods/Specs.git

pod repo update
````

一劳永逸，但是没测试，不清楚

### 配置仓库内容

这时候你在你的仓库，直接放置类似于

````
.
├── AipOcr
│   └── 0.0.1
│       └── AipOcr.podspec
├── FaceSDK
│   └── 0.0.2
│       └── FaceSDK.podspec
├── LICENSE
└── README.md
````
目录就可以了。

### 使用

使用 pod update ，就可以使用了
