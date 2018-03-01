---
categories: 服务器
title: Spring boot 服务器
tags:
  - java
  - spring boot
  - jooq
permalink: SpringbootMybatisxx
date: 2018-03-01 13:29:00
---
以前写过一篇文章，但是那个时候感觉是很茫然，不知道为什么garde配置文件为什么这样子，不明白为什么这样设置，虽然最后也连接到了数据库，完成了增删改查，但是和没学的区别也不会很大。今天我打算好好端正我的态度，一步一步的来学习。

## 创建一个SpringBoot 项目

接下来我们要开始开发Springboot项目了。

### 创建一个 Java 项目

本项目使用的第三方包依赖管理插件是 maven，为什么不使用 grade，emmm... 随便吧。这次就想用maven。

赞很多的教程中，我能看到的都是使用maven来创建项目，比如idea，和eclipse都有相关的步骤，选择这个选择那个的....我真的是....如果放在以前，我真的就按照这些步骤来了，现在有可能真的开发时间久了，并且开发IOS的时候 Cocoapods第三方管理，所有的项目最开始都是一清二白的，什么都没有，一步步填充的，所以下意识的我想就一个单纯的文件夹开始完成接下来的教程。

### 创建一个 空的文件夹
好吧，话接上边,我们创建一个文件夹，比如名字就叫做 'Study',这个文件除了默认的 `.`和`..` 文件夹什么都没有，接下来，我们使用idea打开这个文件。之后出现了 `.idea` 文件夹，但是对我们并没有影响，好吧开始之前我们先来创建一个 `src` 接下来我就不赘述了。最后目录如下：
````
.
├── StudyJava.iml
├── src
│   └── main
│       ├── java
│       ├── resources
│       └── webapp
└── target
````
其中imi文件是idea默认的配置文件，所以没啥用处。

### 创建 pom.xml

说实话，咱们使用idea或者eclipse创建的maven，我们可以发现除了生成一个`pom.xml`，什么都没有产生了，所以其实所有的配置都在xml文件中，我们其实可以直接创建，这样子的好处，大概就是说任何一个项目都可以支持maven，没有必要必须新产生的项目才可以使用。

这些选择创建的项目其实使用了maven的命令，如下：
````
mvn archetype:generate -DgroupId={project-packaging} -DartifactId={project-name}-DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
````
我们这里就是直接创建了一个pom.xml 里面添加了一些内容。所以最后我们的样子大概如下：
````xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.mycompany.app</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <name>Maven Quick Start Archetype</name>
    <url>http://maven.apache.org</url>

</project>
````
大概的意思我不解释了，为什么呢？第一行那些我不是很明白，后面的这几行，我不想解释。

