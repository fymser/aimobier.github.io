---
categories: IOS
title: Xcode 关键字不高亮显示
tags:
  - IOS
  - 稀奇古怪的问题
date: 2018-01-09 14:23:00
---

Xcode 在长时间运行之后，会出现一个问题，那就是 例如 `return` 不再高亮显示了。   
重启Xcode 重启机器 也不能解决和个问题。     
后来找了一些资料 解决了这个问题

<!--more-->

1. 由于 DerivedData 问题
  1. 关闭项目
  2. 进入 DerivedData目录
    1. Xcode 设置进入
      1. `Command+,` 打开 Xcode 设置
      2. 选择 Localtions 点击 Derived Data 的的箭头进入 DerivedData 目录
    2. 直接进入
      进入 `/Users/jingwenzheng/Library/Developer/Xcode/DerivedData` 目录
  3. 删除这里面所有的文件
  4. 重启Xcode
2. 由于 pch 文件的问题
  1. 把.pch里的内容全部注释掉
  2. clean掉项目里的内容
  3. 把.pch里的注释去掉，编译。
  4. 代码高亮，语法提示功能都回来了。
3. 由于 Organizer 的问题
  1. 关闭项目
  2. 选择Window->Organizer->Projects
  3. 选择失效的那一个工程，右健，Remove from Organizer
  4. 打开工程，失效的功能都回来了

参考资料：

* [xcode 代码不高亮 不提示语法错误 解决方法](http://blog.csdn.net/liyun123gx/article/details/51544402)
