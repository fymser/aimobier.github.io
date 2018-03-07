---
categories: IOS
title: Xcode8 无响应 点击Stop 卡死问题
tags:
  - IOS
  - 稀奇古怪的问题
date: 2018-01-09 14:18:00
---

最近在学习 Pthreads,写了一些代码，每次运行结束后，都会出现无法Stop，每次都需要强制关闭 Xcode的问题。    
一开始没觉得什么，就是强制关闭，后来烦了，，，好吧 ，最后终于找到了一些资料解决了这个问题。

在这里记录一下。

<!--more-->

1. 进入 `/User/{username}/Library/Autosave Information` 这个文件夹下
2. 删除里面 开头 Unsaved Xcode 的文件.
3. 重启 就搞定了

不知道是不是最近使用 跳一跳外拐的问题，，我发现我的这个文件夹下面有两个 跳一跳的分析距离的图片？不知道是不是这个原因，导致的，毕竟以前没怎么遇到的。


参考资料：

* [Xcode8无响应/假死状态/点击stop无反应？](http://blog.csdn.net/NB_Token/article/details/52884323)
