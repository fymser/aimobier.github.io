---
title: Pthreads 学习1
date: 2018-1-10 23:22:00
tags: [IOS,Pthreads,线程]
categories: 线程
---

为了学习IOS中的多线程，开始研究线程。但是感觉一开始就学习IOS的线程的话，很难理解，所以学习了Pthreads。

# POSIX Threads Programming

> Author: Blaise Barney,Lawrence Livemore National Laboratory

## Abstract

在共享内存多处理机架构中，线程可以用来实现并行。从历史来说，硬件供应商实现了他们各自的线程版本，使移植成为了软件开发人员关系的问题。在UNXI系统中，一个标准化C语言的线程API已经有了 IEEE POSIX 1003.1c ,坚持这个标准实现成为POSIX线程，或者 Pthreads.      
本教程首先介绍 Pthread的概念，动机和设计注意事项。然后介绍 Pthreads API中三个主要类的历程：线程管理，互斥变量和条件变量。示例代码是为了让新的使用Pthreads的程序员知道如何使用Pythreads。本教程最后讨论了 LLNL 细节以及如何将MPI与Pthreads混合     
学习这篇教程的先决条件：本教程非常适合那些刚接触Pthread的并行编程人员。在C中的并行编程基本理解是必需的。对于那些不太熟悉并行变成的人来说，[EC3500：并行计算入门](https://computing.llnl.gov/tutorials/parallel_comp)所设计的[内容](https://computing.llnl.gov/tutorials/parallel_comp)将很有帮助。

<!-- more -->

## Threads API

* 原来的Pthreads API是在 ANSI/IEEE POSIX 1003.1 - 1995 标准中定义。 POSIX标准不断发展并经过修订，包括Pthreads规范。    
* 标准的副本可以从IEEE购买或从其他网站免费下载。
* 构成Pthreads API的子例程可以分为四个主要组：
  1. **线程管理 Thread management：** 直接在线程上工作的例程-创建，分离，链接等。他们还包括设置/查询线程属性的功能（可连接，调度等）
  2. **互斥 Mutexes：** 处理同步的例程成为“互斥”，他是“mutex”的缩写。互斥功能提供创建，销毁，锁定和解锁互斥。这些由互斥属性函数来补充，这些函数设置或修改与互斥量相关的属性。
  3. **条件变量 Condition variables：** 解决共享互斥量的线程间通信的例程。基于程序员指定的条件。改组包括基于执行的变量值创建，销毁，等待和信号等功能。还包括查询/查询条件变量属性的函数
  4. **同步 Synchronization：** 管理读/写和障碍的例程
* 命名约定：线程哭的所有表示符都以 **Pthread_** 开头。一些例子如下所示。     

## Thread Management

### Creating and Terminating Threads

````cpp
/// 创建一个 pthread_t 对象
/// @param thread   要创建的thread的指针地址 例如： pthread_t thread; 传入 &thread;
/// @param attr     参数 thread_attr 包很多个参数
///                 int detachstate;   线程的分离状态
///                 int schedpolicy;  线程调度策略
///                 structsched_param schedparam;  线程的调度参数
///                 int inheritsched;  线程的继承性
///                 int scope;       线程的作用域
///                 size_t guardsize;   线程栈末尾的警戒缓冲区大小
///                 int stackaddr_set;
///                 void* stackaddr;   线程栈的位置
///                 size_t  stacksize;    线程栈的大小
/// @param start_routine 线程创建后的方法
/// @param arg 传递的参数 需要为 (void *) = id
///
/// @return int 类型 返回 0 是成功。 失败 返回错误号码。
pthread_create (thread,attr,start_routine,arg)
/// 退出一个 thread，退出线程有如下个方法
/// 1. return normal 正常返回
/// 2. thread_exit 无论工作有没有完成 都会退出
/// 3. 该线程被另一个线程 通过 pthread_cancel 取消
/// 4. 整个过程 调用 exec() 或 exit() 而终止
/// 5. 如果 main() 首先完成，而不现实调用 thread_exit 本身
pthread_exit (status)
/// 将子程序取消异步处理
/// @param thread 子例程的线程指针地址
///
/// int 类型 返回 0 是成功。 失败 返回错误号码。
pthread_cancel (thread)
/// 初始化一个 pthread_attr 对象
/// @param attr pthread_attr 对象
///
/// int 类型 返回 0 是成功。 失败 返回错误号码。
pthread_attr_init (attr)
/// 设置属性或获取属性方法
int pthread_attr_(get/set)detachstate   // 获取/设置 线程的分离状态
int pthread_attr_(get/set)guardsize     // 获取/设置 线程栈末尾的境界缓冲区大小
int pthread_attr_(get/set)inheritsched  // 获取/设置 线程的继承性
int pthread_attr_(get/set)schedparam    // 获取/设置 线程的调度参数
int pthread_attr_(get/set)schedpolicy   // 获取/设置 线程的调度策略
int pthread_attr_(get/set)scope         // 获取/设置 作用域
int pthread_attr_(get/set)stack         // 获取/设置 线程栈
int pthread_attr_(get/set)stackaddr     // 获取/设置 线程栈的位置
int pthread_attr_(get/set)stacksize     // 获取/设置 线程栈的大小
/// 销毁线程属性对象
/// @param attr 属性对象
///
/// int 类型 返回 0 是成功。 失败 返回错误号码。
pthread_attr_destroy (attr)
````
### Joining and Detaching Threads

````cpp
/// 等待线程终止
/// @param threadid 需要等待结束的线程
/// @param status 返回的结果
///
/// @return int 类型 返回 0 是成功。 失败 返回错误号码。
pthread_join (threadid,status)
/// 与 pthread_join 相对应,你想让一个 thread 开始等待阻塞，那么当你后悔 就需要该函数 取消阻塞等待结果
/// 注意 如果想使用该方法 必须在创建 线程的时候 规定 线程是可以分离的.如下：
///
///    pthread_attr_t attr;  // 创建 attr
///    pthread_attr_init(&attr); // 初始化 attr
///    pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_DETACHED); // 设置可分离
///
///    pthread_create(&thread, &attr, BusyWork, ((void *)t)); // 创建线程时候 传入
///
/// @param threadid 需要等待结束的线程
///
/// @return int 类型 返回 0 是成功。 失败 返回错误号码。
pthread_detach (threadid)

/// 见上
pthread_attr_setdetachstate (attr,detachstate)
pthread_attr_getdetachstate (attr,detachstate)
````

### Stack Management

在属性的时候，设置StackSize 以及 StackAddr 属性，在上面我们已经提到过。

````cpp
pthread_attr_getstacksize (attr, stacksize)
pthread_attr_setstacksize (attr, stacksize)

pthread_attr_getstackaddr (attr, stackaddr)

pthread_attr_setstackaddr (attr, stackaddr)
````

### Miscellaneous
````cpp
/// 获取当前的 threadid 也就是地址位置
///
///    pthread_t tid = pthread_self();
///    printf("(0x%x)\n", (unsigned int)tid);
pthread_self ()
/// 判断传入的 两个 thread 是否相等 ==
/// @param thread1,thread2 thread 对象
pthread_equal (thread1,thread2)

/// 单例
/// pthread_once_t once = PTHREAD_ONCE_INIT;
/// pthread_once(&once , onceRun);
///
/// @param  once_control pthread_once_t 单例线程对象
/// @param  init_routine 要执行的方法
///
/// @return int 类型 返回 0 是成功。 失败 返回错误号码。
pthread_once (once_control, init_routine)
````

## Mutex Variables

* 互斥变量， 互斥变量是为了实现线程的同步和保护共享数据多次写入时的主要手段之一
* 一个互斥变量就像保护访问共享数据资源的“锁”。Pthreads中使用的互斥量的基本概念是，在任何给定时间只有一个线程可以锁定（或拥有）会变量。因此，即使有几个线程试图锁定一个互斥锁，也只有一个线程会成功。没有其他线程可以拥有该互斥体，知道拥有互斥体的线程解锁该互斥体。线程必须“轮流”访问受保护的数据。
* 互斥体可以用来放置“race” 问题。设计银行交易的竞争情况的一个例子如下所示：       

| Thread 1 | Thread 2 | Banlance |
|----- | ----| ---- |
| Read balance: $1000 | | $1000 |
| | Read balance: $1000 | $1000 |
| | Deposit $200 | $1000 |
| Deposit $200 | | $1000 |
| Update balance $1000+$200 | | $1200 |
| | Update balance $1000+$200 | $1200 |
* 在上面的例子上，当一个线程正在使用共享数据资源时，应该使用互斥来锁定“Banlance”。
* 一个拥有互斥锁的线程执行的动作t通常是更新全局变量，这是一个安全的方法，确保当多个线程更新同一个变量时，最终只与只有一个线程更新时的值相同
* 使用互斥体的典型顺序如下
  1. 创建并初始化一个互斥变量
  2. 几个线程试图区锁定这个互斥变量
  3. 只有一个成功并且这个变量拥有这个互斥变量
  4. 这个拥有者线程执行一些设置操作
  5. 这个拥有着线程解锁这个互斥变量
  6. 其他的线程重复获取这个互斥变量 并且作出一样的操作
  7. 最后将这个互斥变量 解锁，分离。
* 当多个线程竞争这个互斥变量，失败者锁定这个竞争。。。理解就是 失败的人 应该是 “retry”，而不应该是 “lock”操作。
* 在保护共享数据时，程序员有责任确保每个需要适应到互斥变量的线程都使用互斥锁。例如，有4个线程正在更新相同的数据，但只有一个使用互斥体，则数据仍然可能被破坏。

### Creating and Destroying Mutexes

* 互斥变量必须声明为`pthread_mutex_t`类型，并且必须在调用之前初始化。这里有两个方法去初始化一个互斥变量：
  1. 静态方法，一下是声明它的例子：  
    ````cpp
    pthread_mutex_t mymutex = PTHREAD_MUTEX_INITIALIZER;
    ````
  2. 动态方法，常规的`pthread_mutex_init`方法，这个方法允许设置互斥对象的参数。
  初始化后的 互斥变量是 没有被锁定的。
* 这个 *attr* 对象用来建设互斥对象的特性，并且其必须为`pthread_mutexattr_t`(可以设置为`NULL`接受其设置为默认值)。Pthreads定义了三种互斥属性：
  1. 协议 Protocol: 指定用于防止互斥项优先级反转的协议。
  2. 优先级 Prioceiling: 指定互斥项的优先级上限。
  3. 进程共享 Process-shared: 指定互斥锁的进程共享。
  note: 并不是每个互斥对象都需要实现这三个属性。
* `pthread_mutexattr_init()` 和 `pthread_mutexattr_destroy()` 用来创建和分离互斥属性对象
* 应该使用`pthread_mutex_destroy()`来释放不再需要的互斥对象。

````cpp
/// 初始化 互斥变量
pthread_mutex_init (mutex,attr)
/// 销毁 互斥变量
pthread_mutex_destroy (mutex)
/// 互斥变量属性对象初始化
pthread_mutexattr_init (attr)
/// 互斥变量属性对象释放
pthread_mutexattr_destroy (attr)
````

### Locking and Unlocking Mutexes
````cpp
/// 该方法是常规的针对某个指定的互斥变量设置锁的方法
/// 如果该变量已经被其他线程锁定，它将会堵塞线程，知道这个互斥变量被解锁
pthread_mutex_lock (mutex)
/// 将尝试去锁定一个互斥变量.然而，如果这个变量被其他线程锁定，这个方法会返回一个"busy"的错误代码。
/// 这个方法在防止死锁的情况非常有用。如在优先级反转的情况下。
pthread_mutex_trylock (mutex)
/// 如果是拥有着互斥变量的线程对象调用的该方法，则会解锁该变量。
/// 在线程完成了对于受保护数据的操作后，调用这个方法是必须的。
/// 如果调用该方法出现了问题，那么可能是以下两种问题：
/// 1. 这个互斥变量已经被解锁了
/// 2. 这个互斥变量不是调用方法的线程所持有的
pthread_mutex_unlock (mutex)
````
互斥并没有什么神奇的...事实上他们类似于线程之间的“君子协议”.这完全取决于代码的编写者针对于必要的线程都做出了正确的解锁加锁的操作。下面场景演示一个错误的示范：
````
Thread 1     Thread 2     Thread 3
Lock         Lock         
A = 2        A = A+1      A = A*B
Unlock       Unlock   
````
问题： 当很多个线程都在等待这个已经被锁定的互斥变量解锁，那么当这个变量解锁之后，谁会第一个获得这个持有权呢？
答案： 除非优先级别的调整，否则会将这个问题丢给系统调度器，这样就导致 这个结果或多或少的是随机的。

#### Mutex Lock&UnLock Example

````cpp

/// 创建一个 DODATA 类型
typedef struct {
    double *a;
    double *b;
    double sum;
    int veclen;
}DODATA;

/// 数组的个数
#define NUMTHRDS 4
#define VECLEN 100

/// 数据对象；线程数组；互斥对象；
DODATA dotstr;
pthread_t thread[NUMTHRDS];
pthread_mutex_t mutex;

- (void)viewDidLoad {

    [super viewDidLoad];

    double *a,*b;

    /* Assign storage and initialize values */
    a = (double*) malloc (NUMTHRDS*VECLEN*sizeof(double));
    b = (double*) malloc (NUMTHRDS*VECLEN*sizeof(double));

    for (int i=0; i<VECLEN*NUMTHRDS; i++)
    {
        a[i]=1.0;
        b[i]=a[i];
    }

    dotstr.a = a;
    dotstr.b = b;
    dotstr.veclen = VECLEN;
    dotstr.sum = 0;

/// 创建一个 线程属性对象
    pthread_attr_t attr;
    pthread_attr_init(&attr);
    pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_JOINABLE);

    /// 创建互斥变量
    pthread_mutex_init(&mutex, nil);

/// 创建线程
    for (long i = 0 ; i < NUMTHRDS; i++) {
        pthread_create(&thread[i], &attr, MathSum, (void *)i);
    }

/// join 阻塞
    for (long i = 0 ; i < NUMTHRDS; i++) {
        pthread_join(thread[i], nil);
    }

/// 释放
    pthread_attr_destroy(&attr);
    pthread_mutex_destroy(&mutex);
    free(a);
    free(b);
    pthread_exit(nil);
}

