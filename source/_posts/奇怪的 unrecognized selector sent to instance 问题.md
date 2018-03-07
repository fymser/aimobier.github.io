---
categories: IOS
title: 奇怪的 unrecognized selector sent to instance 问题
tags:
  - ios
  - error
  - 奇怪的问题
date: 2017-05-18 15:39:00
---

![](/publicFiles/images/stock-photo/stock-photo-212311441.jpg " "Nuts！" —— 101空降师副师长麦考里夫将军")

<!-- more -->

我做了一个 黑夜模式 和 白天模式的切换。     
在ios8.3 的设备上发现了一个问题，会导致崩溃。控制台打出各种奇怪的问题……

````
unrecognized selector sent to instance
````

各种对象的

包括 `NSURL`,`UIView`,`_FCString`... 等等，我当时就蒙了，，我到底写出了什么样子的代码……    

他最终报错的地方我发送 `NSnotifition`的地方，也不具体跳到某一个崩溃的位置。

后来想了一下 `unrecognized selector sent to instance ` 是由于已经销毁了，还调用。并且我的崩溃对象千奇百怪的。崩溃在发送通知的地方。那么问题大概就是出现在这里了吧。我尝试在每一个地方都进行了 `dealloc`移除通知的方法。果然，问题消失。其实我只移除了一个我自定义的UIView的通知，其他的UIViewControoler，没有移除也是没问题。只是为了保证百分之百……

猜测：
1. ios8.3的问题，在销毁后没有移除我的通知
2. 引起各种对象的崩溃的原因，估计是因为新的对象占据了理论上销毁的对象的 物理地址
<div class='pixels-photo'>
  <p>
    <img src='https://drscdn.500px.org/photo/212311441/m%3D900/50cfce955bc5969aeeb03ca97aaabf7c' alt='Autumn Poetry by Daniel F. on 500px.com'>
  </p>
  <a href='https://500px.com/photo/212311441/autumn-poetry-by-daniel-f-' alt='Autumn Poetry by Daniel F. on 500px.com'></a>
</div>
<script type='text/javascript' src='https://500px.com/embed.js'></script>
