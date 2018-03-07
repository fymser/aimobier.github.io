---
categories: IOS
title: RxSwift 学习 未完待续
tags:
  - swift
  - ios
  - RX
date: 2016-07-06 21:16:43
---

## 简介

### 为什么使用 RxSwift

其实这个问题就是在问，RxSwift它可以做什么呢？在他们编写程序的时候，总是会牵涉到需要检测某些值的变化。比如。textFiled Text变化？数据请求完成失败的变化？键盘弹起隐藏的变化，而我们需要做很多不一样的操作，去检测这些东西的变化情况，可能会是delegate，Notifinotion，KVO等等。

于是乎就有人想到了，为什么不设计一种处理机制来统一处理这些东西呢？所以 `reactivex` 这种机制出现了，而这里的 `RxSwift` 就是这么一个机制下的一个扩展。
所以RxSwift 为什么用它？你可以理解了吗？

![](/publicFiles/images/stock-photo/stock-photo-184019953.jpg "学校里还是相对单纯的地方，找不到女朋友，基本还是因为你丑。")


<!-- more -->

### RxSwift 概念

每一个`Observable` 的实例相当于一个Swift中的Sequence。

但是区别在于，Swift中的SequenceType是同步的循环，而 `Observable` 是异步的。

* 一个 `Observable (ObservableType)`  相当于一个序列`Sequence(SequenceType)` .
* `ObservableType.subscribe(_:)` 方法其实就相当于  `SequenceType.generate()`
* `Observable` 对象会在有任何 `Event` 时候，将把 observer (ObserverType) 作为一个参数通过 `ObservableType.subscribe(_:)` 自动发出。并不需要 observer (ObserverType) 调用 `Next()`方法

如果一个  `Observable` 发送了一个 `(Event.Next(Element))` 下一步指令的时候，它将会继续发送后续更多的 `Event` ，然而如果它发出的是一个  `(Event.Error(ErrorType))` 错误动作，或者是一个 `(Event.Completed)` 正常结束完成动作的话。它将通知不在发出任何动作。

序列的语法可以很明显的表达这一点:

````swift
Next* (Error | Completed)?
````

图表可以直观的解释这一切

```` js
--1--2--3--4--5--6--|----> // "|" = 正常终止

--a--b--c--d--e--f--X----> // "X" = 错误终止

--tap--tap----------tap--> // "|" = 继续进行, 如同一个按钮点击事件的一个序列

