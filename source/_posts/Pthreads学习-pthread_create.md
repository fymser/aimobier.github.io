---
title: pthread 线程创建
tags:
  - IOS
  - Pthreads
  - 线程
categories: 线程
permalink: pthreadxccj
date: 2018-01-10 23:22:00
---

* 在学习之前，首先来说明一下学习资料的来源。 可以在这里查看 [Apple OpenSource](https://opensource.apple.com),而如果想看到专门的代码话 查阅 [Libc-583](https://opensource.apple.com/source/Libc/Libc-583/pthreads/)，如果需要下载的话 [Libc Download](https://opensource.apple.com/tarballs/Libc/)
* 学习之前来学习如何运行cpp代码，来查看我们的代码是否正确
  1. 首先创建一个 以 `.cpp`结尾的文件
  2. 写入cpp代码
  3. 终端使用  `c++ [目标文件] -o [输出地址 缺省 目标文件所在文件夹 a.out 文件]`
  4. 终端调用 `./a.out` 就可以调用了

那么接下来就让我们学习 第一课，创建一个线程吧。

### 创建 线程
首先让我们来看一下创建线程相关的方法


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

### 让我们来创建一个线程执行几句话吧

````cpp
//
//  Cancel.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/9.
//  Copyright © 2018年 s. All rights reserved.
//

#include <stdio.h>
#include <pthread.h>

pthread_t thread1;


/**
 创建一个 线程执行的方法

 @param arg 传递的参数
 @return 返回值
 */
void * thread1Run(void * arg){

    /// 线程内 打印10次
    for (int i = 0; i < 100; i++) {

        printf("异步执行 %d \n",i);
    }

    pthread_exit(NULL);

    return NULL;
}

int main(void){

    /// 同步 打印 10次
    for (int i = 0; i < 100; i++) {

        printf("同步执行 %d \n",i);
    }

    /// 创建线程
    pthread_create(&thread1, NULL, thread1Run, NULL);

    /// 再次同步打印10次
    for (int i = 0; i < 100; i++) {

        printf("同步执行 %d \n",i);
    }

    /// 推出线程
    pthread_exit(NULL);
}

````

我们可以看到，第二次的同步打印和异步打印是交叉打印的，你一句我一句的。

### pthread_create 传参数
````cpp
//
//  Cancel.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/9.
//  Copyright © 2018年 s. All rights reserved.
//

#include <stdio.h>
#include <pthread.h>

pthread_t thread1;


/**
 创建一个 线程执行的方法

 @param arg 传递的参数
 @return 返回值
 */
void * thread1Run(void * arg){

    /// 线程内 打印10次
    for (int i = 0; i < 100; i++) {

        printf("异步执行 %s - %d \n",(char *)arg,i);
    }

    pthread_exit(NULL);

    return NULL;
}

int main(void){

    /// 同步 打印 10次
    for (int i = 0; i < 100; i++) {

        printf("同步执行 %d \n",i);
    }

    const char *name = "波斯猫";

    /// 创建线程
    pthread_create(&thread1, NULL, thread1Run, (void *)name);

    /// 再次同步打印10次
    for (int i = 0; i < 100; i++) {

        printf("同步执行 %d \n",i);
    }

    /// 推出线程
    pthread_exit(NULL);
}

````

### 参数

这些参数咱们在前面看看就好，我们具体来看看这些参数到底什么意思～ 不能一蹴而就。

### 具体实现查看

在源码中，我们可以看到 pthread_create 方法是调用了 `_new_pthread_create_suspended` 方法。而且很神奇的多了一个参数，让我们来看看吧。
