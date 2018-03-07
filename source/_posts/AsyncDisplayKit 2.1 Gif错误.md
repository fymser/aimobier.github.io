---
categories: IOS
title: AsyncDisplayKit 2.1 Gif错误，以及解决方法
tags:
  - Objective-C
  - AsyncDisplayKit
  - ios
  - 约束教程
date: 2017-08-22 14:45:00
---

在使用 AsyncDisplayKit 遇到了一些问题，因为工作需要必须支持IOS7，所以选择了 AsyncDisplayKit 2.1版本。但是在使用 其中的 展示gif的时候出现了一些问题。
<!-- more -->

目前的 修改库 版本为

![version](https://img.shields.io/cocoapods/v/AsyncDisplayKitFix.svg)

在使用的时候出现了 GIF 有的时候出现，有的是不出现，有的时候出现了，却不动的情况。

最终找到解决方案在。  [AsyncDisplayKit Pull Request 3057](https://github.com/facebookarchive/AsyncDisplayKit/pull/3057)

代码在于 [AsyncDisplayKit commit d270577f23dca63c69bc6cd0e4cea6652733a376](https://github.com/facebookarchive/AsyncDisplayKit/commit/d270577f23dca63c69bc6cd0e4cea6652733a376)

但是现在 AsyncDisokayKit 已经开始支持 IOS8版本以上了。并且已经移动到了 [Texture](https://github.com/texturegroup/texture/)

所以我们只能手动自己创建了一个版本了。

1. 解决方案 自己本地 local 库 修改 2.1 版本的代码
2. 使用我已经修改好的代码库 引入 `pod AsyncDisplayKitFix`


------------------------------------------ 2017年9月4号

再次修复了，两个问题，当然只是我的项目中的。记录一下

第一个. 关于 ASTableNode 刷新某一个section或者某一个行的时候，会启动一个验证方法，但是这个方法是验证所有的section，我分别控制第一个或者第二个secrion就会出现刷新前和刷新后的数量对不上，而导致报错。

在文件 `_ASHierarchyChangeSet.mm`  `_validateUpdate` 修改验证

第二个. 在ASTextNode赋值的时候，我记得没错误的话。官方的例子是 可以判断 ASTextNode的attritedString 是否为空，来做一些布局的变化。但是在实际使用中，发现了它的方法，写的确实
````objectivec
- (void)setAttributedText:(NSAttributedString *)attributedText
{

  if (attributedText == nil) {
      attributedText = [[NSAttributedString alloc] initWithString:@"" attributes:nil];
  }

  // Don't hold textLock for too long.
  {
    ASDN::MutexLocker l(__instanceLock__);
    if (ASObjectIsEqual(attributedText, _attributedText)) {
      return;
    }
````

这种问题就是会一直都不能为nil。故而修复为
````objectivec
- (void)setAttributedText:(NSAttributedString *)attributedText
{

  if (attributedText == nil) {
      return;
  }

  // Don't hold textLock for too long.
  {
    ASDN::MutexLocker l(__instanceLock__);
    if (ASObjectIsEqual(attributedText, _attributedText)) {
      return;
    }
````