void *MathSum(void *arg){

    int i, start, end, len ;
    long offset;
    double mysum, *x, *y;
    offset = (long)arg;

    len = dotstr.veclen;
    start = offset*len;
    end   = start + len;
    x = dotstr.a;
    y = dotstr.b;

    mysum = 0;
    for (i=start; i<end ; i++){
        mysum += (x[i] * y[i]);
    }

//    pthread_mutex_lock(&mutex);
    dotstr.sum += mysum;
//    pthread_mutex_unlock(&mutex);

    NSLog(@"第%ld次，MYSUM%f",offset,dotstr.sum);

    pthread_exit((void *)0);

    return nil;
}

````

。。。。
很不明白，，，我注释和不注释 加锁 解锁，，，得到的结果除了顺序不一样之外，感觉没有发生数据错误。我本来以为的是，比如我在这里的写入的时候，其他地方也在写入。就会算出来。
100
200
200
300
这样的问题呢，，，但是无论是否顺序一样，第四次执行得到的结果都是 400.

## Condition Variables

* 条件变量是线程同步的另一种方式。虽然互斥通过控制线程对数据的访问来实现线程同步，而条件变量则允许通过数值的实际值来实现线程同步
* 在不使用条件变量的情况下，程序员需要不断轮询（可能在关键位置），去检查条件是否允许。这可能非常浪费资源，因为这个线程会这个活动中持续繁忙。条件变量是一种无序轮询即可实现相同目标的方法
* 一个条件变量总是和一个互斥变量一起使用

