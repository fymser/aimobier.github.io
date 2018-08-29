//
//  Creating-Join.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/9.
//  Copyright © 2018年 s. All rights reserved.
//

#include <stdio.h>
#include <pthread.h>

#define ThreadCount 3
#define PrintCount 10

void *continuePrint(void *params){

    long pid = (long)params;

    for (int i = 0; i < PrintCount; i++) {

        printf("PID%ld: Print-> [%d]\n",pid,i);
    }

    pthread_exit((void *)0);

    return NULL;
}

void create(bool join){

    pthread_t threads[ThreadCount];

    pthread_attr_t attr;
    pthread_attr_init(&attr);
    pthread_attr_setdetachstate(&attr,PTHREAD_CREATE_JOINABLE);

    for (long i = 0; i < ThreadCount; i++) {

        pthread_create(&threads[i], &attr, continuePrint, (void *)i);
    }

    if (join) {

        for (long i = 0; i < ThreadCount; i++) {

            pthread_join(threads[i], NULL);
        }
    }

    printf("现在是开始还是结束呢？？？？\n");

    pthread_attr_destroy(&attr);
    pthread_exit(NULL);
}


int main(void){

    create(true);

    create(false);
}
