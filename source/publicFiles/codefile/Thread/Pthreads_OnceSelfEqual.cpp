//
//  Miscellaneous.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/9.
//  Copyright © 2018年 s. All rights reserved.
//

#include <stdio.h>
#include <pthread.h>

pthread_t thread_t1;
pthread_t thread_t2;
pthread_once_t once_t = PTHREAD_ONCE_INIT;

void oncerun(void){

    printf("老子只执行一次 \n");
}

void * run(void *param){

    pthread_t tid = pthread_self();

    printf("大家好，我是%s。我的地址是(0x%lx) \n",(char *)param,((unsigned long)tid));

    pthread_once(&once_t, oncerun);

    pthread_exit(NULL);

    return NULL;
}

int main(void){

    pthread_create(&thread_t1, NULL, run, (void *)"狗子");
    pthread_create(&thread_t2, NULL, run, (void *)"猫子");

    printf("比较两个线程:%d\n",pthread_equal(thread_t1, thread_t2));

    pthread_exit(NULL);
}