````cpp

pthread_cond_init（condition，attr）

pthread_cond_destroy（condition）

pthread_condattr_init（attr）

pthread_condattr_destroy（attr）
````

* 条件变量必须声明为`pthread_cond_t`类型，在使用之前必须初始化。有两种方法来初始化条件变量
  1. 静态，初始化的时候，例如       
    ````cpp
    pthread_cond_t myconvar = PTHREAD_COND_INITIALIZER;
    ````
  2. 动态的使用`pthread_cond_init()`来创建。传入条件对象的id。该方法允许设置条件变量对象属性attr
* 可选的attr，用来设置条件变量属性。条件变量对象只有一个值，`process-shared`，他允许条件变量被其他进程中的线程看到。属性对象（如果使用的话）必须为`pthread_condattr_t`类型（可以指定NULL为默认值）。              
  请注意不是所有的实现都需要提供进程共享属性
* `pthread_condarrt_init()`和`pthread_condattr_destory()`用来创建和销毁条件变量属性的对象。
* 应该适应`pthread_cond_destory()`来释放不在需要的条件变量。

### Waiting and Signaling on Condition Variables

````cpp
pthread_cond_wait (condition,mutex)

pthread_cond_signal (condition)

pthread_cond_broadcast (condition)
````

* `pthread_cond_wait()`阻塞调用线程，知道制定条件为止。这个例程应该在互斥量被锁定的时候被调用，并且在他等待的时候会自动释放互斥量。接到信号并且线程唤醒后，互斥锁将被自动锁定以供线程使用。程序员然后负责在线程完成时解锁互斥体。      
  建议：适应WHERE循环而不是IF语句（参阅下面的watch_count例程）来检查等待的条件可以帮助你处理几个潜在的问题。例如：
  1. 如果有几个县城正在等待相同的唤醒信号，他们将轮流获取互斥锁，并且其中任何一个线程都可以修改他们全部等待的条件。
  2. 如果线程由于程序错误而受到错误的信号
  3. Pthreads 库允许在不违反标准的情况下，向虚拟线程发出虚假唤醒。
