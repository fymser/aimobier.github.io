---
categories: Knowledge learned
title: Spring boot Mybatis 学习
date: 2017-7-21 18:25:00
tags: [java, spring boot,mybatis]
---

{% fi http://image.msiter.com/stock-photo-220506113.jpg, mongodb, 我年华虚度，空有一身疲倦。 %}

## 开始前的闲聊
一直都想回家，北京呆不起。想回家，却发现，家里的开发职位都是java的，，，那没办法，捡起来吧

<!-- more -->

## 基本设置

在创建项目的时候，我们使用了最基本的配置，所以项目没有目录等。我们需要使用maven默认的文件配置
````
src
  main -- 开发包 
    java -- 代码包
    resources -- 资源包
  test -- 测试包
    java -- 代码包
    resources -- 资源包
````


## gradle 配置

在idea 创建一个 gradle 项目。但是本来在本地安装了一个 4.0 版本的 gradle，我在idea设置了一个 local gradle，但是却出现了一个问题。 启动服务器的时候，出现了莫名的问题
最后在statckflow中发现了解决办法就是使用默认的gradle。

之后配置 gradle 安装信息

````
group 'Farrom'
version '1.0-SNAPSHOT'


apply plugin: 'java'
apply plugin: 'war'
apply plugin: 'idea'


sourceCompatibility = 1.8

repositories {
    jcenter()
    maven { url "http://repo.spring.io/snapshot" }
    maven { url "http://repo.spring.io/milestone" }
}


dependencies {

    // 阿里巴巴 durid 数据源
    compile group: 'com.alibaba', name: 'druid', version: '1.1.1'

    // 数据 链接
    compile group: 'mysql', name: 'mysql-connector-java', version: '6.0.6'


    // Spring Boot
    compile group: 'org.springframework.boot', name: 'spring-boot-starter-web', version: '1.5.4.RELEASE'


    // Mybatis
    compile group: 'org.mybatis', name: 'mybatis', version: '3.4.4'
    compile group: 'org.mybatis', name: 'mybatis-spring', version: '1.3.1'
    compile group: 'org.mybatis.spring.boot', name: 'mybatis-spring-boot-starter', version: '1.3.0'
}
````

### 创建 Spring 配置文件

````yaml
name: Demo
server:
    port: 8090
datasource:
    url: jdbc:mysql://localhost:3306/parrom?autoReconnect=true&useSSL=false&useUnicode=true&characterEncoding=utf8
    username: root
    password: 123456
    driverClassName: com.mysql.jdbc.Driver
mybatis:
    typeAliasesPackage: com.farrom.domain
````


````java
package com.farrom.config;

import com.alibaba.druid.pool.DruidDataSourceFactory;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
public class MybatisConfig {

     @Value("${datasource.url}")
    private String url;

     @Value("${datasource.driverClassName}")
    private String driverClassName;

     @Value("${datasource.username}")
    private String username;

     @Value("${datasource.password}")
    private String password;

    @Value("${mybatis.typeAliasesPackage}")
    private String typeAliasesPackage;

    /**
     * 创建数据源
     * @Primary 该注解表示在同一个接口有多个实现类可以注入的时候，默认选择哪一个，而不是让@autowire注解报错
     */
    @Bean
    public DataSource getDataSource() throws Exception{
        Properties props = new Properties();
//        props.put("driverClassName", this.driverClassName); ##Loading class `com.mysql.jdbc.Driver'. This is deprecated. The new driver class is `com.mysql.cj.jdbc.Driver'. The driver is automatically registered via the SPI and manual loading of the driver class is generally unnecessary.
        props.put("url", this.url);
        props.put("username", this.username);
        props.put("password", this.password);
        return DruidDataSourceFactory.createDataSource(props);
    }

    /**
     * 根据数据源创建SqlSessionFactory
     */
    @Bean(name="sqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory() throws Exception {
        SqlSessionFactoryBean sqlSessionFactory = new SqlSessionFactoryBean();
        sqlSessionFactory.setDataSource(this.getDataSource());
        return sqlSessionFactory.getObject();
    }
}

````

#### 数据库 emoji mysql 适配。

在根目录下的etc创建一个文件,`my.cnf`。在文件中设置配置

````
[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4

[mysqld]
character-set-client-handshake=FALSE
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
init-connect='SET NAMES utf8mb4'
````
创建Database的时候选择 对一个的编码

该配置不需要设置任何代码。这个时候 sqlsession就已经创建好了

目前就学习了这点。。。 
