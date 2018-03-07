---
categories: IOS
title: travis-ci 来维护 Cocoapods
tags:
  - travis-ci
  - ios
  - cocoapods
date: 2017-05-25 18:54:00
---

![](/publicFiles/images/stock-photo/stock-photo-213307611.jpg "人的一切痛苦，本质上都是对自己的无能的愤怒。——王小波")

## 教程开始前的废话连篇
我们公司的app，是在是火不聊了。那么办法了，我们抽象出来一个sdk给别人接吧。这样子的话，我们怎么也可以有些量啊。

最开始使用的Cocoapods 全部代码开发的方式来制作的，在跨过一个又一个的大坑之后，终于到了，要把代码达成 `.a` 包地步，其实是可以达成 `.framework` 的。主要是还是因为代码需要兼容 ios 7 。
所以必须要使用 达成 static 的方式。

### 打包
首先使用的打包命令，肯定是 `xcodebuild` 不要问我，如何使用，google吧。

我们使用的命令时
````shell
xcodebuild build -project Pods/Pods.xcodeproj -target OddityOcUI
````

这样子打下来是默认 Iphone sdk版本+realese 版本的，这样子只在真机上运行肯定是没问题啦～

但是你怎么都得做到可以在模拟器上跑吧。所以就需要接下来的这一句了。

````shell
xcodebuild build -project Pods/Pods.xcodeproj -target OddityOcUI -sdk iphonesimulator10.3
````

后面的是 sdk 版本，不知道版本的可以运行命令
````shell
xcodebuild -showsdks
````

### 现在开始整合 travis-ci
既然都找到这里了，我就不跟你bb那么多了。其实我们最多不会写 yml文件嘛。

因为 budild 会遇见非常多的log，我为了解决，尝试使用了。`xcpretty` 事实证明……   没啥用处。先放着吧。

````yaml
language: objective-c
osx_image: xcode8.3

os:
  - osx
branches:
  only:
  - master
before_install:
  - gem install xcpretty
install:
  - pod install --repo-update
before_script:
  - git config --global user.name ""
  - git config --global user.email ""
  - git clone ${CocoaPodsRepo}

script:
  - set -o pipefail && xcodebuild build -project Pods/Pods.xcodeproj -target OddityOcUI | xcpretty -c
  - set -o pipefail && xcodebuild build -project Pods/Pods.xcodeproj -target OddityOcUI -sdk iphonesimulator10.3 | xcpretty -c
  - lipo -create build/Release-iphoneos/OddityOcUI/libOddityOcUI.a build/Release-iphonesimulator/OddityOcUI/libOddityOcUI.a  -output libOddityOcUI.a

after_success:
    - bash operation.sh
    - cd OddityUI
    - git add .
    - git commit -m '更新通用静态包'
    - git push --force --quiet "https://${PersonalAccessTokens}@${GtiHubUrlRepo}" master:master
    - git tag ${GtiHubTagVersion}
    - git push --force --quiet "https://${PersonalAccessTokens}@${GtiHubUrlRepo}" ${GtiHubTagVersion}:${GtiHubTagVersion}
env:
 global:
    - GtiHubTagVersion: 0.3.2
    - GtiHubUrlRepo: github.com/OddityUI/OddityUI.git
    - CocoaPodsRepo : https://github.com/OddityUI/OddityUI

````
