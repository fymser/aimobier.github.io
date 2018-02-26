---
title: reactivex 学习
tags:
  - reactiv
  - rxswift
categories: 开发帮助
permalink: reactivexxx
date: 2016-06-21 23:22:00
---

![](/publicFiles/images/stock-photo/stock-photo-179922657.jpg "庆幸你来自远方不清楚我的过往。")

### 散记

好久没有学习到新的东西了，之前一直想学习 `ReactiveCocoa`,但是看了一点之后，觉的很是繁琐，而且感觉很多api方法，再加上项目很紧迫没有时间去学习新的东西了。我就暂时搁置了，现在项目做的也差不多了，觉得这个学习进度是时候提上进程。

再开始学习的时候，发现了`RxSwift`.在之后发现了 `reactivex` 。进入了官网发现自己可能，找到了一个 类似于 `Realm`和`swagger` 的庞然大物， 绝对要好好学习，在加上自己学习的本身就是swift。自然选择了 RXswift。

好了，废话不多说了，开始学习吧，请耐心看下去。因为我也是翻译，所以如果有任何觉得不应该的地方，可以提醒我。

<!-- more -->

###  ReactiveX

在进入ReactiveX的官方网站后，就看到了它对自己的评价

> ReactiveX is a combination of the best ideas from
the Observer pattern, the Iterator pattern, and functional programming

reactivex组合是观察者模式，迭代器模式和函数式编程最好的想法。

ok ~ 好吧，算你吊。什么意思！


### Observable 观察者模式

#### 简介

在reactivex 观察者 订阅 可观察对象。然后，观察者 会对 可观察对象 以任意顺序发出的任何项目丢回作出反应。这种模式有利于并发操作，他不需要创建一个阻塞对象来等待 可观察者 发出任何指令,而是创建一个哨兵的形式的观察员，随时准备作出适当的反应针对于 可观察对象 发出的项目。

