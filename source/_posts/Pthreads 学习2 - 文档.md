---
title: Pthreads 学习1
date: 2018-1-11 08:22:00
tags: [IOS,Pthreads,线程]
categories: 线程
---

在共享内存多处理器体系结构中，可以使用线程来实现并行性。从历史上看，硬件供应商已经实现了自己的专有版本的线程，使得可移植性成为软件开发人员的关注点。对于UNIX系统，标准化的C语言线程编程接口已由IEEE POSIX 1003.1c标准规定。坚持这个标准的实现被称为POSIX线程或Pthreads。

本教程首先介绍使用Pthread的概念，动机和设计注意事项。然后介绍Pthreads API中三大类例程中的每一个：线程管理，互斥变量和条件变量。示例代码用于演示如何使用新Pthreads程序员所需的大部分Pthreads例程。本教程最后讨论了LLNL细节以及如何将MPI与pthreads混合。实验室练习还包括许多示例代码（C语言）。

级别/先决条件：本教程非常适合那些刚接触pthread的并行编程人员。在C中的并行编程的基本理解是必需的。对于那些不太熟悉并行编程的人来说，[EC3500：并行计算入门](https://computing.llnl.gov/tutorials/parallel_comp)所涉及的 内容将会很有帮助。

<!-- more -->

## pthread_atfork
## pthread_attr_destroy && pthread_attr_init
### 含义
销毁 线程属性对象
### 概要
````cpp
#include <pthread.h>

/// 传递一个 pthread_attr_t 对象的指针
int pthread_attr_destroy（pthread_attr_t * attr）;
````
### 描述
`pthread_attr_destroy()` 函数应该销毁一个线程属性对象。销毁后的线程属性对象是未定义的，销毁后的对象可以通过`pthread_attr_init()`重新定义。     
`pthread_attr_init()`函数。是初始化一个线程属性对象，每一个单个属性都会给定默认的实现      
由此产生的属性对象(通过设置单个属性可以修改),在使用 `pthread_create()`方法时传入。一个线程属性对象可以在多个线程中使用。如果调用`pthread_attr_init()`函数传入的只是一个已经定义了的属性对象，它的结果是不确定的。
### 返回
在成功完成 `pthread_attr_destroy()` 或 `pthread_attr_init()` 时返回0，否则就返回该操作的错误代码。
### 错误
`pthread_attr_init()`出现错误可能是：
1. ENOMEM 没有足够的内存来初始化这个线程属性对象
2. 这个方法不应该返回错误代码，如果返回了那么就出错了
## pthread_attr_getdetachstate && pthread_attr_setdetachstate
### 含义
获取或者设置 `detachstate` 属性
### 概要
````cpp
#include <pthread.h>

int pthread_attr_getdetachstate（const pthread_attr_t * attr，int * detachstate）;
int pthread_attr_setdetachstate（pthread_attr_t * attr，int detachstate）;
````
### 描述
`detachstate`属性是控制一个线程在创建的时候是否是独立的状态。如果这个线程创建是独立的，接下来使用他的ID来调用`pthread_detach()`或`pthread_join()`会出现一个错误。        
这个`pthread_attr_getdetachstate()` 和 `pthread_attr_setdetachstate()`方法是用来获取或者设置 线程属性对象中的 `detachstate` 属性。       
针对于 `pthread_attr_getdetachstate()`你能获取的只能是 `PTHREAD_CREATE_DETACHED`或者`PTHREAD_CREATE_JOINABLE`     
针对于 `pthread_attr_setdetachstate` 你能设置的值也只能是 `PTHREAD_CREATE_DETACHED`或者`PTHREAD_CREATE_JOINABLE`      
设置`PTHREAD_CREATE_DETACHED`将导致创建属性是在分离的状态中的所有线程，而使用`PTHREAD_CREATE_JOINABLE`将导致创建属性处于可连接状态的所有线程。该detachstate属性的默认值将`PTHREAD_CREATE_JOINABLE`。
### 返回
在成功完成 `pthread_attr_getdetachstate()` 或 `pthread_attr_setdetachstate()` 时返回0，否则就返回该操作的错误代码。

### 错误
`pthread_attr_setdetachstate()`出现错误可能是：
1. EINVAL 传入的`detachstate`属性没有通过验证
2. 这个方法不应该返回错误代码，如果返回了那么就出错了
## pthread_attr_getguardsize && pthread_attr_setguardsize
### 含义
获取或设置 线程保护属性
### 概要
````cpp
#include <pthread.h>

int pthread_attr_getguardsize（const pthread_attr_t * restrict attr，
       size_t * restrict guardsize）;
int pthread_attr_setguardsize（pthread_attr_t * attr，
       size_t guardsize）;
````
### 描述
`pthread_attr_getguardsize()`函数将得到线程属性中的保护属性。     
`pthread_attr_setguardsize()`函数应该设置线程属性对象`guardsize`属性。如果这个值为0，则不给予使用这个线程属性对象创建的线程提供守护区域，如果大于零，则需要为每个使用这个线程属性对象创建的线程提供至少为`guardsize`的守护大小      
`guardsize` 属性控制创建的线程的堆栈的保护区区域的大小。
`guardsize`属性为创建线程的堆栈控制保护区大小。提供保护,防止堆栈指针溢出。如果线程的堆栈具有防护，那么在其堆栈移除的时候分配额外的内存。如果应用程序溢出到这个区域，将发出一个错误（一个 SIGSEGV 信号）
## pthread_attr_getinheritsched && pthread_attr_setinheritsched
### 描述
函数将分别获取并设置inheritsched属性在attr的论点。

当`pthread_create()`创建一个线程的时候，`inheritsched` 属性决定了其继承性质。
它可以被设置为以下两个值：
1. PTHREAD_INHERIT_SCHED 指定的线程调度属性应当从创建线程的调度属性继承，这个属性参数将被忽略。
2. PTHREAD_EXPLICIT_SCHED 指定线程调度属性应设置为该属性对象的相应值
## pthread_attr_getschedparam && pthread_attr_setschedparam
### NAME

pthread_attr_getschedparam,  pthread_attr_setschedparam  -  获取或者设置 调度参数
### 概要
````cpp
#include <pthread.h>

int pthread_attr_getschedparam(const pthread_attr_t *restrict attr,
       struct sched_param *restrict param);
int pthread_attr_setschedparam(pthread_attr_t *restrict attr,
       const struct sched_param *restrict param);
````
### 描述
`pthread_attr_getschedparam()`和`pthread_attr_setschedparam()`函数分别在attr参数中获取和设置调度参数属性。 param结构的内容在<sched.h>头文件中定义。 对于SCHED_FIFO和SCHED_RR策略，param的唯一必需成员是sched_priority。

对于SCHED_SPORADIC策略，param结构所需的成员是sched_priority，sched_ss_low_priority，sched_ss_repl_period，sched_ss_init_budget和sched_ss_max_repl。 指定的sched_ss_repl_period必须大于或等于指定的sched_ss_init_budget才能成功; 如果不是，则该功能将失败。 sched_ss_max_repl的值应该在函数成功的包含范围[1，{SS_REPL_MAX}]内; 如果不是，则该功能将失败。

## pthread_attr_getschedpolicy && pthread_attr_setschedpolicy
### 名称
pthread_attr_getschedpolicy,  pthread_attr_setschedpolicy - get and set
the schedpolicy attribute (REALTIME THREADS)

### 概要
````cpp
#include <pthread.h>

int pthread_attr_getschedpolicy(const pthread_attr_t *restrict attr,
       int *restrict policy);
int pthread_attr_setschedpolicy(pthread_attr_t *attr, int policy);
````

### 描述
pthread_attr_getschedpolicy（）和pthread_attr_setschedpolicy（）函数将分别在attr参数中获取并设置schedpolicy属性。

 支持的策略值应包括在<sched.h>头文件中定义的SCHED_FIFO，SCHED_RR和SCHED_OTHER。 当使用调度策略SCHED_FIFO，SCHED_RR或SCHED_SPORADIC执行的线程正在等待互斥体时，它们将在互斥体解锁时以优先级顺序获取互斥体。
## pthread_attr_getscope
## pthread_attr_getstack
## pthread_attr_getstackaddr
## pthread_attr_getstacksize
##
##
##
##
##
## pthread_attr_setscope
## pthread_attr_setstack
## pthread_attr_setstackaddr
## pthread_attr_setstacksize
## pthread_barrier_destroy
## pthread_barrier_init
## pthread_barrier_wait
## pthread_barrierattr_destroy
## pthread_barrierattr_getpshared
## pthread_barrierattr_init
## pthread_barrierattr_setpshared
## pthread_cancel
### 名称
取消线程的执行

### 概要
````cpp
#include <pthread.h>

int pthread_cancel（pthread_t thread）;       
````
### 描述
取消指定的函数

## pthread_cleanup_pop && pthread_cleanup_push

### 概要
````cpp

#include <pthread.h>

void pthread_cleanup_pop(int execute);
void pthread_cleanup_push(void (*routine)(void*), void *arg);
````
### 描述
两个方法为宏定义方法，主要是用来在一个线程退出的时候调用方法。
以下三种情况会出发到这个推出栈调用。
1. 线程退出(即调用pthread_exit())
2. 线程发出了 cancel 请求
3. 线程正常调用到了 `pthread_cleanup_pop`方法
这些函数可以作为宏实现。应用程序中应确保他们成对出现。就像 () 括号一样。     

## pthread_cond_broadcast
## pthread_cond_destroy
## pthread_cond_init
## pthread_cond_signal
## pthread_cond_timedwait
## pthread_cond_wait
## pthread_condattr_destroy
## pthread_condattr_getclock
## pthread_condattr_getpshared
## pthread_condattr_init
## pthread_condattr_setclock
## pthread_condattr_setpshared
## pthread_create
## pthread_detach
## pthread_equal
### 名称
比较线程ID
### 概要
````cpp
#include <pthread.h>

int pthread_equal（pthread_t t1，pthread_t t2）;
````
### 描述
这个函数比较线程 t1和t2.
### 返回值
如果t1和t2相等,`pthread_equal()`函数将返回一个非零值;否则返回零。      
如果t1或t2不是有效的线程ID，则行为是未定义的。

## pthread_exit

### 名称
线程终止
### 概要
````cpp
#include <pthread.h>

void pthread_exit（void * value_ptr）;
````
### 描述
`pthread_exit()`方法退出当前方法的线程       
The pthread_exit() function shall terminate the calling thread and make the value value_ptr available to any successful join with the terminating thread. Any cancellation cleanup handlers that have been pushed and not yet popped shall be popped in the  reverse  order  that  they  were pushed and then executed.  After all cancellation cleanup handlers have  been executed, if the thread has any thread-specific data,  appropriate  destructor  functions  shall  be called in an unspecified order. Thread termination does not release any application visible process resources,  including,  but  not limited to, mutexes and file descriptors, nor does  it perform any process-level cleanup actions, including, but  not  limited to, calling any atexit() routines that may exist. An implicit call to pthread_exit() is made when a thread other than the  thread in which main() was first invoked returns from the start routine that  was used to create it. The function's return value shall serve as the thread's exit status.
 The behavior of pthread_exit() is undefined if called from a  cancellation  cleanup  handler  or  destructor  function  that was invoked as a result of either an implicit or explicit call to pthread_exit().

After a thread has terminated, the result of  access  to  local  (auto) variables  of  the thread is undefined. Thus, references to local variables of the exiting thread should not be used for  the  pthread_exit() value_ptr parameter value.

The  process  shall exit with an exit status of 0 after the last thread has been terminated. The behavior shall be  as  if  the  implementation called exit() with a zero argument at thread termination time.
## pthread_getconcurrency
## pthread_getcpuclockid
## pthread_getschedparam
## pthread_join

### 概要
````cpp

#include <pthread.h>

int pthread_join(pthread_t thread, void **value_ptr);

````
### 描述
该方法会暂停执行，直到目标线程结束运行。你可以通过一个非空的`value_ptr`来获得线程运行的成功的结果，the value passed to  pthread_exit() by  the terminating thread shall be made available in the location referenced by value_ptr.是在是没办法理解这句话了...
当`pthread_join()`返回成功时，这个目标线程就标志着结束。如果针对一个相同的线程同步调用多次这个`pthread_join()`其结果是不可预知的。如果目标线程已经被取消了，那么这个线程不再可分离。      
这个有没有指定线程是否已经退出，都不会记入{PTHREAD_THREADS_MAX}。
## pthread_key_create && pthread_key_delete && pthread_getspecific && pthread_setspecific
### 概要
````cpp
#include <pthread.h>

int pthread_key_create(pthread_key_t *key, void (*destructor)(void*));
int pthread_key_delete(pthread_key_t key);

void *pthread_getspecific(pthread_key_t key);
int pthread_setspecific(pthread_key_t key, const void *value);
````
### 描述
> 在单线程程序中，我们经常要用到"全局变量"以实现多个函数间共享数据。在多线程环境下，由于数据空间是共享的，因此全局变量也为所有线程所共有。但有时 应用程序设计中有必要提供线程私有的全局变量，仅在某个线程中有效，但却可以跨多个函数访问，比如程序可能需要每个线程维护一个链表，而使用相同的函数操 作，最简单的办法就是使用同名而不同变量地址的线程相关数据结构。这样的数据结构可以由Posix线程库维护，称为线程私有数据（Thread- specific Data，或TSD）。    出自[《Posix线程编程指南(2)-线程私有数据》](https://www.ibm.com/developerworks/cn/linux/thread/posix_threadapi/part2/) - 杨沙洲

在我看来这个就是在某一个线程根据key设置了一个值，这个值可以保存在这个线程呢。在这个线程内任何时候都是可以调用的。
`pthread_key_create` 和 `pthread_key_delete` 是创建 和 销毁 这个 Key 的。    
`pthread_getspecific` 和 `pthread_setspecific` 使用获取和设置这个KEY在当前线程保存的数据的。    

其实理解这个东西主要要理解 什么叫做 线程内的私有公共变量。。。好吧，，我理解的就是 一个进程中含有多个线程。每个线程都有自己的公共变量。如果没有这个东西的话，公共变量就是每个线程都可以访问的那么就不是线程私有的了。

以下，是官方文档。         
`pthread_key_create()`函数将创建一个线程内的公共参数的Key值。提供的Key是为了获取到线程内私有的公共变量的数据。当然相同的键值可以通过`pthread_setspecific`被绑定到不同的线程上。          
默认的键对应的值是NULL。       
如果你设置了`destructor`构析函数，那么在线程结束后，会调用该方法，并将该键所绑定的数据当作参数返回。          

If, after all the destructors have been called for all non-NULL  values with  associated destructors, there are still some non-NULL values with  associated destructors, then the process is  repeated.   If,  after  at  least  {PTHREAD_DESTRUCTOR_ITERATIONS}  iterations  of destructor calls for outstanding non-NULL values, there are still some  non-NULL  values with  associated destructors, implementations may stop calling destructors, or they may continue calling destructors until no non-NULL values with  associated destructors exist, even though this might result in an  infinite loop.再一次看不懂了        

`pthread_key_delete`函数将删除一个线程私有公共数据的键。当调用 `pthread_key_delete()`的时候与KEY相关联的数据需要不能为空。应用程序有责任释放任何应用程序存储，或对与任何线程中删除的键或相关联的线程特定数据相关的数据结构执行任何清理操作;在调用了`pthread_key_delete()`之后，任何使用key再次调用`pthread_key_delete()`的方法都会引起未知的结果。

`pthread_key_delete()`方法应该在构析函数中调用.

`pthread_getspecific()`函数获取当前的线程中绑定key的值。      
`pthread_setspecific()`函数是线程将一个使用`pthread_key_create()`获得的键与值绑定在一起。这些值通常是指向动态分配的内存块的指针，这些内存是为调用线程保留的。      
在没有使用`pthread_key_create()`创建键之前，或者使用了`pthread_key_delete()`之后，调用`pthread_getspecific()`或`pthread_setspecific()`方法，结果是未知的。          
Both pthread_getspecific() and pthread_setspecific() may be called from a thread-specific data destructor function. A call  to  pthread_getspecific()  for  the thread-specific data key being destroyed shall return  the value NULL, unless the  value  is  changed  (after  the  destructor starts)  by  a  call  to pthread_setspecific(). Calling pthread_setspecific() from a  thread-specific  data  destructor  routine  may  result  either  in  lost  storage (after at least PTHREAD_DESTRUCTOR_ITERATIONS attempts at destruction) or in an infinite loop.（再见👋～）            
`pthread_getspecific()`和`pthread_setspecific()`可以被实现为宏。

## pthread_kill

### 名称
pthread_kill  - 发送一个信号给一个线程

### 概要
````cpp
#include <signal.h>

int pthread_kill(pthread_t thread，int sig);
````
### 描述
pthread_kill() 函数要求为指定的线程传递一个信号。
与kill()中一样，如果sig为零，则应该执行错误检查，但不执行信号应该实际发送。

### 返回值
成功完成后，函数将返回零值。否则，该功能应该返回一个错误号码。如果pthread_kill（）函数失败，不发送信号。

## pthread_mutex
### 描述
叫做互斥锁       
主要是为了对于公共变量的值访问的时候，进行锁定，防止多个线程同时访问修改数据导致错误。
````cpp
//
//  Mutex.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/9.
//  Copyright © 2018年 s. All rights reserved.
//

#include <unistd.h>
#include <stdio.h>
#include <pthread.h>

/// Thread Count Number
#define TN 6
int count = 0;

void * barriers(void * param){

    for (long i = 0; i < TN; i++) {
        count++;
        printf("线程[%ld]: 计数器 - <%d> \n",((long)param),count);
        sleep(1);
    }

    pthread_exit(NULL);
    return NULL;
}

int main(void){

    pthread_t threads[TN];

    for (long i = 0; i < TN; i++) {

        pthread_create(&threads[i], NULL, barriers, (void * )i);
    }

    pthread_mutex_destroy(&mutex_t);
    pthread_exit(NULL);
}

````

这个就会出现错误
````shell
线程[0]: 计数器 - <1>
线程[1]: 计数器 - <2>
线程[2]: 计数器 - <3>
线程[3]: 计数器 - <4>
线程[4]: 计数器 - <5>
线程[5]: 计数器 - <6>
线程[1]: 计数器 - <7>
线程[0]: 计数器 - <7>
线程[2]: 计数器 - <8>
线程[3]: 计数器 - <8>
线程[4]: 计数器 - <9>
线程[5]: 计数器 - <10>
线程[0]: 计数器 - <12>
线程[2]: 计数器 - <11>
线程[3]: 计数器 - <13>
线程[1]: 计数器 - <14>
线程[4]: 计数器 - <15>
线程[5]: 计数器 - <16>
线程[0]: 计数器 - <17>
线程[2]: 计数器 - <18>
线程[3]: 计数器 - <19>
线程[1]: 计数器 - <20>
线程[4]: 计数器 - <21>
线程[5]: 计数器 - <22>
线程[0]: 计数器 - <23>
线程[2]: 计数器 - <24>
线程[3]: 计数器 - <24>
线程[1]: 计数器 - <25>
线程[4]: 计数器 - <26>
线程[5]: 计数器 - <27>
线程[0]: 计数器 - <28>
线程[2]: 计数器 - <29>
线程[3]: 计数器 - <30>
线程[1]: 计数器 - <31>
线程[4]: 计数器 - <32>
线程[5]: 计数器 - <33>
````
如果使用了互斥锁
````cpp
//
//  Mutex.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/9.
//  Copyright © 2018年 s. All rights reserved.
//

#include <unistd.h>
#include <stdio.h>
#include <pthread.h>

/// Thread Count Number
#define TN 6
int count = 0;
pthread_mutex_t mutex_t;

void * barriers(void * param){

    pthread_mutex_lock(&mutex_t);

    for (long i = 0; i < TN; i++) {
        count++;
        printf("线程[%ld]: 计数器 - <%d> \n",((long)param),count);
        sleep(1);
    }

    pthread_mutex_unlock(&mutex_t);
    pthread_exit(NULL);
    return NULL;
}

int main(void){

    pthread_mutex_init(&mutex_t, NULL);

    pthread_t threads[TN];

    for (long i = 0; i < TN; i++) {

        pthread_create(&threads[i], NULL, barriers, (void * )i);
    }

    pthread_mutex_destroy(&mutex_t);
    pthread_exit(NULL);
}
````

以下是每个属性的各自的介绍以及学习。

## pthread_mutex_destroy && pthread_mutex_init
### 名称
`pthread_mutex_destroy`,`pthread_mutex_init` - 销毁/初始化一个互斥变量

### 概要
````cpp
#include <pthread.h>

int pthread_mutex_destroy(pthread_mutex_t *mutex);
int pthread_mutex_init(pthread_mutex_t *restrict mutex,
       const pthread_mutexattr_t *restrict attr);
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
````
### 描述
`pthread_mutex_destroy()`函数应该销毁互斥体引用的互斥对象; 互斥对象实际上变成未初始化的。 实现可能会导致`pthread_mutex_destroy()`将互斥体引用的对象设置为无效值。 被破坏的互斥对象可以使用`pthread_mutex_init()`重新初始化; 否则在对象被销毁之后引用对象的结果是不确定的。      
销毁没有锁定的互斥锁应是安全的，尝试销毁锁定的互斥锁会导致未定义的行为。      
`pthread_mutex_init()`函数将用attr指定的属性初始化互斥体引用的互斥锁。 如果attr为NULL，则使用默认的互斥体属性; 其效果应与传递默认互斥对象的地址相同。 初始化成功后，互斥锁的状态被初始化和解锁。          
只有互斥体本身可以用于执行同步。 在调用`pthread_mutex_lock()`，`pthread_mutex_trylock()`，`pthread_mutex_unlock()`和`pthread_mutex_destroy()`的调用中引用互斥体的副本的结果是未定义的。      
尝试初始化已经初始化的互斥体会导致未定义的行为。        
在默认互斥量属性适当的情况下，宏PTHREAD_MUTEX_INITIALIZER可用于初始化静态分配的互斥量。 该效果应该相当于通过调用`pthread_mutex_init()`，将参数attr指定为NULL来动态初始化，除非不执行错误检查。
## pthread_mutex_getprioceiling && pthread_mutex_setprioceiling

### 名称
pthread_mutex_getprioceiling，pthread_mutex_setprioceiling - 获取并设置互斥锁的优先级上限（REALTIME THREADS）

### 概要
````cpp
#include <pthread.h>

int pthread_mutex_getprioceiling(const pthread_mutex_t *restrict mutex,
       int *restrict prioceiling);
int pthread_mutex_setprioceiling(pthread_mutex_t *restrict mutex,
       int prioceiling, int *restrict old_ceiling);
````
### 描述
`pthread_mutex_getprioceiling()`函数将返回互斥量的当前优先级上限。

`pthread_mutex_setprioceiling()`函数在解锁时锁定互斥锁，或者阻塞直到成功锁定互斥锁，然后改变互斥锁的优先级上限并释放互斥锁。 当更改成功时，优先级上限的先前值将在old_ceiling中返回。 锁定互斥锁的过程不需要遵守优先保护协议。

如果`pthread_mutex_setprioceiling()`函数失败，则不会更改互斥优先级上限。

### 错误
`pthread_mutex_getprioceiling()`和`pthread_mutex_setprioceiling()`功能可能会失败：

`EINVAL` prioceiling要求的优先级超出范围。
`EINVAL` 由互斥体指定的值不引用当前存在的互斥体。
`EPERM`  调用者没有执行操作的权限。
这些功能不应返回[EINTR]的错误代码。

## pthread_mutex_lock && pthread_mutex_trylock && pthread_mutex_unlock

### 名称
`pthread_mutex_lock`,  `pthread_mutex_trylock`, `pthread_mutex_unlock` - 锁定或者解锁一个互斥变量
### 概要
````cpp
#include <pthread.h>

int pthread_mutex_lock(pthread_mutex_t *mutex);
int pthread_mutex_trylock(pthread_mutex_t *mutex);
int pthread_mutex_unlock(pthread_mutex_t *mutex);
````
### 描述
互斥体引用的互斥体对象应通过调用`pthread_mutex_lock()`来锁定。 如果互斥锁已经被锁定，则调用线程将阻塞直到互斥锁变为可用。 这个操作应该以调用线程作为拥有者的锁定状态返回互斥体引用的互斥体对象。

如果互斥量类型为`PTHREAD_MUTEX_NORMAL`，则不提供死锁检测。 试图重新锁定互斥锁会导致死锁。 如果线程试图解锁未锁定的互斥锁或未锁定的互斥锁，则会导致未定义的行为。

如果互斥类型为`PTHREAD_MUTEX_ERRORCHECK`，则应提供错误检查。 如果线程试图重新锁定已锁定的互斥锁，则应返回错误。 如果线程试图解锁未锁定的互斥锁或解锁的互斥锁，则应返回错误。

如果互斥体类型是`PTHREAD_MUTEX_RECURSIVE`，那么互斥体应该保持锁计数的概念。 当线程第一次成功获取互斥锁时，锁定计数应设置为1。 每当一个线程重新锁定这个互斥锁，锁定计数应该加1。 每次线程解锁互斥锁时，锁定计数应减1。 当锁计数达到零时，互斥锁将变为可用于其他线程获取。 如果线程试图解锁未锁定的互斥锁或解锁的互斥锁，则应返回错误。

如果互斥体类型是`PTHREAD_MUTEX_DEFAULT`，则试图递归锁定互斥体将导致未定义的行为。 试图解锁互斥锁，如果它没有被调用线程锁定导致未定义的行为。 试图解锁互斥锁，如果它没有被锁定导致未定义的行为。

`pthread_mutex_trylock()`函数应该等同于`pthread_mutex_lock()`，只是如果互斥体引用的互斥对象当前被锁定（通过任何线程，包括当前线程），则立即返回调用。 如果互斥体类型为`PTHREAD_MUTEX_RECURSIVE`，且互斥体当前由调用线程拥有，则互斥锁的计数应加1，并且`pthread_mutex_trylock()`函数应立即返回成功。

`pthread_mutex_unlock()`函数将释放由互斥体引用的互斥对象。 互斥体的释放方式取决于互斥体的类型属性。 如果调用`pthread_mutex_unlock()`时，互斥体引用的互斥体对象上有线程被阻塞，导致互斥体变为可用，则调度策略应确定哪个线程将获取互斥体。

（在`PTHREAD_MUTEX_RECURSIVE`互斥量的情况下，当计数达到零时，互斥量将变为可用，并且调用线程不再在此互斥锁上有任何锁定。）

如果一个信号被传递给一个等待互斥体的线程，那么当从信号处理程序返回时，线程将继续等待互斥体，就好像它没有被中断一样。

## pthread_mutex_timedlock
### 名称
pthread_mutex_timedlock - 锁定互斥（ADVANCED REALTIME）     

IOS --- 没有啊

### 概述
````cpp
#include <pthread.h>
#include <time.h>

int pthread_mutex_timedlock(pthread_mutex_t *restrict mutex,
       const struct timespec *restrict abs_timeout);
````
### 描述
`pthread_mutex_timedlock()`函数将锁定由互斥体引用的互斥对象。如果互斥体已经被锁定，调用线程应该阻塞，直到互斥体变得可用，如在`pthread_mutex_lock()`函数中一样。如果互斥锁不能等待另一个线程解锁互斥锁，则当指定的超时到期时，该等待将被终止。

如果超时时间基于超时时间（即，当时钟的值等于或超过abs_timeout）测量，或由abs_timeout指定的绝对时间已经超过绝对时间，abs_timeout指定的绝对时间已过在通话时通过。

如果支持Timers选项，则超时应基于CLOCK_REALTIME时钟;如果Timers选项不被支持，则超时应基于time（）函数返回的系统时钟。

超时的分辨率应该是它所基于的时钟的分辨率。 timespec数据类型在<time.h>头文件中定义。

如果互斥锁可以立即锁定，在任何情况下功能都不会超时。如果可以立即锁定互斥锁，则不需要检查abs_timeout参数的有效性。

由于优先级继承规则（对于使用PRIO_INHERIT协议初始化的互斥锁）的结果，如果定时互斥等待由于其超时终止而终止，则必须根据需要调整互斥所有者的优先级，以反映此线程不再是等待互斥体的线程之中。

## pthread_mutexattr_destroy && pthread_mutexattr_init
### 名称
`pthread_mutex_destroy`,  `pthread_mutex_init`  -  破坏或者初始化一个互斥变量

### 概要
````cpp
#include <pthread.h>

int pthread_mutex_destroy(pthread_mutex_t *mutex);
int pthread_mutex_init(pthread_mutex_t *restrict mutex,
       const pthread_mutexattr_t *restrict attr);
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
````
### 描述
`pthread_mutex_destroy()`函数应该销毁互斥体引用的互斥对象;互斥对象实际上变成未初始化的。实现可能会导致`pthread_mutex_destroy()`将互斥体引用的对象设置为无效值。被破坏的互斥对象可以使用`pthread_mutex_init()`重新初始化;否则在对象被销毁之后引用对象的结果是不确定的。

销毁已解锁的已初始化的互斥锁应是安全的。试图销毁锁定的互斥锁会导致未定义的行为。

`pthread_mutex_init()`函数将用attr指定的属性初始化互斥体引用的互斥锁。如果attr为NULL，则使用默认的互斥体属性;其效果应与传递默认互斥对象的地址相同。初始化成功后，互斥锁的状态被初始化和解锁。

只有互斥体本身可以用于执行同步。在调用`pthread_mutex_lock()`，`pthread_mutex_trylock()`，`pthread_mutex_unlock()`和`pthread_mutex_destroy()`的调用中引用互斥体的副本的结果是未定义的。

尝试初始化已经初始化的互斥体会导致未定义的行为。

在默认互斥量属性适当的情况下，宏`PTHREAD_MUTEX_INITIALIZER`可用于初始化静态分配的互斥量。该效果应该相当于通过调用`pthread_mutex_init()`，将参数attr指定为NULL来动态初始化，除非不执行错误检查。

## pthread_mutexattr_getprioceiling
## pthread_mutexattr_getprotocol
## pthread_mutexattr_getpshared
## pthread_mutexattr_gettype
## pthread_mutexattr_setprioceiling
## pthread_mutexattr_setprotocol
## pthread_mutexattr_setpshared
## pthread_mutexattr_settype

## pthread_once
### 名称
pthread_once  - 动态包初始化
### 概要
````cpp
#include <pthread.h>

int pthread_once（pthread_once_t * once_control，
       void（* init_routine）（void））;
pthread_once_t once_control = PTHREAD_ONCE_INIT;
````

### 描述
进程中的任何线程(具有给定的`once_control`)，调用`pthread_once()`,第一次调用的时候会调用`init_routine`.随后的调用`pthread_once()`都不会调用 `init_routine`.当`pthread_once()`返回时，`init_routine`已经完成了，`once_control`确定是否已经调用了相关的初始化例程。     
`pthread_once()`方法不是一个可以取消的点，但是，如果`init_routine`是一个可以返回的，并且返回了，那这个操作就像是没有调用过`pthread_once()`方法一样的。        
常量 `PTHREAD_ONCE_INIT` 在 `<pthread.h>` 头文件中定义。      
如果`once_control`具有自动存储持续时间或未由`PTHREAD_ONCE_INIT`初始化，则`pthread_once()`的行为是未定义的。

## pthread_rwlock_destroy && pthread_rwlock_init
### 名称
pthread_rwlock_destroy,  pthread_rwlock_init - 销毁/创建一个 读写锁

### 概要
````cpp
#include <pthread.h>

int pthread_rwlock_destroy(pthread_rwlock_t *rwlock);
int pthread_rwlock_init(pthread_rwlock_t *restrict rwlock,
       const pthread_rwlockattr_t *restrict attr);
````
### 描述
`pthread_rwlock_destroy()`函数应销毁由rwlock引用的读写锁对象，并释放锁使用的所有资源。这时，除非另一个调用`pthread_rwlock_init()`来重新初始化这个锁，否则在销毁之后再次调用锁的结果是为定义的。调用`pthread_rwlock_destroy()`会讲 rwlock 设置为无效值。如果一个线程持有 rwlock 时候调用 `pthread_rwlock_destroy()`结果是为定义的。尝试销毁为初始化的读写锁结果也是为定义的。

`pthread_rwlock_init()`函数将分配使用由rwlock引用的读写锁所需的所有资源，并将该锁初始化为具有由attr引用的属性的解锁状态。

如果attr为NULL，则使用默认的读写锁属性;其效果与传递默认读写锁定属性对象的地址相同。一旦初始化，锁可以被使用任何次数而不被重新初始化。如果调用`pthread_rwlock_init()`指定已经初始化的读写锁，结果是未定义的。如果在未初始化的情况下使用读写锁，则结果是不确定的。

如果`pthread_rwlock_init`函数失败，则rwlock不会被初始化，并且rwlock的内容是不确定的。

只有rwlock引用的对象可以用于执行同步。在调用`pthread_rwlock_destroy()`之后，再调用`pthread_rwlock_rdlock()`,`pthread_rwlock_timedrdlock()`,`pthread_rwlock_timedwrlock()`,`pthread_rwlock_tryrdlock()`,`pthread_rwlock_trywrlock()`,`pthread_rwlock_unlock()`, 或者 `pthread_rwlock_wrlock()`的结果是未定义的。

## pthread_rwlock_rdlock && pthread_rwlock_tryrdlock
### 名称
pthread_rwlock_rdlock,  pthread_rwlock_tryrdlock  -  获取一个读锁 阻塞和非阻塞

### 概要
````cpp
#include <pthread.h>

int pthread_rwlock_rdlock(pthread_rwlock_t *rwlock);
int pthread_rwlock_tryrdlock(pthread_rwlock_t *rwlock);
````
### 描述
`pthread_rwlock_rdlock()`函数应该将读锁定应用于由rwlock引用的读写锁定。调用线程获取读锁定，如果一个写程序没有保持锁定，并且锁定上没有写作者被锁定。

如果支持线程执行调度选项，并且锁中涉及的线程正在使用调度策略SCHED_FIFO或SCHED_RR执行，那么调用线程将不会获得锁，如果一个写者持有该锁或者具有较高或相等优先级的写者被阻止上锁;否则，调用线程将获得该锁。

如果支持线程执行调度选项，并且锁中涉及的线程正在使用SCHED_SPORADIC调度策略执行，则调用线程将不会获取该锁，如果一个写入者持有该锁或者具有较高或相等优先级的写入者被阻止锁;否则，调用线程将获得该锁。

如果线程执行调度选项不受支持，则在编写程序没有保持锁定且写入程序被锁定时，调用线程是否获取锁定是实现定义的。如果作者持有该锁，则调用线程将不会获取该读锁。如果没有获取读锁，则调用线程将阻塞直到它可以获取锁。调用线程可能死锁，如果在进行调用时它保持写入锁定。

线程可能在rwlock上保存多个并发读锁（即，成功调用pthread_rwlock_rdlock（）函数n次）。如果是这样，应用程序应确保线程执行匹配的解锁（即，它调用pthread_rwlock_unlock（）函数n次）。

实施保证的同时读取锁的最大数量可以应用于读写锁，应该被实现定义。如果超过这个最大值，pthread_rwlock_rdlock（）函数可能会失败。

pthread_rwlock_tryrdlock（）函数应该像在pthread_rwlock_rdlock（）函数中一样应用一个读锁定，除非该函数在等效的pthread_rwlock_rdlock（）调用会阻塞调用线程时将失败。在任何情况下，pthread_rwlock_tryrdlock（）函数都不会阻塞;它总是要么获得锁定或失败，并立即返回。

如果使用未初始化的读写锁调用这些函数中的任何一个，则结果是不确定的。

如果一个信号被传递给一个等待读写锁的线程读取，那么在从信号处理程序返回之后，线程将恢复等待读写锁的读取，就好像它没有被中断一样。



## pthread_rwlock_timedrdlock
## pthread_rwlock_timedwrlock
## pthread_rwlock_trywrlock && pthread_rwlock_wrlock
### 名称
       pthread_rwlock_trywrlock,  pthread_rwlock_wrlock  -  获得一个读写对象的 写入锁

### 概要
````cpp
#include <pthread.h>

int pthread_rwlock_trywrlock(pthread_rwlock_t *rwlock);
int pthread_rwlock_wrlock(pthread_rwlock_t *rwlock);
````
### 描述
pthread_rwlock_trywrlock（）函数将应用像pthread_rwlock_wrlock（）函数一样的写入锁定，除非函数在任何线程当前持有rwlock（用于读取或写入）时将失败。

pthread_rwlock_wrlock（）函数应该将写锁定应用到由rwlock引用的读写锁。如果没有其他线程（读写器）持有读写锁rwlock，则调用线程获取写锁。否则，线程将阻塞，直到它可以获得锁。调用线程可能会死锁，如果在调用时它保存读写锁（不管是读锁还是写锁）。

实现可能会偏爱写入锁而不是读锁，以避免作家饥饿。

如果使用未初始化的读写锁调用这些函数中的任何一个，则结果是不确定的。

如果一个信号被传递给一个线程等待一个读写锁定的写入，那么当从信号处理程序返回时，线程恢复等待读写锁定写入，就像它没有被中断一样。
## pthread_rwlock_unlock
### 名称

pthread_rwlock_unlock - 解锁一个读写锁对象

### 概要
````cpp
#include <pthread.h>

int pthread_rwlock_unlock(pthread_rwlock_t *rwlock);
````
### 描述
pthread_rwlock_unlock（）函数将释放一个保存在由rwlock引用的读写锁对象上的锁。如果读写锁rwlock没有被调用线程保存，结果是不确定的。

如果调用此函数来释放读写锁对象的读锁，并且此读写锁对象上还存在其他读锁，则读写锁对象保持读锁定状态。如果这个函数释放这个读写锁对象的最后一个读锁，那么这个读写锁对象将被置于没有所有者的解锁状态。

如果调用这个函数来释放这个读写锁对象的写锁，那么这个读写锁对象应该处于解锁状态。

如果锁上有线程被阻塞，调度策略将确定哪个线程将获得锁。如果支持线程执行调度选项，当调度策略SCHED_FIFO，SCHED_RR或SCHED_SPORADIC执行的线程正在等待锁定时，它们将在锁定可用时按优先级顺序获取锁定。对于同等优先级的线程，写入锁应优先于读取锁。如果不支持线程执行调度选项，那么写入锁定是否优先于读取锁定是实现定义的。

如果使用未初始化的读写锁调用这些函数中的任何一个，则结果是不确定的。
## pthread_rwlockattr_destroy
## pthread_rwlockattr_getpshared
## pthread_rwlockattr_init
## pthread_rwlockattr_setpshared
## pthread_self
### 名称
pthread_self  - 获取调用线程ID
### 概要
````cpp
#include <pthread.h>

pthread_t pthread_self（void）;
````
### 描述
`pthread_self()`函数将返回调用的线程ID

## pthread_setconcurrency
## pthread_setschedparam
## pthread_setschedprio
## pthread_sigmask
### 名称
       pthread_sigmask, sigprocmask - 检查和改变阻塞信号

### 概要
````cpp
#include <signal.h>

int pthread_sigmask(int how, const sigset_t *restrict set,
       sigset_t *restrict oset);
int sigprocmask(int how, const sigset_t *restrict set,
       sigset_t *restrict oset);
````
### 描述
`pthread_sigmask()`函数将检查或更改（或两者）调用线程的信号掩码，而不管进程中的线程数量。该函数应与`sigprocmask()`等效，不受在单线程过程中调用的限制。

在单线程的过程中，`sigprocmask()`函数将检查或更改（或两者）调用线程的信号掩码。如果参数集不是空指针，则它指向一组用来改变当前阻塞集的信号。

参数如何指示集合被更改的方式，应用程序应确保它包含以下值之一：
* SIG_BLOCK
      得到的集合应该是当前集合和集合指向的信号集合的并集。
* SIG_SETMASK
      结果集应该是set指向的信号集。
* SIG_UNBLOCK
      得到的集合应该是当前集合和集合指向的信号集合的补集的交集。

如果参数oset不是空指针，则以前的掩码应存储在oset指向的位置。如果set为空指针，则参数的值不重要，并且过程的信号掩码不变;这样可以用来查询当前被阻塞的信号。

如果在调用`sigprocmask()`之后有未挂起的未阻塞信号，那么在调用`sigprocmask()`返回之前，至少应该有一个这样的信号被发送。

不可能阻止那些不可忽视的信号。这应该由系统执行而不会导致错误被指示。

如果`SIGFPE`，`SIGILL`，`SIGSEGV`或`SIGBUS`信号在被阻塞时产生，结果是未定义的，除非信号由`kill()`函数，`sigqueue()`函数或`raise()`函数产生。

如果`sigprocmask()`失败，线程的信号掩码将不会被改变。

在多线程进程中未指定使用`sigprocmask()`函数。
## pthread_spin_destroy && pthread_spin_init
### 名称
pthread_spin_destroy,  pthread_spin_init - 销毁/初始化 一个自旋锁

### 概要
````cpp
#include <pthread.h>

int pthread_spin_destroy(pthread_spinlock_t *lock);
int pthread_spin_init(pthread_spinlock_t *lock, int pshared);
````
### 描述
pthread_spin_destroy（）函数将销毁由锁引用的旋转锁，并释放该锁使用的所有资源。直到通过对pthread_spin_init（）的另一个调用重新初始化锁之后，才会定义后续使用锁的效果。如果在线程持有锁时调用pthread_spin_destroy（），或者使用未初始化的线程旋转锁调用此函数，则结果未定义。

 pthread_spin_init（）函数将分配使用锁引用的自旋锁所需的所有资源，并将锁初始化为解锁状态。

如果支持线程进程 - 共享同步选项并且pshared的值是PTHREAD_PROCESS_SHARED，那么实现将允许任何线程访问自旋锁分配的内存，即使分配了自旋锁在由多个进程共享的内存中。

如果支持线程进程共享同步选项，并且pshared的值是PTHREAD_PROCESS_PRIVATE，或者如果该选项不受支持，则只能使用与初始化自旋锁的线程在同一进程内创建的线程来操作自旋锁。如果不同进程的线程尝试操作这种自旋锁，则行为是不确定的。

如果调用pthread_spin_init（）指定一个已经初始化的旋转锁定，结果是不确定的。如果在没有初始化的情况下使用自旋锁，则结果是不确定的。

如果pthread_spin_init（）函数失败，则锁定不会被初始化，锁定的内容也是未定义的。

只有被锁引用的对象可以用于执行同步。

在对pthread_spin_destroy（），pthread_spin_lock（），pthread_spin_trylock（）或pthread_spin_unlock（）的调用中引用该对象的副本的结果未定义。
## pthread_spin_lock && pthread_spin_trylock
### NAME

pthread_spin_lock,  pthread_spin_trylock  -  锁定一个自旋锁对象

### SYNOPSIS

````cpp
#include <pthread.h>

int pthread_spin_lock(pthread_spinlock_t *lock);
int pthread_spin_trylock(pthread_spinlock_t *lock);
````


### DESCRIPTION
pthread_spin_lock（）函数应该锁定由锁引用的自旋锁。 如果调用线程没有被另一个线程占用，调用线程将获得该锁。 否则，线程将旋转（也就是说，不应该从pthread_spin_lock（）调用中返回）直到锁定变为可用。 如果调用线程在调用时保持锁定，则结果是不确定的。 如果线程没有被锁定，pthread_spin_trylock（）函数应该锁定由lock引用的自旋锁。 否则，该功能将失败。

如果使用未初始化的旋转锁调用这些函数中的任何一个，则结果是不确定的。
## pthread_spin_unlock
## pthread_testcancel && pthread_setcancelstate && pthread_setcanceltype
### 名称
`pthread_setcancelstate`, `pthread_setcanceltype`, `pthread_testcancel` - 设置取消状态
### 概要
````cpp

#include <pthread.h>

int pthread_setcancelstate(int state, int *oldstate);
int pthread_setcanceltype(int type, int *oldtype);
void pthread_testcancel(void);
````
### 描述
`pthread_setcancelstate()`函数应原子地将调用线程的可取消状态设置为指示状态，并返回旧状态引用的位置的先前可取消性状态。 状态的合法值是`PTHREAD_CANCEL_ENABLE`和`PTHREAD_CANCEL_DISABLE`。

`pthread_setcanceltype()`函数应原子地将调用线程的可取消性类型设置为指示的类型，并返回旧类型引用的位置的先前可取消性类型。 类型的合法值是`PTHREAD_CANCEL_DEFERRED`和`PTHREAD_CANCEL_ASYNCHRONOUS`。
> POSIX的取消类型有两种，一种是延迟取消(PTHREAD_CANCEL_DEFERRED)，这是系统默认的取消类型，即在线程到达取消点之前，不会出现真正的取消；另外一种是异步取消(PHREAD_CANCEL_ASYNCHRONOUS)，使用异步取消时，线程可以在任意时间取消。

任何新创建的线程（包括首次调用main()的线程）的可取消性状态和类型将分别为`PTHREAD_CANCEL_ENABLE`和`PTHREAD_CANCEL_DEFERRED`。

`pthread_testcancel()`函数将在调用线程中创建一个取消点。 如果取消可用性被禁用,`pthread_testcancel()`函数将不起作用。
