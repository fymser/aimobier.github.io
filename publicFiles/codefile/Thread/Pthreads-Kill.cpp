//
//  Pthread-Kill.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/10.
//  Copyright © 2018年 s. All rights reserved.
//
#include <errno.h>
#include <unistd.h>
#include <stdio.h>
#include <pthread.h>

pthread_t thread;

void *run(void *arg){

    while (true) {

        printf("波斯猫，眯着他的眼睛～\n");

        sleep(1);
    }

    return NULL;
}

void print(){

    int kill_ret = pthread_kill(thread,0);

    if(kill_ret == ESRCH)
        printf("指定的线程不存在或者是已经终止\n");

    else if(kill_ret == EINVAL)
        printf("调用传递一个无用的信号\n");

    else
        printf("线程存在\n");
}

int main(void){

    print();

    sleep(3);

    pthread_create(&thread, NULL, run, NULL);

    print();

    sleep(3);

    pthread_cancel(thread);

    print();
}
