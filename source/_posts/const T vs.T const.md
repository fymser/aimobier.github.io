---
categories: 学习资料
title: const T vs.T const
tags:
  - c
  - c++
  - const
permalink: constTvsTconst
date: 2018-01-22 17:32:00
---

> [原文下载](http://uploadingit.com/file/n7xuzf5mu71qqvkm/Dan_Saks_const_T_vs_T_const.pdf)         
[转载](http://www.voidcn.com/article/p-bgmtdknb-bq.html)

在最后一栏中，我讨论了为什么编译器可以将数据放入ROM的规则在C ++中比在C.1中更复杂一些，关于这个话题我们会进行更多的讨论。但是在我做之前 ，我想回复我通过Phil Baure的电子邮件收到的以下查询：

>  我们在使用typedef和const的时候遇到了一个非常有趣的问题。我希望您评论下这种问题。我在想我们是不是碰巧遇到了一些我们不知道的C语言规则。
我们正在Hitachi SH-2 32位 RISC微控制器上使用Hitachi C编译器。我们认为下面的代码：
````cpp
typedef void *VP;
const VP vectorTable[] = {..<data>..};  // (1)
````
应该等同于
````cpp
const void *vectorTable[] = {..<data>..}; // (2)
````
“然而，连接器把vectorTable放在（1）中CONSTANT部分，但是(2)中方在了DATA部分。”
“这是合适的做法吗或者还是编译器的一个BUG?”

<!--more-->


这是一个恰当的做法，不是BUG。你确实碰巧遇到了一些你显然不知道的C语言规则。不要沮丧，我的朋友，不仅仅是你这样，我相信很多其他的C和C++程序员对这些规则都很困惑，这也正是我这期专栏想要解决的问题。

我在早期专栏里提到过一些这些规则，然而，现在回顾那些文章，我认为我没有充分的解释清楚这个问题的根本所在，现在就让我再解释一次。

### 声明符
这里是第一个要点，
每一条C/C++声明语句都有两个基本部分组成：零个或多个 **声明说明符(declaration specifier)** 序列（零个应该是显式的不写返回值的函数，译者注）；以及一个或多个 **声明符(declarator)序列**，中间用逗号隔开。
例如
````cpp
/// 其中  static unsigned long int 为  声明说明符(declaration specifier)
/// 而  *x[N] 则为  声明符(declarator)序列
static unsigned long int *x[N];
````
一个声明符就是一个被声明的名字，可能还会被若干个操作符修饰，如*, [], (),和&(C++中的引用)。正如你已经知道的，符号“*”代表“指向...的指针”而“[]”意思是“...的数组”。这样*x[N]这个声明符就表示x是一个N个指向...的指针的数组，这里的“...”指声明说明符中的类型。例如：
````cpp
/// 其中  static unsigned long int 为  声明说明符(declaration specifier)
/// 而  *x[N] 则为  声明符(declarator)序列
static unsigned long int *x[N];
````

表示声明变量对象x是一个含有N个指向unsigned long int型数据的指针的数组（在后面将解释关键词static并不对类型起作用）。

我是怎么知道*x[N]是一个指针数组而不是数组指针的呢？这里遵循以下规则：在声明语句中的操作符的优先级和在表达式里的操作符的优先级是一样的。

例如，如果你参照下[最新的C/C++的优先级列表](http://en.cppreference.com/w/cpp/language/operator_precedence)，你会看到[]比*优先级高，这样在声明符*x[N]中x被解析成数组，而不是指针。


圆括号在声明符中有两种角色：函数调用操作符和分组标志。作为函数调用操作符，()与[]具有相同的优先级；作为分组标志，()拥有最高的优先级。例如*f(int)中f是一个返回指针类型的函数，而在(*f)(int)中f是一个指向函数的指针。

一个声明符可能会包含不止一个标识符（ID）。声明符*x[N]包含两个标识符，x和N。其中仅有一个是在本声明语句中被声明的，称作声明符ID，其它的必须在前面已经声明过。也就是说x[N]声明的声明符ID是x。

一个声明符当然也可以不包含操作符。像一个极其简单的声明语句：

int n;

声明符就是标识符n。

### 声明说明符
声明说明符可以指定声明符为int、unsigned等内置类型，或者是typedef定义的类型(根据个人理解译，译者注)，也可以是存储类说明符，像extern或者static。在C++中还可以是inline或者virtual这类的函数说明符。

这里引出另一个要点：

类型说明符指明了声明符ID的类型，其他的说明符对声明符ID的类型没有直接影响。

例如：

````cpp

static unsigned long int*x[N];
````

声明符ID x是一个含有N个指向unsigned long int数据的指针的数组，关键词static表明x静态分配存储。

在你信中提到的例子让我怀疑你可能误认为关键字const和volatile不是类型说明符。而事实上const和volatile都是类型说明符。(在C参考手册中const和volatile是type qualifier,而不是type specifier.这里不知为什么作者不加以区分.译者注)

例如，在（2）中的const并不是直接修饰vectorTable，而是直接修饰void。

````cpp
const void*vectorTable[] = {..<data>..};          // (2)
````
上面语句声明vectorTable为一个指向const void类型的指针的数组，而你却希望它是一个指向void的只读指针的数组。

这里还有一个要点:

在声明语句中的声明说明符的顺序无关紧要。

例如：

````cpp
const VP vectorTable[]
````

等价于

````cpp
VP const vectorTable[]
````

而

````cpp
const void *vectorTable[]
````

等价于

````cpp
void const *vectorTable[]。
````

我们大都倾向于把存储器类声明符（比如static）放在最左边，但这仅仅是一个常见的约定，C语言并没有要求这么做。

   和其他声明说明符不同，const和volatile是唯一的两个可以出现在声明符中的声明说明符。

例如

void *const vectorTable[]

中的const就出现在声明符中，这种情况下不能改变关键词的顺序，例如

*const void vectorTable[]

就是个错误的例子。

### 一种清晰的编码风格

正如我前面所解释的，声明说明符的顺序对编译器来说无关紧要，因此下面的两条声明等价

````cpp
const void *vectorTable[] // (3)

void const *vectorTable[] // (4)
````

几乎所有的C和C++程序员都倾向于把const和volatile放在其他类型说明符的左边，像(3)一样，而我更喜欢写在右边，类似(4)，并且强烈推荐这种方式。

尽管C和C++大都是按照从上自下和从左自右的顺序（结合），但指针的声明某种意义上却是逆着来。也就是说指针声明符是从右向左的，把const放在其他声明说明符的右边就可以严格的从右往左分析了。例如

````cpp
T const *p;
````

声明了一个指向const T类型的指针，而

````cpp
T *const p;
````

声明了一个只读指针，指向T类型。

在同时使用const和typedef定义的类型的声明语句中，这种方法会降低分析的难度。使用最初的信中的例子：

````cpp
typedef void *VP;

const VP vectorTable[]。

````

一种解释是在原处替换VP：

````cpp
const VP vectorTable[]

const void*vectorTable[]
````

这似乎使得vectorTable是一个存放若干个指向const void类型的指针的数组，这是错误的！

正确的解释是替换VP为

````cpp
const VP vectorTable[]

void *const vectorTable[]
````

这样，vectorTable是存放若干个指向void的只读指针的数组，但这并不是那么容易就可以看出来的。

把const写在最右边便能更容易的分析出正确结果：

````cpp
VP const vectorTable[]

void *const vectorTable[]
````

现在，我意识到我在推荐一种极少人采用的风格。几乎所有的人都把const放在最左边，但是考虑到很少有人真正理解他们在使用const时究竟在做什么，“别人都这么做”并不能作为支持这种流行的风格的论据。我们为何不抵制这种趋势，去尝试一种更加清晰的代码书写风格呢？

只要我还在从事这个行业，我还要反对另外一种类似的风格（这儿不好翻译，不过不影响理解）。虽然C程序员好像都没有这种倾向，但是许多c++程序员却不幸的养成了这样一个书写习惯：

````cpp
const int* p;
````

而不是

````cpp
const int *p;
````

也就是说，他们使用空格将*和声明说明符连在一起，而不是和声明符。我真的认为C++程序员这么做是在给自己和别人制造麻烦。的确，空格的位置对编译器来说没有任何区别，但是把空格放在*后面会使人对声明的结构产生一种错误的印象。认清最后一个声明说明符和声明符的界限是理解声明的一个关键点。像上面那样用空格把声明符分开只会使情况变的更加复杂。

我希望我解答了你的疑问并澄清了相关问题。
