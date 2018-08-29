//
//  Pthread-Key.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/10.
//  Copyright © 2018年 s. All rights reserved.
//

#include <unistd.h>
#include <stdio.h>
#include <pthread.h>

pthread_t thread1;
pthread_t thread2;
pthread_key_t key;

struct Test {
    const char * name;
    long age;
    long sex;
};

const char * THREAD(){
    if(pthread_equal(thread1, pthread_self()))
        return "线程1";
    return "线程2";
}

void CONSOLE(struct Test test){

    printf("[%s][%p]最初创建  的对象地址[%p]  年龄->[%ld]\n",THREAD(),pthread_self(),&test,(&test)->age);

    pthread_setspecific(key,&test);

    Test* tmp = (struct Test*)pthread_getspecific(key);

    printf("[%s][%p]当前线程  的对象地址[%p]  年龄->[%ld]\n",THREAD(),pthread_self(),tmp,tmp->age);
}

void create(void *arg){

    Test* tmp = (struct Test*)arg;
    if (tmp)
        printf("[%s] 直接获取  的对象地址[%p]  年龄->[%ld]\n",THREAD(),tmp,tmp->age);

    Test* tmp1 = (struct Test*)pthread_getspecific(key);
    if (tmp1)
        printf("[%s] 方法获取  的对象地址[%p]  年龄->[%ld]\n",THREAD(),tmp1,tmp1->age);

    pthread_key_delete(key);
}

void *console1(void * arg){

    Test test1;
    test1.sex = 1;
    test1.age = 20;
    test1.name = "Buyihan";

    CONSOLE(test1);

    return NULL;
}

void *console2(void * arg){

    Test test1;
    test1.sex = 1;
    test1.age = 19;
    test1.name = "Buyihan";

    CONSOLE(test1);

    return NULL;
}

int main(void){

    int meizi = 100;

    pthread_key_create(&key, create);
    pthread_create(&thread1, NULL, console1, &meizi);
    pthread_create(&thread2, NULL, console2, NULL);
    pthread_join(thread2, NULL);
    pthread_join(thread1, NULL);
    pthread_exit(NULL);
}