到这个时候我们的目录结构如下
````
.
├── StudyJava.iml
├── pom.xml
├── src
│   └── main
│       ├── java
│       ├── resources
│       └── webapp
└── target
````
### 配置Spring boot
接下来，咱们应该去[Spring boot官方网站](http://projects.spring.io/spring-boot/#quick-start)去学习了。我其实很希望咱们任何人在学习一个东西的时候，第一时间是去官方网站去看，毕竟人家开发的人家的文档才是最好的，我们这些学习完的人确实会有一些独特的见解或者经验可以帮助你快速而好的理解，但是因人而异，或者理解不对地方，所以第一时间应该是去官方网站而不要去搜索引擎搜索教程

来到官方网站，我们看到官方网站非常友好的教你如何快速的运行起来。

首先添加以下代码
````xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>1.5.10.RELEASE</version>
</parent>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
````
之后使用maven刷新以下这个导入需要的框架，好吧，我不使用[maven命令](http://blog.csdn.net/yangcheng33/article/details/52368766)的，直接使用的idea自带的刷新...你有兴趣的话可以研究下外链内容。

### 第一个Hello World
等到maven将第三方内容导入之后，我们就可以开发了。我们创建以下目录
````
.
├── StudyJava.iml
├── pom.xml
├── src
│   └── main
│       ├── java
│       │   └── com
│       │       └── study
│       │           ├── controller
│       │           │   └── SampleController.java
│       ├── resources
│       └── webapp
````
在`SampleController.java` 复制粘贴 Spring Boot 文档的代码，当然我们的package 不是 hello，而是
`package com.study.controller;`
````java
package com.study.controller;

import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@Controller
@EnableAutoConfiguration
public class SampleController {

    @RequestMapping("/")
    @ResponseBody
    String home() {
        return "Hello World!";
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(SampleController.class, args);
    }
}
````

这个时候我们运行main方法，在好看的注释汇总，我们的服务器就运行起来了，打开 0.0.0.0:8080.

日。。。就好了....这样子下去，我都快忘记以前 SSH 配置文件 XML，各种配置的噩梦了...

### Tomcat 可以配置

好吧，其实也非常简单 创建一下文件
````
.
├── StudyJava.iml
├── pom.xml
├── src
│   └── main
│       ├── java
│       │   └── com
│       │       └── study
│       │           ├── StudyApplication.java
│       │           ├── controller
│       │           │   └── SampleController.java
│       ├── resources
│       └── webapp
````
代码如下

目前为止来说的话我们已经可以运行起来了，接下来我们来运行到Tomcat
#### 修改打包方式

在pom.xml设置 `<packaging>war</packaging>` 如果以前是 jar 也修改 war

#### 添加 servlet-api依赖

下面两种方式都可以，任选其一
````
<dependency>
  <groupId>javax.servlet</groupId>
  <artifactId>javax.servlet-api</artifactId>
  <version>3.1.0</version>
  <scope>provided</scope>
</dependency>

<dependency>
  <groupId>org.apache.tomcat</groupId>
  <artifactId>tomcat-servlet-api</artifactId>
  <version>8.0.36</version>
  <scope>provided</scope>
</dependency>
````
#### 修改启动类，并重写初始化方法

上面我们都是用的main方法来启动的服务器，接下俩我们来修改为以下 增加 `SpringBootServletInitializer` 继承。并重写方法
````java
package com.study;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

@SpringBootApplication
public class StudyApplication extends SpringBootServletInitializer{

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return super.configure(builder);
    }

    public static void main(String[] args) {

        SpringApplication.run(StudyApplication.class,args);
    }
}
````
#### maven 打包 并运行 tomcat

将 maven 放置在 tomcat下的webapps目录下，并且启动tomcat，访问地址 localhost:8080/项目名称/接口地址

>  之前一直不明白package与  install的区别，今天测试了下。
>
 如果b项目依赖a项目，而a打了包(package),jar仅仅时打到了a项目的target下。这时编译b项目，还是会报错，找不到所依赖的a项目，说明b项目在本地仓库是没有找到它所依赖的a项目。然后，我install a项目这时，有以下日志,[INFO] Installing G:\projects\a\target\a-0.0.1-SNAPSHOT.jar to F:\repository\com\chenjun\a\0.0.1-SNAPSHOT\a-0.0.1-SNAPSHOT.jar
[INFO] Installing G:\projects\a\pom.xml to F:\repository\com\chenjun\a\0.0.1-SNAPSHOT\a-0.0.1-SNAPSHOT.pom,说明a项目已安装到本地仓库了,并且是jar和pom同时安装的.
>
这时候去compileb项目，编译通过.
>
总之，package是把jar打到本项目的target下，而install时把target下的jar安装到本地仓库，供其他项目使用.

## 集成JDBC

这个时候我们已经看到一些想过了，但是服务器只是做到这个程度肯定是不行的，我们接下来来进行数据库的链接。本博文中的使用的数据库为mysql。
````
mysql  Ver 14.14 Distrib 5.7.19, for macos10.12 (x86_64) using  EditLine wrapper
````

### maven添加依赖库

````xml
<!-- MYSQL -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
<!-- Spring Boot JDBC -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
````

### 数据库添加数据

> MySQL默认是不区分大小写的

随便创建一个数据库，并且增加一个表，我这里是创建了一个 Study 数据库并且创建了一个 Student 表。

我的代码如下
````sql
create table `Student`
(
	u_id int unsigned auto_increment,
	u_last_name varchar(20),
	u_first_name varchar(20),
	u_address varchar(255),
	u_age int,
	u_sex int,
	u_brithday timestamp,
	primary key(u_id)
)
````
我在添加数据的时候，只添加了 id last first 这三个字段...测试嘛

### 增加 Spring 配置文件

我们 Resource文件夹下，随便哪里创建一个 `application.properties` 代码如下
````
spring.datasource.url=jdbc:mysql://localhost:3306/study
#spring.datasource.name=study
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
````

### 实体类添加

我们来创建一个 Student 实体类用来接收从数据库中获取的数据
````java
package com.study.model;

public class Student {

    private int uid;
    private String ulastname;
    private String ufirstname;


    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public String getUlastname() {
        return ulastname;
    }

    public void setUlastname(String ulastname) {
        this.ulastname = ulastname;
    }

    public String getUfirstname() {
        return ufirstname;
    }

    public void setUfirstname(String ufirstname) {
        this.ufirstname = ufirstname;
    }
}
````

### 数据库查询

具体我也不写了，我使用的是 JDBCTemplete 来查询的
````
@RequestMapping("/hello")
@ResponseBody
List<Student> home() {

    String sql = "select u_Id,u_last_name,u_first_name from student";

    return jdbcTemplate.query(sql, new RowMapper<Student>() {

        @Override
        public Student mapRow(ResultSet resultSet, int i) throws SQLException {

            Student stu = new Student();
            stu.setUid(resultSet.getInt("u_id"));
            stu.setUfirstname(resultSet.getString("u_first_name"));
            stu.setUlastname(resultSet.getString("u_last_name"));
            return stu;
        }
    });
}
````

### 完成

这个时候我们请求 hello这个接口的时候就会获取到数据库中的数据了

````json
[
  {
    "uid": 1,
    "ulastname": "张",
    "ufirstname": "三"
  }
]
````

## ROM 辅助框架

这里指的是 MyBitis，hibernate，jooq等，这种框架，这里由于我们公司使用的是 jooq，所以我研究也是这个东西。

以下是官方例子中的七步学习

### 第一步：准备

好吧，其实就是 maven 配置而已。。。

好多种

#### Open Source Edition

````xml
<dependency>
  <groupId>org.jooq</groupId>
  <artifactId>jooq</artifactId>
  <version>3.10.5</version>
</dependency>
<dependency>
  <groupId>org.jooq</groupId>
  <artifactId>jooq-meta</artifactId>
  <version>3.10.5</version>
</dependency>
<dependency>
  <groupId>org.jooq</groupId>
  <artifactId>jooq-codegen</artifactId>
  <version>3.10.5</version>
</dependency>
````

#### Commercial Editions (Java 8+)
````xml
<!-- Note: These aren't hosted on Maven Central. Import them manually from your distribution -->
<dependency>
  <groupId>org.jooq.pro</groupId>
  <artifactId>jooq</artifactId>
  <version>3.10.5</version>
</dependency>
<dependency>
  <groupId>org.jooq.pro</groupId>
  <artifactId>jooq-meta</artifactId>
  <version>3.10.5</version>
</dependency>
<dependency>
  <groupId>org.jooq.pro</groupId>
  <artifactId>jooq-codegen</artifactId>
  <version>3.10.5</version>
</dependency>
````
#### ommercial Editions (Java 6+)
````xml
<!-- Note: These aren't hosted on Maven Central. Import them manually from your distribution -->
<dependency>
  <groupId>org.jooq.pro-java-6</groupId>
  <artifactId>jooq</artifactId>
  <version>3.10.5</version>
</dependency>
<dependency>
  <groupId>org.jooq.pro-java-6</groupId>
  <artifactId>jooq-meta</artifactId>
  <version>3.10.5</version>
</dependency>
<dependency>
  <groupId>org.jooq.pro-java-6</groupId>
  <artifactId>jooq-codegen</artifactId>
  <version>3.10.5</version>
</dependency>
````
#### Commercial Editions (Free Trial)
````xml
<!-- Note: These aren't hosted on Maven Central. Import them manually from your distribution -->
<dependency>
  <groupId>org.jooq.trial</groupId>
  <artifactId>jooq</artifactId>
  <version>3.10.5</version>
</dependency>
<dependency>
  <groupId>org.jooq.trial</groupId>
  <artifactId>jooq-meta</artifactId>
  <version>3.10.5</version>
</dependency>
<dependency>
  <groupId>org.jooq.trial</groupId>
  <artifactId>jooq-codegen</artifactId>
  <version>3.10.5</version>
</dependency>
````

向资本主义低头... 自然选择第一个啊

### 第二步：配置你的数据库

我这里是使用的是他官方文档中提供的sql文件，它是基于 oracle的所以修改为mysql为
````sql
use jooq;

CREATE TABLE language (
  id              INT     NOT NULL PRIMARY KEY,
  cd              CHAR(2)       NOT NULL,
  description     VARCHAR(50)
);

CREATE TABLE author (
  id              INT     NOT NULL PRIMARY KEY,
  first_name      VARCHAR(50),
  last_name       VARCHAR(50)  NOT NULL,
  date_of_birth   DATE,
  year_of_birth   INT,
  distinguished   INT
);

CREATE TABLE book (
  id              INT     NOT NULL PRIMARY KEY,
  author_id       INT     NOT NULL,
  title           VARCHAR(225) NOT NULL,
  published_in    INT     NOT NULL,
  language_id     INT     NOT NULL,

  CONSTRAINT fk_book_author     FOREIGN KEY (author_id)   REFERENCES author(id),
  CONSTRAINT fk_book_language   FOREIGN KEY (language_id) REFERENCES language(id)
);

CREATE TABLE book_store (
  name VARCHAR(400) NOT NULL UNIQUE
);

CREATE TABLE book_to_book_store (
  name            VARCHAR(225) NOT NULL,
  book_id         INTEGER       NOT NULL,
  stock           INTEGER,

  PRIMARY KEY(name, book_id),
  CONSTRAINT fk_b2bs_book_store FOREIGN KEY (name)        REFERENCES book_store (name) ON DELETE CASCADE,
  CONSTRAINT fk_b2bs_book       FOREIGN KEY (book_id)     REFERENCES book (id)         ON DELETE CASCADE
);



INSERT INTO language (id, cd, description) VALUES (1, 'en', 'English');
INSERT INTO language (id, cd, description) VALUES (2, 'de', 'Deutsch');
INSERT INTO language (id, cd, description) VALUES (3, 'fr', 'Français');
INSERT INTO language (id, cd, description) VALUES (4, 'pt', 'Português');

INSERT INTO author (id, first_name, last_name, date_of_birth    , year_of_birth)
  VALUES           (1 , 'George'  , 'Orwell' , DATE '1903-06-26', 1903         );
INSERT INTO author (id, first_name, last_name, date_of_birth    , year_of_birth)
  VALUES           (2 , 'Paulo'   , 'Coelho' , DATE '1947-08-24', 1947         );

INSERT INTO book (id, author_id, title         , published_in, language_id)
  VALUES         (1 , 1        , '1984'        , 1948        , 1          );
INSERT INTO book (id, author_id, title         , published_in, language_id)
  VALUES         (2 , 1        , 'Animal Farm' , 1945        , 1          );
INSERT INTO book (id, author_id, title         , published_in, language_id)
  VALUES         (3 , 2        , 'O Alquimista', 1988        , 4          );
INSERT INTO book (id, author_id, title         , published_in, language_id)
  VALUES         (4 , 2        , 'Brida'       , 1990        , 2          );

INSERT INTO book_store VALUES ('Orell Füssli');
INSERT INTO book_store VALUES ('Ex Libris');
INSERT INTO book_store VALUES ('Buchhandlung im Volkshaus');

INSERT INTO book_to_book_store VALUES ('Orell Füssli'             , 1, 10);
INSERT INTO book_to_book_store VALUES ('Orell Füssli'             , 2, 10);
INSERT INTO book_to_book_store VALUES ('Orell Füssli'             , 3, 10);
INSERT INTO book_to_book_store VALUES ('Ex Libris'                , 1, 1 );
INSERT INTO book_to_book_store VALUES ('Ex Libris'                , 3, 2 );
INSERT INTO book_to_book_store VALUES ('Buchhandlung im Volkshaus', 3, 1 );
````
### 第三步：生成代码

好吧这一步着实麻烦了些，来吧，看看官方文档如何说的

首先你需要准备三个文件！！！

有三个文件，可jooq，是从http://www.jooq.org/download或从中心下载Maven：

1. jooq-3.10.5.jar
  你将在你的应用程序运行jooq主图书馆
2. jooq-meta-3.10.5.jar
  您将在构建中包含的实用程序来导航您的数据库模式生成代码。这也可以用作模式爬虫。
3. jooq-codegen-3.10.5.jar
  将包含在生成中以生成数据库模式的实用程序。

好吧 就是咱们maven 引入的那三个
#### 配置jooq的代码生成器

好吧，就是一个xml文件，这个文件理你需要告诉jooq，你都需要如何去转换文件
````xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<configuration>
  <!-- Configure the database connection here -->
  <jdbc>
    <driver>oracle.jdbc.OracleDriver</driver>
    <url>jdbc:oracle:thin:@[your jdbc connection parameters]</url>
    <user>[your database user]</user>
    <password>[your database password]</password>

    <!-- You can also pass user/password and other JDBC properties in the optional properties tag: -->
    <properties>
      <property><key>user</key><value>[db-user]</value></property>
      <property><key>password</key><value>[db-password]</value></property>
    </properties>
  </jdbc>

  <generator>
    <database>
      <!-- The database dialect from jooq-meta. Available dialects are
           named org.util.[database].[database]Database.

           Natively supported values are:

               org.jooq.util.ase.ASEDatabase
               org.jooq.util.cubrid.CUBRIDDatabase
               org.jooq.util.db2.DB2Database
               org.jooq.util.derby.DerbyDatabase
               org.jooq.util.firebird.FirebirdDatabase
               org.jooq.util.h2.H2Database
               org.jooq.util.hsqldb.HSQLDBDatabase
               org.jooq.util.informix.InformixDatabase
               org.jooq.util.ingres.IngresDatabase
               org.jooq.util.mariadb.MariaDBDatabase
               org.jooq.util.mysql.MySQLDatabase
               org.jooq.util.oracle.OracleDatabase
               org.jooq.util.postgres.PostgresDatabase
               org.jooq.util.sqlite.SQLiteDatabase
               org.jooq.util.sqlserver.SQLServerDatabase
               org.jooq.util.sybase.SybaseDatabase

           This value can be used to reverse-engineer generic JDBC DatabaseMetaData (e.g. for MS Access)

               org.jooq.util.jdbc.JDBCDatabase

           This value can be used to reverse-engineer standard jOOQ-meta XML formats

               org.jooq.util.xml.XMLDatabase

           You can also provide your own org.jooq.util.Database implementation
           here, if your database is currently not supported -->
      <name>org.jooq.util.oracle.OracleDatabase</name>

      <!-- All elements that are generated from your schema (A Java regular expression.
           Use the pipe to separate several expressions) Watch out for
           case-sensitivity. Depending on your database, this might be
           important!

           You can create case-insensitive regular expressions using this syntax: (?i:expr)

           Whitespace is ignored and comments are possible.
           -->
      <includes>.*</includes>

      <!-- All elements that are excluded from your schema (A Java regular expression.
           Use the pipe to separate several expressions). Excludes match before
           includes, i.e. excludes have a higher priority -->
      <excludes>
           UNUSED_TABLE                # This table (unqualified name) should not be generated
         | PREFIX_.*                   # Objects with a given prefix should not be generated
         | SECRET_SCHEMA\.SECRET_TABLE # This table (qualified name) should not be generated
         | SECRET_ROUTINE              # This routine (unqualified name) ...
      </excludes>

      <!-- The schema that is used locally as a source for meta information.
           This could be your development schema or the production schema, etc
           This cannot be combined with the schemata element.

           If left empty, jOOQ will generate all available schemata. See the
           manual's next section to learn how to generate several schemata -->
      <inputSchema>[your database schema / owner / name]</inputSchema>
    </database>

    <generate>
      <!-- Generation flags: See advanced configuration properties -->
    </generate>

    <target>
      <!-- The destination package of your generated classes (within the
           destination directory)

           jOOQ may append the schema name to this package if generating multiple schemas,
           e.g. org.jooq.your.packagename.schema1
                org.jooq.your.packagename.schema2 -->
      <packageName>[org.jooq.your.packagename]</packageName>

      <!-- The destination directory of your generated classes -->
      <directory>[/path/to/your/dir]</directory>
    </target>
  </generator>
</configuration>
````
将他转换为中文大概是如下这样子的
````xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>  
<configuration xmlns="http://www.jooq.org/xsd/jooq-codegen-3.8.0.xsd">  
    <!-- 配置jdbc驱动连接 -->  
    <jdbc>  
        <driver>com.mysql.jdbc.Driver</driver>  
        <url>jdbc:mysql://localhost:3306/admin</url>  
        <user>root</user>  
        <password>123456</password>  
    </jdbc>  
    <generator>  
        <!-- 代码生成器 -->  
        <name>org.jooq.util.JavaGenerator</name>  
        <database>  
            <!-- 数据库类型 -->  
            <name>org.jooq.util.mysql.MySQLDatabase</name>  
            <!-- 数据库名 -->  
            <inputSchema>admin</inputSchema>  
            <!-- 生成包含，*表示包含所有内容 -->  
            <includes>.*</includes>  
            <!--剔除，此处未剔除 -->  
            <excludes></excludes>  
        </database>  
        <target>  
            <!-- 生成的代码所在的包结构 -->  
            <packageName>org.test.jooq.generated</packageName>  
            <!-- 生成的代码存放路径，默认会以src同目录开始 -->  
            <directory>src/main/java/</directory>  
        </target>  
    </generator>  
</configuration>  
````
> There are also lots of advanced configuration parameters, which will be treated in the manual's section about advanced code generation features Note, you can find the official XSD file for a formal specification at:
http://www.jooq.org/xsd/jooq-codegen-3.10.0.xsd

#### 运行jooq代码生成器

````
org.jooq.util.GenerationTool /jooq-config.xml
````
要确保以下文件放置在 classpath 下：
* The XML configuration file
* jooq-3.10.5.jar, jooq-meta-3.10.5.jar, jooq-codegen-3.10.5.jar
* The JDBC driver you configured

#### 命令行生成

1. 把配置文件和jooq*.jar三个文件和JDBC Driver 文件放到同一个目录中
2. 进入这个目录
3. 运行 Run java -cp jooq-3.10.5.jar;jooq-meta-3.10.5.jar;jooq-codegen-3.10.5.jar;[JDBC-driver].jar;. org.jooq.util.GenerationTool /[XML file]

#### 使用 maven 生成

Using the official jOOQ-codegen-maven plugin, you can integrate source code generation in your Maven build process:

````xml
<plugin>

  <!-- Specify the maven code generator plugin -->
  <!-- Use org.jooq            for the Open Source Edition
           org.jooq.pro        for commercial editions,
           org.jooq.pro-java-6 for commercial editions with Java 6 support,
           org.jooq.trial      for the free trial edition

       Note: Only the Open Source Edition is hosted on Maven Central.
             Import the others manually from your distribution -->
  <groupId>org.jooq</groupId>
  <artifactId>jooq-codegen-maven</artifactId>
  <version>3.10.5</version>

  <!-- The plugin should hook into the generate goal -->
  <executions>
    <execution>
      <goals>
        <goal>generate</goal>
      </goals>
    </execution>
  </executions>

  <!-- Manage the plugin's dependency. In this example, we'll use a PostgreSQL database -->
  <dependencies>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <version>9.4.1212</version>
    </dependency>
  </dependencies>

  <!-- Specify the plugin configuration.
       The configuration format is the same as for the standalone code generator -->
  <configuration>

    <!-- JDBC connection parameters -->
    <jdbc>
      <driver>org.postgresql.Driver</driver>
      <url>jdbc:postgresql:postgres</url>
      <user>postgres</user>
      <password>test</password>
    </jdbc>

    <!-- Generator parameters -->
    <generator>
      <database>
        <name>org.jooq.util.postgres.PostgresDatabase</name>
        <includes>.*</includes>
        <excludes></excludes>
        <!-- In case your database supports catalogs, e.g. SQL Server:
        <inputCatalog>public</inputCatalog>
          -->
        <inputSchema>public</inputSchema>
      </database>
      <target>
        <packageName>org.jooq.util.maven.example</packageName>
        <directory>target/generated-sources/jooq</directory>
      </target>
    </generator>
  </configuration>
</plugin>
````

### 第四步：获取链接

````java
// For convenience, always static import your generated tables and jOOQ functions to decrease verbosity:
import static test.generated.Tables.*;
import static org.jooq.impl.DSL.*;

import java.sql.*;

public class Main {
    public static void main(String[] args) throws SQLException{
        String userName = "root";
        String password = "";
        String url = "jdbc:mysql://localhost:3306/library";

        Connection conn = DriverManager.getConnection(url, userName, password);
    }
}
````
### 第五步：查询

````java
DSLContext create = DSL.using(conn, SQLDialect.MYSQL);
Result<Record> result = create.select().from(AUTHOR).fetch();
````
首先得到dslcontext实例我们可以写一个简单的选择查询。我们将MySQL连接的实例传递给DSL。请注意，dslcontext不关闭连接。我们必须自己做那件事。

然后我们使用DSL jooq查询返回结果的一个实例。我们将在下一步中使用这个结果。

### 第六步：处理数据

````java
for (Record r : result) {
    Integer id = r.getValue(AUTHOR.ID);
    String firstName = r.getValue(AUTHOR.FIRST_NAME);
    String lastName = r.getValue(AUTHOR.LAST_NAME);

    System.out.println("ID: " + id + " first name: " + firstName + " last name: " + lastName);
}
````

完整的代码如下

````java
package test;

// For convenience, always static import your generated tables and
// jOOQ functions to decrease verbosity:
import static test.generated.Tables.*;
import static org.jooq.impl.DSL.*;

import java.sql.*;

import org.jooq.*;
import org.jooq.impl.*;

public class Main {

    /**
     * @param args
     */
    public static void main(String[] args) throws SQLException {
        String userName = "root";
        String password = "";
        String url = "jdbc:mysql://localhost:3306/library";

        // Connection is the only JDBC resource that we need
        // PreparedStatement and ResultSet are handled by jOOQ, internally
        Connection conn = DriverManager.getConnection(url, userName, password);

        DSLContext create = DSL.using(conn, SQLDialect.MYSQL);
        Result<Record> result = create.select().from(AUTHOR).fetch();
        for (Record r : result) {
            Integer id = r.getValue(AUTHOR.ID);
            String firstName = r.getValue(AUTHOR.FIRST_NAME);
            String lastName = r.getValue(AUTHOR.LAST_NAME);

            System.out.println("ID: " + id + " first name: " + firstName + " last name: " + lastName);
        }
    }
}
````

但是其实咱们已经配置完 Spring JDBC 之后，可以直接使用反射

````java
@Autowired
DSLContext dsl;
````

差不多像这样子
````java
package com.study.controller;

import com.study.model.tables.Author;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@Controller
@EnableAutoConfiguration
public class SampleController {

    @Autowired
    DSLContext dsl;

    @RequestMapping("/hello")
    @ResponseBody
    Object[] home()  {
        return dsl.select().from(Author.AUTHOR).fetchAnyArray();
    }
}
````

## 结语

到这里 我们就结束了，因为我也是第一次使用 jooq，这些框架，很多东西不一定对，但是至少这是一个思路。

努力吧。
