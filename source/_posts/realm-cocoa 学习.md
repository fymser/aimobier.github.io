---
title: Realm-cocoa 学习
tags:
  - DB
  - realm
categories: IOS
date: 2016-03-03 20:53:35
---
![](/publicFiles/images/stock-photo/stock-photo-181146547.jpg "如果没有见过光明，我本可以忍受黑暗。")

PS:以下内容均为项目为Swift的基础，如果需要Object－c请查阅Realm的[Object－c文档](https://realm.io/docs/objc/latest)。

前些日子在看第一届《中国Swift开发者大会》的时候，听到了realm这个数据库，说到了运行速度方面，相较于CoreData可以有很大的提升。再加上之前在做项目的时候，觉的coredata的很多配置让我觉的不爽，很是繁琐。所以就想看一看realm到底如何，学习了一天觉的很好，固决定记录一下。因为也不知道怎么讲解，所以我会尝试翻译realm官网的文档，再加上我的理解进行解释。

> Realm is a mobile database
hundreds of millions of people rely on

<!--more-->

## 散记

这是[Realm](https://realm.io/)官网的对于自己的解释。

realm可以快速有效的编写应用程序的本地持久化，它的代码大概就是下面这个样子：
````swift
// 先创建一个你想要持久化的对象的模型，Object 是 Reaml 自己定义的对象
class Dog: Object {
  dynamic var name = ""
  dynamic var age = 0
}
class Person: Object {
  dynamic var name = ""
  dynamic var picture: NSData? = nil // 这是一个可选类型
  let dogs = List<Dog>()
}

// 这是实例化一个Realm对象的时候，就像咱们平时创建Class对象一样的
let myDog = Dog()
myDog.name = "Rex"
myDog.age = 1
print("name of dog: \(myDog.name)")

// 得到一个Realm对象
let realm = try! Realm()

// 查询这个狗小于两岁的，其实咱们看着代码就可以理解了，它使用了链式代码结构，很容易看懂
let puppies = realm.objects(Dog).filter("age < 2")
puppies.count // => 0 比如现在的到的数目是0，因为现在咱们还没有添加任何数据

// 把咱们的上面创建的狗的对象，添加到数据库中
try! realm.write {
  realm.add(myDog)
}

// 再次查看数量的时候，不需要再进行一次查询，Realm会自动的为你完成更新
puppies.count // => 1

// 你也可以更新你的数据内容在任何线程
dispatch_async(dispatch_queue_create("background", nil)) {
  let realm = try! Realm()
  let theDog = realm.objects(Dog).filter("age == 1").first
  try! realm.write {
    theDog!.age = 3
  }
}
````

## 教程

### **项目中如何添加 Realm 框架**

主要有下面的三种集成方式

#### 使用Dynamic Framework：
 * 下载Realm安装包[最新版本](https://static.realm.io/downloads/swift/realm-swift-0.98.3.zip)
 * 根据你的需要，将你下载文件解压后， 从/ios/swift-2.1.1（IOS设备） 或者  tvos/（Apple电视设备） 再或者 osx/swift-2.1.1/（mac电脑设备） 这三个目录中，选择自己需要的文件，将其拖入项目中，并且要选中“如果需要请勾选”选项
 * 在你的项目中 Build Settings ，为Framework Search Paths 设置ealmSwift.framework 路径
 * 如果使用Realm 在 IOS，watchOS或者TvOS，在Build Phase 创建一个新的 “Run Script Phase”，下面写上`bash "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/Realm.framework/strip-frameworks.sh"`这一步是需要解决应用程序商店提交bug时存档通用二进制文件。
#### 使用CocoaPods
 * 安装`CocoaPods`0.39.0 版本或者更新的版本.
 * 在你的Podfile文件中添加`use_frameworks!` 和 `pod 'RealmSwift'`
 * 在终端中运行 `pod install`
 * 打开 `＊.xcworkspace` 项目
#### 使用Carthage
 * 安装 `Carthage` 0.9.2 或者更新的版本
 * 在你的Cartfile文件中添加`"realm/realm-cocoa"`
 * 运行 `carthage update`.
 * 从 Carthage/Build/ 拖拽RealmSwift.framework 和 Realm.framework 到 General 下面的“Embedded Binaries”
 * iOS/watchOS/tvOS: 在你的项目targets的 “Build Phases”设置项中，点击“＋”好按钮，添加一个新的“New Run Script Phase”，内容如下`/usr/local/bin/carthage copy-frameworks`和路径添加到框架下您想要使用“输入文件”,如`$(SRCROOT)/Carthage/Build/iOS/Realm.framework`,
`$(SRCROOT)/Carthage/Build/iOS/RealmSwift.framework`这个脚本是在[应用程序商店提交错误](http://www.openradar.me/radar?id=6409498411401216)引发了普遍的二进制文件。确保这一阶段后,“嵌入框架”阶段。

### 创建数据模型

<a name='方便快捷的创建Realm模型'></a><br/><br/>
#### 方便快捷的创建Realm模型

首先需要安装`Alcatraz `,在终端里面执行以下命令.如果执行失败，请翻墙后在尝试
````shell
curl -fsSL https://raw.githubusercontent.com/supermarin/Alcatraz/deploy/Scripts/install.sh | sh
````

安装完成之后，重启xcode就可以在菜单window选项下面看到一个Package Manager 选项，点击 安装package ，搜索 Xcode Plugin ，之后，再重启。创建创建文件，就可以文件类型中有一个Realm选项，点击创建。之后生成文件！  你会发现！！SHIT！！！！！我不如自己写了！！！！！！！

<a name='创建Realm 数据模型'></a><br/><br/>
#### 创建Realm 数据模型

其实创建Realm数据模型的方法超级简单，就和咱们平时创建Class是一样一样的。
````swift
import RealmSwift

// 狗的数据模型
class Dog: Object {
    dynamic var name = ""
    dynamic var owner: Person? // 狗的主人是可以为空的
}
````
但是，在们必须知道他都允许咱们创建什么类型的数据。

这样子咱们创建数据模型的时候就没有问题了吧。当然Realm是支持绑定关系的。一对一，一对多之类的，都可以的。


<a name='数据的操作'></a><br/><br/>
### 数据的操作

<a name='向Realm插入数据'></a><br/><br/>
#### 向Realm插入数据

终于迎来了，咱们的增删改查了。

当你定义一个模型你可以实例化对象子类和新实例添加到域。考虑一下这个简单的模型:
````swift
class Dog: Object {
    dynamic var name = ""
    dynamic var age = 0
}
````
我们可以以下几个方式创建对象:
````swift
// (1) 先创建狗的对象，然后在给予其赋值
var myDog = Dog()
myDog.name = "Rex"
myDog.age = 10

// (2) 使用字典创建
let myOtherDog = Dog(value: ["name" : "Pluto", "age": 3])

// (3) 使用一个Array创建y。
let myThirdDog = Dog(value: ["Fido", 5])
````

1.最显而易见的就是 直接创建对象，并且赋值
2.也可以使用字典实例化对象，但是！要使用数据模型中对应的！的键和值。
3.最后,可以使用数组实例化对象。但是要注意！数组中的值，必须和数据模型中的属性的顺序保持一致

创建完成对象之后就是把它放入数据库里面了，你可以像下面的方法一样放进数据库
````swift
// 创建一个用户对象，并且赋值
let author = Person()
author.name = "David Foster Wallace"

// 得到默认的Realm对象
let realm = try! Realm()
// 你只需要这么做一次

// 添加这个对象到Realm
try! realm.write {
  realm.add(author)
}
````

这样就在数据库中，添加了一个对象了。

<a name='Realm修改数据'></a><br/><br/>
#### Realm修改数据

Realm 提供很多方式去修改数据，请选择适合自己的方式进行修改

<a name='Typed Updates'></a><br/><br/>
##### Typed Updates
你可以修改任何对象的属性，在write进程中
````swift
// Update an object with a transaction
try! realm.write {
  author.name = "Thomas Pynchon"
}
````

<a name='根据数据的主键进行修改'></a><br/><br/>
##### 根据数据的主键进行修改

重写数据模型的`Object.primaryKey()`方法可以设置模型的主键，声明一个主键，允许对象可以通过主键进行有效的查询和修改，并强制每个值的唯一性。一旦一个对象添加到Realm，主键就不能更改
````swift
class Book: Object {
  dynamic var id = 0
  dynamic var price = 0
  dynamic var title = ""

  override static func primaryKey() -> String? {
    return "id"
  }
}
````

因为这个数据模型含有主键，所以再向Realm添加一个对象时，如果已经存在同样主键的对象时，Realm会自动更新前一个数据的其它不一样的属性。而如果不存在这个主键的对象，Realm会创建一个新的对象
````swift
// 假设Realm中存在一个主键为1的对象的时候
let cheeseBook = Book()
cheeseBook.title = "Cheese recipes"
cheeseBook.price = 9000
cheeseBook.id = 1

// id==1，修改这个书的属性
try! realm.write {
  realm.add(cheeseBook, update: true)
}
````

你也可以通过一个字典的方式，指定主键和你要修改的属性，来进行修改用户
````swift
// 假设数据库中已经存在一个主键为1的Book时
try! realm.write {
  realm.create(Book.self, value: ["id": 1, "price": 9000.0], update: true)
  // the book's `title` property will remain unchanged.
}
````

<a name='修改大批量数据'></a><br/><br/>
##### 修改大批量数据

可以获取一群数据后，指定这些数据其中的某些数据，或者全部数据。 的某一歇属性值。
````swift
let persons = realm.objects(Person)
try! realm.write {
 // 设置第一个人的 isFirst对象为True
 persons.first?.setValue(true, forKeyPath: "isFirst")
  // 把每个人的所居住的行星，设置为地球
  persons.setValue("Earth", forKeyPath: "planet")
}
````


<a name='Realm删除数据'></a><br/><br/>
#### Realm删除数据

当用户想删除某一个对象的时候，查询出来，之后～

````swift
// let cheeseBook = ... Book stored in Realm

//删除一个对象，在Wirte交易中。
try! realm.write {
  realm.delete(cheeseBook)
}
````
你也可以删除Realm中的全部数据，这很快速

````swift
// 删除Realm中所有的对象
try! realm.write {
  realm.deleteAll()
}
````


<a name='Realm查询数据'></a><br/><br/>
#### Realm查询数据

Realm称为这么受欢迎的数据库的原因来了！咱们看她们官方的解释。

>Queries return a Results instance, which contains a collection of Objects. Results have an interface very similar to Array and objects contained in a Results can be accessed using indexed subscripting. Unlike Arrays, Results only hold Objects of a single subclass type.

查询返回一个结果实例，它包含一个对象集合。结果类似于Array一样的东西，可以使用下标来进行每一个数据的访问。和Arrays不一样的地方在于,查询结果只持有一种类型的对象。

>All queries (including queries and property access) are lazy in Realm. Data is only read when the properties are accessed.

在Realm中，所有的查询（这里面包括了查询和属性的访问）都是懒加载的。数据仅仅在数据访问的时候再进行唯一的一次读取

那么就让我们来试试吧。

````swift
let dogs = realm.objects(Dog) // 这样子就查询了Realm数据库中所有的狗

````


<a name='条件筛选'></a><br/><br/>
#### 条件筛选

如果你熟悉`nspredicate`，那么你已经到了指导如何查询的境界。对象、Realms，列表，和结果都提供了方法，查询一个结果Arrays 可以传递一个`nspredicate`实例，谓词字符串，或谓格式字符串。
例如，检索所有狗的颜色棕褐色和名字首“B”从默认的境界：

````swift
// 查询使用谓词字符串
var tanDogs = realm.objects(Dog).filter("color = 'tan' AND name BEGINSWITH 'B'")

// 查询使用 NSPredicate 实例
let predicate = NSPredicate(format: "color = %@ AND name BEGINSWITH %@", "tan", "B")
tanDogs = realm.objects(Dog).filter(predicate)
````

看到苹果的[谓词编程指南](https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/Predicates/AdditionalChapters/Introduction.html)建立谓词的更多信息和使用[我们的nspredicate列表](https://realm.io/news/nspredicate-cheatsheet/)。领域支持许多共同的谓词：

* 比较操作数可以是属性名称或常量。至少一个操作数必须是一个属性名。
* 比较运算符= =，<，> =，>，！=，支持`Int`, `Int8`, `Int16`, `Int32`, `Int64`, `Float`, `Double` 和 `NSDate` 属性类型。如: `age == 45`
* 身份比较 == ，!= ，`Results<Employee>().filter("company == %@", company)`
* 比较运算符 = 和 != 需要`Bool`属性的支持。
* 字符串和NSData性质，我们我们支持 `==`, `!=`,`BEGINSWITH`,`CONTAINS`, and`ENDSWITH` ，如名称中 `CONTAINS ‘Ja’`
* 不区分大小写的比较字符串，如:`CONTAINS[c] ‘Ja’`。请注意只有字符`A-Z`和`a-z`会被忽略。
* Realm支持以下复合操作：: `AND`, `OR`, and `NOT`. 例如：` name BEGINSWITH ‘J’ AND age >= 32`
* 包含操作符号 IN，  如 名字 `name IN {‘Lisa’, ‘Spike’, ‘Hachi’}`
* 我们可以比较属性是否为空，如：`Results<Company>().filter("ceo == nil")`.注意，境界把Nil作为一个特殊的值而不是一个属性的缺失，所以不像SQL零等于本身。
* 任何的比较，如有 `student.age＜21`
* 聚合表达式`@count`, `@min`, `@max`, `@sum` 和 `@avg`Realm都支持。例如：`realm.objects(Company).filter("employees.@count > 5")`。找到所有员工在五个以上的公司
* 子查询的限制和支持：
 * `@count`在子查询表达式是唯一的。
 * `SUBQUERY(…).@count`必须和一个常量进行比较
 * 相关子查询现在还不支持



<a name='排序'></a><br/><br/>
##### 排序
结果允许您在一个或多个属性的基础上指定一个排序标准和顺序。例如，下面的例子中狗按照名字来进行排序返回：

````swift
let sortedDogs = realm.objects(Dog).filter("color = 'tan' AND name BEGINSWITH 'B'").sorted("name")
````


<a name='链式查询'></a><br/><br/>
##### 链式查询

Realm 和其它的查区别在于，他每一个查询结果都拥有继续查询的能力，这样用户就可以对自己查询的结果进行进一步的询问。例如：我们先查找了一群棕色的狗，之后又想查询处其中名字以“B”开头的狗。

````swift
let tanDogs = realm.objects(Dog).filter("color = 'tan'")
let tanDogsWithBNames = tanDogs.filter("name BEGINSWITH 'B'")
````

<a name='Realm版本迁移'></a><br/><br/>
### Realm版本迁移

其实一般的版本迁移有两种情况，第一种。删除了某些字段

````swift
class Person: Object {
    dynamic var firstName = ""
    dynamic var lastName = ""
    dynamic var age = 0
}
````

To:

````swift
class Person: Object {
    dynamic var fullName = ""
    dynamic var age = 0
}
````

接下来，你将进行

````swift
// 在你的(application:didFinishLaunchingWithOptions:)

let config = Realm.Configuration(
  // 设置一个新的版本，如果你从来没有设置过版本，那么默认版本就是0
  schemaVersion: 1,

  /// 设置一个找到不一样版本的回调方法
  migrationBlock: { migration, oldSchemaVersion in
    // 因为我们没有设置过版本，所以 oldSchemaVersion < 1
    if (oldSchemaVersion < 1) {
      // 什么都不用做
      // Realm 将自动检测新的属性和删除的属性
      // 并会自动更新磁盘模式
    }
  })

// 告诉Realm 使用这个新的配置作为默认配置
Realm.Configuration.defaultConfiguration = config

// 接下来就让我们获得默认的对象吧
let realm = try! Realm()
````

而如果你添加了一些字段，比如咱们不想要FirstName和LastName了，我们希望他变成一个字段！`fullName`！

````swift
// 在你的(application:didFinishLaunchingWithOptions:)

Realm.Configuration.defaultConfiguration = Realm.Configuration(
  schemaVersion: 1,
  migrationBlock: { migration, oldSchemaVersion in
    if (oldSchemaVersion < 1) {
      // 枚举所有的属性
      migration.enumerate(Person.className()) { oldObject, newObject in

        // 从旧的对象中获取之前存储的东西
        let firstName = oldObject!["firstName"] as! String
        let lastName = oldObject!["lastName"] as! String
        // 设置到新的对象中的属性上去
        newObject!["fullName"] = "\(firstName) \(lastName)"
      }
    }
  })

````

还有一种情况：从版本0 直接 升到 版本2

````swift
Realm.Configuration.defaultConfiguration = Realm.Configuration(
  schemaVersion: 2,
  migrationBlock: { migration, oldSchemaVersion in
    // The enumerateObjects:block: method iterates
    // over every 'Person' object stored in the Realm file
    migration.enumerate(Person.className()) { oldObject, newObject in
      // Add the `fullName` property only to Realms with a schema version of 0
      if oldSchemaVersion < 1 {
        let firstName = oldObject!["firstName"] as! String
        let lastName = oldObject!["lastName"] as! String
        newObject!["fullName"] = "\(firstName) \(lastName)"
      }

      // Add the `email` property to Realms with a schema version of 0 or 1
      if oldSchemaVersion < 2 {
          newObject!["email"] = ""
      }
    }
  })

// Realm will automatically perform the migration and opening the Realm will succeed
let realm = try! Realm()

````


<a name='Realm数据变化通知'></a><br/><br/>
### Realm数据变化通知

结果或列表是通过调用`addnotificationblock`方法在其数值发生变化的时候给予通知这是可能的。
每一次写事务提交时，在其他线程上的其他线程发送通知到其他实例：

````swift
// 注册通知
let token = realm.addNotificationBlock { notification, realm in
    viewController.updateUI()
}

// 稍后
token.stop()
````

当然你也可以注册某一范围的数值发生变化的时候，进行给予通知
````swift
// 大于5岁的人年纪发生变化的时候进行统治
let token = realm.objects(Person).filter("age > 5").addNotificationBlock { results, error in
    // results 就已经是 `realm.objects(Person).filter("age > 5")`的结果集了
    viewController.updateUI()
}
// 稍后
token.stop()
````


其它更详细的文档请访问 [Realm－Swift文档](https://realm.io/docs/swift/latest/)
