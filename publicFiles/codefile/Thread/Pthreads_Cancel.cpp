//
//  Cancel.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/9.
//  Copyright © 2018年 s. All rights reserved.
//

#include "unistd.h"
#include <stdio.h>
#include <pthread.h>

pthread_t xueyi;
pthread_t fuwenpei;

void *cancel(void *arg){

    for (int i = 0; i < 100; i+=30) {

        printf("傅文佩:怒气值[%d] \n",i);

        sleep(2);
    }

    printf("傅文佩:受不了了！闭嘴！\n");

    if (pthread_cancel(xueyi) == 0) {

        printf("可算闭嘴了!!!\n");
    }else{

        perror("啥？你厉害！ 再见！\n");
    }


    pthread_exit(NULL);

    return NULL;
}

void clean_func(void *arg){

    printf("嗯嗯？咒语？\n");
}

void *console(void *arg){

    pthread_cleanup_push(clean_func,NULL);

    while (true) {

        printf("雪姨：傅文佩，开门啊，别躲在里面不出声，我知道你在家！\n");

        sleep(1);
    }

    pthread_cleanup_pop(0);

    pthread_exit(NULL);

    return ((void *)(long)1);
}

int main(void){

    pthread_create(&xueyi, NULL, console, NULL);
    pthread_create(&fuwenpei, NULL, cancel, NULL);

    long result;

    pthread_join(xueyi, (void **)&result);

    printf("世纪骂战结束-%ld\n",result);

    pthread_exit(NULL);
}