![](http://reactivex.io/assets/operators/legend.png)

See Also

* [Single](http://reactivex.io/documentation/single.html) — 一个针对于可观察对象只发出一次项目的专门版本
* [Rx Workshop: Introduction](http://channel9.msdn.com/Series/Rx-Workshop/Rx-Workshop-Introduction)
* [Introduction to Rx: IObservable](http://www.introtorx.com/Content/v1.0.10621.0/02_KeyTypes.html#IObservable)
* [Mastering observables](http://docs.couchbase.com/developer/java-2.0/observables.html) (来自 Couchbase 服务器的文档)
* [2 minute introduction to Rx](https://medium.com/@andrestaltz/2-minute-introduction-to-rx-24c8ca793877)  作者: Andre Staltz(“Think of an Observable as an asynchronous immutable array.”) (把一个可观察对象认作为一个异步不可改变的数组)
* [Introducing the Observable](https://egghead.io/lessons/javascript-introducing-the-observable) by Jafar Husain (JavaScript Video Tutorial)
* [Observable object](https://egghead.io/lessons/javascript-introducing-the-observable) (RxJS) by Dennis Stoyanov
* [Turning a callback into an Rx Observable](https://afterecho.uk/blog/turning-a-callback-into-an-rx-observable.html) by @afterecho

#### Background

在许多编程项目中，人们往往更倾向于在一个时间执行一个指令执行或者完成一个增量操作。但是在reactivex中，许多指令可以并行执行。其结果会在后来以任意顺序被观察者抓获。而不是定义一个方法完成数据的转换等操作方法，然后以一个 被观察者的身份去订阅了一个观察者。

这种方法的一个优点是，当你有一堆不依赖于彼此的任务时，你可以同时启动它们，而不是等待每一个完成之前开始下一个-这样，你的总执行时间就是你一堆任务执行时间最长的那一个，就像是木板组成水桶，装的水多少在于最短的那块木板一样的道里。

有许多术语用来描述这种异步编程和设计模型。本文档将使用以下术语：一个观察者订阅观察。一个可观察的发射项目或通过调用观察员的方法发送通知给它的观察员。

在其他情况下，有时也称观察员为“用户”“观看的人”或“堆”。这种模式一般是通常被称为“反应模式”

#### 建立观察员

在一个普通的方法调用是异步的，没有排序，并行调用典型的reactivex -流程是这样的：
1. 调用方法。
2. 将该方法的返回值存储在一个变量中
3. 使用这个变量和它的新值来做一些有用的事情。

或者，像这样的：

````
// 打电话，把它的返回值 赋值给` returnval `
returnval =方法（参数）；
// returnval 去做点有用的事儿
````

在异步模型中，流程会像这样：
1. 定义一个方法，做一些有用的从异步调用返回值；该方法是观察者的一部分。也就是 A 调用方法做出一些调整后 反悔 A
2. 定义异步调用方法本身作为一个可观察的对象
3. 附加的观测器，通过订阅它观察（这也导致可观察到的开始行动）
4. 继续你的业务；每当调用返回时，观察者的方法将开始操作它的返回值或值-所观察到的项目。

看起来像这样：

````
// 定义，但不调用，用户 onNext  处理
// 在这个例子中，观察者是非常简单的，只有一个`onNext`处理
def myOnNext = { it -> do something useful with it };
// 定义，但不调用，可观察到的
def myObservable = someObservable(itsParameters);
// 订阅用户可见，并调用观察
myObservable.subscribe(myOnNext);
// 继续我的业务
````

##### onNext, onCompleted, and onError

您的观察者实现以下方法的一些订阅方法子集可以将一个观察者连接到一个可观察到的：
###### onNext
无论任何时候，一个可观察对象调用这个方法发出一个项目，这个方法会把 被观察者发出的这个项目作为一个参数继续传递下去
###### onError
一个被观察者遇到非预期的数据和一些错误，就会调用这个方法，接下来它不会调用 `onCompleted` 或者 `onNext` 方法，这个方法将错误的指示作为参数
###### onCompleted
没有发生错误的情况下，完成操作后，调用的方法。

通过对观察到的条款，它可以调用`OnNext`零次或更多次，然后可以根据调用结果调用 最后一次 onCompleted或OnError。按照惯例，在这个文件中，调用`OnNext`通常被称为“排放”的项目，而叫`onCompleted`或`onError`被称为“通知”。

参见：
* [Introduction to Rx: IObserver](http://www.introtorx.com/Content/v1.0.10621.0/02_KeyTypes.html#IObserver)

##### 注销 Unsubscribing

在一些reactivex实现，有一个专门的观察者接口，签约者，实现一个`Unsubscribing`的方法。你可以调用这个方法来表明，用户不再对目前任何订阅感兴趣。这些观测可以（如果他们没有其他感兴趣的观察员）选择停止产生新的物品发出。

这一结果将级联退订通过运营商，适用于观察，观察者订阅的链，这将导致在产业链的各个环节停止发射项目。这不保证立即发生，但是，它是可能的一个观察到的产生和尝试发射一段时间，即使没有观察者仍然观察这些排放量。

##### 关于命名约定的一些注释

reactivex每个语言的具体实现有自己的命名习惯。有没有规范的命名标准，虽然有许多共性之间的实现

此外，这些名称中的一些在其他上下文中有不同的含义，或在一个特定的实现语言的成语中显得有些尴尬。

例如有事件的命名模式（例如OnNext，OnCompleted，OnError）。在某些情况下，这样的名称将表示方法，通过该事件处理程序的注册。然而，他们的名字reactivex，事件处理器。

#### “热”和“冷”的 被观测者

什么时候被观察者会发出信息？这取决于被观察者。“热”的观察可能当他刚被创建没多久就发出信息，所以后来订阅的观察者观察到的信息就是中间的某些地方。“冷”的观察，直到一个订阅者观察他的变化，他才开始发生信息。所以观察者就看到他的整个信息过程

在reactivex一些实施方案中，也有一些称为“连接”的观察。除非一个观察者订阅了这个连接对象并且调用它的 ` Connect` 方法，否则被观察者不会发出信息

#### 通过可观察算子的合成

观察者和被观察者仅仅只是 `ReactiveX`的开始。由他们自己，他们只不过是一个轻微的扩展的标准观察者模式，更适合处理一系列的事件，而不是一个单一的回调。

真正的力量来自于`reactive extensions`（即`reactivex`）-运营商可以变换，结合，操纵，并与发射的观测值序列的工作项目。

这些接收运营商允许你一起构成异步序列在声明的方式与所有的回调函数的效率效益但没有嵌套的回调处理程序通常与异步系统相关的问题。

This documentation groups information about the various operators and examples of their usage into the following pages:

[Creating Observables](http://reactivex.io/documentation/operators.html#creating)
`Create`, `Defer`, `Empty/Never/Throw`, `From`, `Interval`, `Just`, `Range`, `Repeat`, `Start`, and `Timer`
[Transforming Observable Items](http://reactivex.io/documentation/operators.html#transforming)
`Buffer`, `FlatMap`, `GroupBy`, `Map`, `Scan`, and `Window`
[Filtering Observables](http://reactivex.io/documentation/operators.html#filtering)
`Debounce`, `Distinct`, `ElementAt`, `Filter`, `First`, `IgnoreElements`, `Last`, `Sample`, `Skip`, `SkipLast`, `Take`, and `TakeLast`
[Combining Observables](http://reactivex.io/documentation/operators.html#combining)
`And/Then/When`, `CombineLatest`, `Join`, `Merge`, `StartWith`, `Switch`, and `Zip`
[Error Handling Operators](http://reactivex.io/documentation/operators.html#error)
`Catch` and `Retry`
[Utility Operators](http://reactivex.io/documentation/operators.html#utility)
`Delay`, `Do`, `Materialize/Dematerialize`, `ObserveOn`, `Serialize`, `Subscribe`, `SubscribeOn`, `TimeInterval`, `Timeout`, `Timestamp`, and `Using`
[Conditional and Boolean Operators](http://reactivex.io/documentation/operators.html#conditional)
`All`, `Amb`, `Contains`, `DefaultIfEmpty`, `SequenceEqual`, `SkipUntil`, `SkipWhile`, `TakeUntil`, and `TakeWhile`
[Mathematical and Aggregate Operators](http://reactivex.io/documentation/operators.html#mathematical)
`Average`, `Concat`, `Count`, `Max`, `Min`, `Reduce`, and `Sum`
[Converting Observables](http://reactivex.io/documentation/operators.html#conversion)
`To`
[Connectable Observable Operators](http://reactivex.io/documentation/operators.html#connectable)
`Connect`, `Publish`, `RefCount`, and `Replay`
[Backpressure Operators](http://reactivex.io/documentation/operators/backpressure.html)
执行特定的流量控制策略的各种运营商

##### 连锁运营商

大多数操作符在可观察到的和返回一个可观察到的。这允许你应用这些操作符一个接一个，在一个链中。链中的每个操作符都修改了可观察到的结果，从以前的操作的操作。
还有其他模式，如生成器模式，其中一个特定类的各种方法通过修改该对象的操作来修改该类的一个类上的一个项目。这些模式也允许你以类似的方式链的方法。但在生成器模式中，在链中出现的方法的顺序通常不重要，与可观察到的运营商的订单事宜。
观察到的操作符的链不独立于原始观察到的起源链，但他们反过来操作，每一个操作上的观察所产生的运营商立即在外链。
