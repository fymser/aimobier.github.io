---
title: Objective-c修饰符探索
tags:
  - IOS
  - ObjC
categories: 学习
permalink: Objectivecxsfts
date: 2018-01-11 11:11:11
---

最近想学习一下 objc的 一些修饰符的相关问题。
比如 "retain","strong","weak","assign"这些区别到底在哪里了，之类的，就心思从源头解决这个问题。到底线程安全还是不安全，加锁不加锁之类的到底是怎么回事儿。所以我找到了 objc的源码 打算看看到底是什么？

我们先来把objc源码目录都整理一遍,结果大概会得到

<!--more-->

## 文件结构

## 仅有h文件

objc-api.h
objc.h

objcrt.h
runtime.h
objc-private.h
objc-object.h
objc-internal.h
objc-gdb.h
objc-abi.h
objc-config.h
objc-env.h
message - h
hashtable - h

llvm-AlignOf.h
llvm-DenseMap.h
llvm-DenseMapInfo.h
llvm-MathExtras.h
llvm-type_traits.h

## 仅有mm文件

objc-typeencoding.mm
objc-sel.mm
objc-sel-old.mm
objc-opt.mm
objc-lockdebug.mm
objc-layout.mm
objc-errors.mm
objc-externalref.mm
objc-block-trampolines.mm


### h,mm文件

NSObject - h,mm
Object - h,mm
List - h,m
Protocol - h,mm
hashtable2 - h,mm
maptable - h,mm
objc-accessors - h,mm
objc-auto-dump - h,mm
objc-auto - h,mm
objc-cache-old - h,mm
objc-cache - h,mm
objc-class - h,mm
objc-exception.h
objc-file-old.h
objc-file.h
objc-initialize.h
objc-load.h
objc-os.h
objc-runtime.h
objc-runtime-old.h
objc-runtime-new.h
objc-references.h
objc-loadmethod.h
objc-lockdebug.h
objc-sel-set.h
objc-sync.h
objc-weak.h


### Objc-api.h

该文件定义了若干个宏 方法 和 宏 定义
1. `__has_feature` 是否含有特征？ 但是无论传值如何，都是返回 0(false)
2. `__has_extension` 是否含有扩展？ 直接调用的 `__has_feature` 还是返回都是 0(false)
3. `__has_attribute` 是否含有参数？ 还是都返回 0(false)
4. `OBJC_API_VERSION` OBJC API 版本。 存在两个值
    * 0 或者 没有标记: Tiger (苹果Mac OS X 10.4操作系统)以及更早之前的 为 一类
    * 2: Leopard(苹果Mac OS X 10.5操作系统) 以及更之后的系统版本 为 一类
5. `OBJC_NO_GC` 是否 NO！GC (Garbage Collection) 垃圾回收机制
    * 1 不再支持 GC 机制
    * undef(没有声明) 支持GC
    判定条件的话 如果为  TARGET_OS_EMBEDDED(？嵌入式),`iPhone`,`Win32为系统` 或者 `TARGET_OS_MAC && __x86_64h__` 则为1
6. `OBJC_NO_GC_API` 是否不再导出 关于 GC 的API
    * 1 库不需要导出与GC相关的符号. (不需要支持 GC)
    * undef(没有声明) 库必须导出任何双模式代码可能链接到的符号      
    判定条件的话 如果为 TARGET_OS_EMBEDDED(？嵌入式),`iPhone`,`Win32为系统` 则为 1
7. `NS_ENFORCE_NSOBJECT_DESIGNATED_INITIALIZER` 执行的默认初始化方法 如果为1的话 [NSObject init] 就是默认初始化方法
8. `OBJC_OLD_DISPATCH_PROTOTYPES` 等于 0 强制执行调度规则函数必须转换为适当的函数指针类型
9. `OBJC_ISA_AVAILABILITY` 每个Objective-C对象都有一个隐藏的数据结构，这个数据结构是Objective-C对象的第一个成员变量，它就是isa指针。这个参数就是说 如果为 OBJC2 的时候 就取消该 isa 指针，否则 就是可用。但是目前 是 必定为1
10. `OBJC2_UNAVAILABLE` OBJC2 是否可用
    判定条件：如果objc2 肯定是可用的 否则就表示 `__OSX_AVAILABLE_BUT_DEPRECATED` 可用单是在 `__MAC_10_5,__MAC_10_5, __IPHONE_2_0,__IPHONE_2_0` 之后 不可用
11. `OBJC_ARC_UNAVAILABLE` ARC是否可用。
    判定条件...  必定可用 ，具体可以看代码，除非我理解的前三个函数 有问题
12. `OBJC_SWIFT_UNAVAILABLE` Swift 是否可用 必定可用...
13. `OBJC_ARM64_UNAVAILABLE` ARM64 64位 架构
    * 模拟器32位处理器测试需要i386架构，
    * 模拟器64位处理器测试需要x86_64架构，
    * 真机32位处理器需要armv7,或者armv7s架构，
    * 真机64位处理器需要arm64架构。