````
> 这些图表被称为marble diagrams。你可以学习更多关于他们在 [rxmarbles.com](http://rxmarbles.com/)。

### Observables 和 observers (又名 subscribers)

`Observables` 观测数据将不会执行除非有用户用户订阅了它。在下面的示例中，观察到的关闭将永远不会被执行，因为没有订阅`observers`：

````swift
example("Observable with no subscribers") {
    _ = Observable<String>.create { observerOfString -> Disposable in
        print("This will never be printed")
        observerOfString.on(.Next("😬"))
        observerOfString.on(.Completed)
        return NopDisposable.instance
    }
}
````
在下面的示例中, 在结束之前会调用 `subscribe(_:)`:

```` swift
example("Observable with subscriber") {
    _ = Observable<String>.create { observerOfString in
            print("Observable created")
            observerOfString.on(.Next("😉"))
            observerOfString.on(.Completed)
            return NopDisposable.instance
        }
        .subscribe { event in
            print(event)
    }
}
````

> 不用担心这些创建 Observable 的细节，马上就要学习了

> 在以上的栗子中，我们返回的都是一个 NopDisposable.instance ，而在实际的情况中是需要 返回一个 DisposeBag 的实例的，来妥善的处理这些代码。 至于为什么？嗯。 ……   practice makes permanent 🙂 熟能生巧？ 你可以查看更多介绍 [Disposing](https://github.com/ReactiveX/RxSwift/blob/master/Documentation/GettingStarted.md#disposing) ， [Getting Started guide](https://github.com/ReactiveX/RxSwift/blob/master/Documentation/GettingStarted.md).

### 创建和订阅一个 Observables

有以下这几种方法来创建和订阅一个 `Observables`

#### never

创建一个 `Observables` ，不发出任何项目，不终止 就是任性！！！！

![never](http://upload-images.jianshu.io/upload_images/755009-32bc4bdfb7ba6a73.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

````swift
example("never") {
    let disposeBag = DisposeBag()
    let neverSequence = Observable<String>.never()

    let neverSequenceSubscription = neverSequence
        .subscribe { _ in
            print("This will never be printed")
    }

    neverSequenceSubscription.addDisposableTo(disposeBag)
}
````

#### empty

创建一个只发送完成动作的 `Observables` 对象。 老子不问过程，只看结果！！！

![empty](http://upload-images.jianshu.io/upload_images/755009-42da08b0fd5b9cea.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

````swift
example("empty") {
    let disposeBag = DisposeBag()

    Observable<Int>.empty()
        .subscribe { event in
            print(event)
        }
        .addDisposableTo(disposeBag)
}
````
> 这个实例还介绍了创建和订阅一个 Observables 对象，其实就是执行了 subscribe 这个方法。


#### just

创建一个发送制定动作的的 `Observables` 对象。

![just](http://upload-images.jianshu.io/upload_images/755009-dc8ba7d0f279a460.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

````swift
example("just") {
    let disposeBag = DisposeBag()

    Observable.just("🔴")
        .subscribe { event in
            print(event)
        }
        .addDisposableTo(disposeBag)
}
````
> 这个实例还介绍了创建和订阅一个 Observables 对象，其实就是执行了 `subscribe` 这个方法。

#### of

创建一个具有固定数量的 `Observables` 对象

![just](http://upload-images.jianshu.io/upload_images/755009-dc8ba7d0f279a460.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

````swift
example("of") {
    let disposeBag = DisposeBag()

    Observable.of("🐶", "🐱", "🐭", "🐹")
        .subscribeNext { element in
            print(element)
        }
        .addDisposableTo(disposeBag)
}
````
> 这个例子还介绍了 subscribeNext(_:) 这种简单的方法
不像 subscribe(_:),它是定语了所有的动作 包括 （Next, Error, and Completed）
subscribeNext 将会忽略所有的 (Error and Completed )动作，只会生产出一个 Next 动作、
我们这里同样也有 完成 和 失败 对应的简单方法。 subscribeError(_:) and subscribeCompleted(_:)，当你只想检测是对应的动作的时候
如果你想订阅所有的动作的你可以使用   subscribe(onNext:onError:onCompleted:onDisposed:)` 就像下面的例子 👇
看了以下自己写的。不知道怎么说！  草  ！subscribe 就是拦截所有的操作！  比如 next error 和 complted。
而这些检测都有单独的简便方法 subscribeNext  subscribeError subscribeCompleted

>Example
````
someObservable.subscribe(
    onNext: { print("Element:", $0) },
    onError: { print("Error:", $0) },
    onCompleted: { print("Completed") },
    onDisposed: { print("Disposed") }
)
````

#### toObservable
将一个 sequence(SequenceType),转换成为一个 `Observable` ,可以是任何实现了(SequenceType)协议的对象，比如Array, Dictionary, or Set

````swift
example("toObservable") {
    let disposeBag = DisposeBag()

    ["🐶", "🐱", "🐭", "🐹"].toObservable()
        .subscribeNext { print($0) }
        .addDisposableTo(disposeBag)
}
````

> 该例子使用了 $0 这一种参数，而不是显式命名的参数

#### create

创建一个 `Observable` 序列
![create](http://upload-images.jianshu.io/upload_images/755009-62884a006c12cc68.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

````swift
example("create") {
    let disposeBag = DisposeBag()

    let myJust = { (element: String) -> Observable<String> in
        return Observable.create { observer in
            observer.on(.Next(element))
            observer.on(.Completed)
            return NopDisposable.instance
        }
    }

    myJust("🔴")
        .subscribe { print($0) }
        .addDisposableTo(disposeBag)
}
````

#### range

创建一个 可以发射一系列的连续整数，然后终止 的 `Observable`对象

![range](http://upload-images.jianshu.io/upload_images/755009-5fa8215035a92cb7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

````swift
example("range") {
    let disposeBag = DisposeBag()

    Observable.range(start: 1, count: 10)
        .subscribe { print($0) }
        .addDisposableTo(disposeBag)
}
````

#### repeatElement

创建一个无限地发射给定的元素 `Observable`。  豌豆君？？

![repeatElement](http://upload-images.jianshu.io/upload_images/755009-00b2005946443344.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

````swift
example("repeatElement") {
    let disposeBag = DisposeBag()

    Observable.repeatElement("🔴")
        .take(3)
        .subscribeNext { print($0) }
        .addDisposableTo(disposeBag)
}
````

> 该栗子中使用 take 方法来限制发射给定元素的次数

#### generate

创建一个只有当提供的所有的判断条件都为 true 的时候，才会给出动作的  `Observable` !  老子 刚正不阿

````swift
example("generate") {
    let disposeBag = DisposeBag()

    Observable.generate(
            initialState: 0,
            condition: { $0 < 3 },
            iterate: { $0 + 1 }
        )
        .subscribeNext { print($0) }
        .addDisposableTo(disposeBag)
}
````

#### deferred

创建一个全新的  `Observable` ，你TM才是搬运工，老子是大自然的创造者！

![](http://upload-images.jianshu.io/upload_images/755009-e83303a845a37808.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

````swift
example("deferred") {
    let disposeBag = DisposeBag()
    var count = 1

    let deferredSequence = Observable<String>.deferred {
        print("Creating \(count)")
        count += 1

        return Observable.create { observer in
            print("Emitting...")
            observer.onNext("🐶")
            observer.onNext("🐱")
            observer.onNext("🐵")
            return NopDisposable.instance
        }
    }

    deferredSequence
        .subscribeNext { print($0) }
        .addDisposableTo(disposeBag)

    deferredSequence
        .subscribeNext { print($0) }
        .addDisposableTo(disposeBag)
}

````


#### error

创建一个不做任何操作，直接丢一个错误给你的 `Observable`. 对方不想和你 BB，并丢给你一个错误 😐

````swift
example("error") {
    let disposeBag = DisposeBag()

    Observable<Int>.error(Error.Test)
        .subscribe { print($0) }
        .addDisposableTo(disposeBag)
}
````

#### doOn
为每一个发出的事件和返回的执行制定操作。 收费站？

![](http://upload-images.jianshu.io/upload_images/755009-61b525586595f814.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

````swift
example("doOn") {
    let disposeBag = DisposeBag()

    Observable.of("🍎", "🍐", "🍊", "🍋")
        .doOn { print("Intercepted:", $0) }
        .subscribeNext { print($0) }
        .addDisposableTo(disposeBag)
}
````

> 这里也有。 doOnNext(_:), doOnError(_:), and doOnCompleted(_:) 简便方法。 也有 doOn(onNext(_:)onError(_:)onCompleted(_:)) 这样的方法

## Working with Subjects

使用 Subjects 进行工作，一个 Subject 可以理解为一个中间人，他既可以观察者观察，向观察者提供动作。也可以当作观察者去观察，来接受对象。 大概的意思。可攻可受？？？

### PublishSubject
向所有订阅者发布动作。在他们订阅之后。这个时间是有关系的哦。从下图也可以看到，第二个订阅的用户，已经错过了接受红绿的时间。所以他只接受到了，蓝色和错误动作

![PublishSubject](http://upload-images.jianshu.io/upload_images/755009-52e8b61b5b1553ca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

````swift
let disposeBag = DisposeBag()
let subject = PublishSubject<String>()
subject.subscribe{print("第一次订阅",$0)}.addDisposableTo(disposeBag)
subject.onNext("🐶")
subject.onNext("🐱")
subject.subscribe{print("第二次订阅",$0)}.addDisposableTo(disposeBag)
subject.onNext("🅰️")
subject.onNext("🅱️")
````

在这份代码中第一个订阅可以展示4个？而第二次，就只能接收到 小猫和小狗。

> 在这份例子中，使用的是  onNext(_:) 简便的方法，当然也有 错误 和 完成的简便方法 onError(_:) , onCompleted() . 你也可以直接食用 on(.Error(_:)) on(.Completed(_:)) on(.Next(_:))  这和之前的如出一辙 (_:)

### ReplaySubject
咱们之前创建的 PublishSubject ，如果在订阅之前的时间是不会接收到的，而这个呢 可以指定，缓存的个数，比如 2 ，那么咱们就可以接受订阅时间之前两次的 动作事件。

![ReplaySubject](http://upload-images.jianshu.io/upload_images/755009-e5b881a5fd17a49d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

````swift
let disposeBag = DisposeBag()
let subject = ReplaySubject<String>.create(bufferSize: 1)
subject.subscribe{print("第一次订阅",$0)}.addDisposableTo(disposeBag)
subject.onNext("🐶")
subject.onNext("🐱")
subject.subscribe{print("第二次订阅",$0)}.addDisposableTo(disposeBag)
subject.onNext("🅰️")
subject.onNext("🅱️")
````

在这份代码中，第二次的额订阅的时候 就会 是 小猫 A 和 B了～

### BehaviorSubject
向所有的订阅者广播新的事件，并且传递 当前 的最新值，初始值。

![BehaviorSubject](http://upload-images.jianshu.io/upload_images/755009-ee65a318eaf1ab57.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

怎么感觉就是  ReplaySubject 之后 buffSize 是 1 的变形呢。。。。除了多了一个初始值。。。

````swift
let disposeBag = DisposeBag()
let subject =  BehaviorSubject(value: "🔴")
subject.subscribe{print("第一次订阅",$0) }.addDisposableTo(disposeBag)
subject.onNext("🐶")
subject.onNext("🐱")
subject.subscribe{ print("第二次订阅",$0)}.addDisposableTo(disposeBag)
subject.onNext("🅰️")
subject.onNext("🅱️")
````

在第二次订阅出现的时候会多出现一次。最新值。而第一次订阅则会出现一个 初始值。

> 看了这三个例子有没有好像遗漏了什么 ，一个 Completed 事件。 PublishSubject, ReplaySubject, 和 BehaviorSubject 不会在自动发出 完成事件的。

### Variable

BehaviorSubject 变种。。。  就是说呢，BehaviorSubject 不是不会自动发送 Completed 事件吗？  Variable 会。没了。

````swift
let variable = Variable("🔴")
subject.subscribe{print("第一次订阅",$0) }.addDisposableTo(disposeBag)
variable.value = "🐶"
variable.value = "🐱"
subject.subscribe{ print("第一次订阅",$0)}.addDisposableTo(disposeBag)
variable.value = "🅰️"
variable.value = "🅱️"
````

> Variable 对象 调用  asObservable() 方法可以获取他变种前的  BehaviorSubject 对象。 Variable 对象 不能实现 onNext 方法，但是你可以调用他的 value 参数，来 get 和set 它的值。
