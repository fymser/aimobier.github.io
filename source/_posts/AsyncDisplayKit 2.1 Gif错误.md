---
categories: 教你写东西
title: AsyncDisplayKit 2.1 Gif错误，以及解决方法
date: 2017-08-22 14:45:00
tags: [Objective-C, AsyncDisplayKit,ios,约束教程]
---

在使用 AsyncDisplayKit 遇到了一些问题，因为工作需要必须支持IOS7，所以选择了 AsyncDisplayKit 2.1版本。但是在使用 其中的 展示gif的时候出现了一些问题。
<!-- more -->
在使用的时候出现了 GIF 有的时候出现，有的是不出现，有的时候出现了，却不动的情况。

最终找到解决方案在。  [AsyncDisplayKit Pull Request 3057](https://github.com/facebookarchive/AsyncDisplayKit/pull/3057)

代码在于 [AsyncDisplayKit commit d270577f23dca63c69bc6cd0e4cea6652733a376](https://github.com/facebookarchive/AsyncDisplayKit/commit/d270577f23dca63c69bc6cd0e4cea6652733a376)

但是现在 AsyncDisokayKit 已经开始支持 IOS8版本以上了。并且已经移动到了 [Texture](https://github.com/texturegroup/texture/)

所以我们只能手动自己创建了一个版本了。

1. 解决方案 自己本地 local 库 修改 2.1 版本的代码
2. 使用我已经修改好的代码库 引入 `pod AsyncDisplayKit-fix`