14. `OBJC_GC_UNAVAILABLE` GC 垃圾回收机制 是否可用
15. `OBJC_EXTERN` 一个返回特定 extern 方法
    如果为c++ `extern "c"` 否则 只是 extern
16. `OBJC_VISIBLE` OBJC 是否可以使用
      * 使用一个方法或者类，一个是提供者，一个是使用者，二者之间的接口是头文件。头文件中声明了方法，
      * WIN32下在提供者那里方法应该被声明为__declspec(dllexport)
      * WIN32下在使用者那里，方法应该被声明为__declspec(dllimport)。
      * 非WIN32下 使用 `__attribute__((visibility("default")))`
17. `OBJC_EXPORT` 一个集合方法 集合了  `OBJC_EXTERN`和 `OBJC_VISIBLE`
18. `OBJC_IMPORT` 只是在后面 追加 extern 关键字
19. `OBJC_ROOT_CLASS` 指定为 根类型
20. `__DARWIN_NULL` 就是 NULL
21. `OBJC_INLINE` 就是 `__inline` 关键字
22. `OBJC_ENUM` 以及 `OBJC_OPTION` 针对于 每一种语言都会有一种设置

### objc.h
该方法 创建了一些类型

1.  建立 `objc_class` 的 另一种读法 Class。
    建立 `objc_object` 的 另一种读法 id。
    建立 `objc_selector` 的 另一种读法 SEL。

2. 创建一个`objc_object` 默认包含一个指针 `Class isa` 也就是 `objc_class isa` 对象，是否包含由`objcapi.h`     `OBJC_ISA_AVAILABILITY` 决定

3. `OBJC_OLD_DISPATCH_PROTOTYPES` 终于有了作用区别在于
    ````objc
    /// A pointer to the function of a method implementation.
    #if !OBJC_OLD_DISPATCH_PROTOTYPES
    typedef void (*IMP)(void /* id, SEL, ... */ );
    #else
    typedef id (*IMP)(id, SEL, ...);
    #endif
    ````
    目前还看不懂

4. 声明了一个 `OBJC_BOOL_DEFINED` 没有找到他的作用
5. 声明了 BOOL 和 (`OBJC_BOOL_IS_BOOL` | `OBJC_BOOL_IS_CHAR` ) 宏定义 区别在于
  如果为 iPhone 并且 为 LP64位 系统(linux 64位) 或者 是 手表系统 那么 BOOL值位 long 否则久违 char
6. 接下来定义了 `YES` 和 `NO` `NIL` 和 `nil`
7. 创建一个 宏 `__strong`
    ````objc
    /// 如果 没有定义了 __OBJC_GC__ 或者 false 拿起就是 没有 __strong
    #if ! (defined(__OBJC_GC__)  ||  __has_feature(objc_arc))
    #define __strong /* empty */
    #endif
    ````
8. 创建 `__unsafe_unretained` 和 `__autoreleasing`
9. 创建了这些方法
    1. `sel_getName` 返回一个 Char 得到 我们传递的 SEL 类型的对象的名称
    2. `sel_registerName` 通过名称像 Objective-c runTime Sysytem 中注入一个 SEL
 必须保证 SEL 注入的名称不包含 系统默认的名称 如果已经注册过
 仅仅返回 这个SEL
    3. `object_getClassName` 获取对象的类型名称
    4. `object_getIndexedIvars` 获取对象的指针？
    5. `sel_isMapped` SEL 是否可用
    6. `sel_getUid` 等同于  `sel_registerName` 但是具体在一些操作上不一样
10.  
    ````objc
    // 过时的 ARC 转换，这个东西的废除 也就是最近的事儿了
    // 使用 CFBridgingRetain, CFBridgingRelease, and __bridge 代替

    typedef const void* objc_objectptr_t;
    ````
11.
    ````objc
    #if !__OBJC2__ // 如果不是 OBJC2

    // The following declarations are provided here for source compatibility.

    #if defined(__LP64__)  // 如果是 64 位
        typedef long arith_t; //  arith_t uarith_t 都适用 大字段
        typedef unsigned long uarith_t;
    #   define ARITH_SHIFT 32
    #else
        typedef int arith_t; //  arith_t uarith_t 都适用 小字段
        typedef unsigned uarith_t;
    #   define ARITH_SHIFT 16
    #endif

    typedef char *STR;

    #define ISSELECTOR(sel) sel_isMapped(sel) // 是 否为可用
    #define SELNAME(sel)	sel_getName(sel)  // 过去 SEL 名称
    #define SELUID(str)	sel_getUid(str)  // 注册方法
    #define NAMEOF(obj)     object_getClassName(obj) // 获取类型的名称
    #define IV(obj)         object_getIndexedIvars(obj) // 获取 指针？

    #endif
    ````
### runtime.h