* `pthread_cond_signal()`用于信号（或唤醒），其条件变量等待另一个线程。它应该在锁定互斥锁之后调用，并且解锁互斥锁才能完成 `pthread_cond_wait()`
* 调用 `pthread_cond_broadcast()`用来代替 `pthread_cond_signal()`如果多于一个线程处于阻塞等待状态。
* 调用 `pthread_cond_wait()` 之前调用 `pthread_cond_signal()` 是一个逻辑错误。
* ！！！在使用这些方法中，正确锁定和解锁相关的互斥变量是至关重要的。例如
  * 在调用`pthread_cond_wait()`之前没有锁定 互斥变量，可能导致不阻塞
  * 在调用`pthread_cond_signal()`之后未能解锁互斥体 可能不允许匹配的 `pthread_cond_wait()`完成（它还是保持阻塞状态）

####  Waiting and Signaling on Condition Variables Example

下面模拟两个线程，一个叫号，一个等待。

````cpp
int number = 0;
#define MYSELFNUMBER 13
#define WAITNUMBER 15

pthread_cond_t cond_t;
pthread_mutex_t mutex_t;

// 模拟叫号
void maisn(){

    pthread_cond_init(&cond_t, nil);
    pthread_mutex_init(&mutex_t, nil);

    pthread_attr_t attr;
    pthread_attr_init(&attr);
    pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_JOINABLE);

    pthread_t waitthread;
    pthread_t callthread;

    pthread_create(&waitthread, &attr, _wait, nil);
    pthread_create(&callthread, &attr, _call, nil);

    pthread_join(waitthread, nil);
    pthread_join(callthread, nil);

    pthread_attr_destroy(&attr);
    pthread_mutex_destroy(&mutex_t);
    pthread_cond_destroy(&cond_t);
    pthread_exit(nil);
}

/// 等待
void *_wait(void * params){

    pthread_mutex_lock(&mutex_t);

    while (number < MYSELFNUMBER) {
        pthread_cond_wait(&cond_t, &mutex_t);
        NSLog(@"在的在的，这就来");
    }

    pthread_mutex_unlock(&mutex_t);

    pthread_exit((void *)0);

    return nil;
}

/// 叫号
void *_call(void * params){

    for (int i = 0 ; i < WAITNUMBER; i++) {
        pthread_mutex_lock(&mutex_t);
        number++;
        NSLog(@"请第%d号，到柜台办理业务，过时不候～",number);
        if (number == MYSELFNUMBER) {
            pthread_cond_signal(&cond_t);
        }
        pthread_mutex_unlock(&mutex_t);
        sleep(1);
    }

    NSLog(@"今天的业务就到这里结束");

    pthread_exit((void *)0);

    return nil;
}
````

# 代码理解解析
